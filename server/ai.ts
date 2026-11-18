import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { GoogleGenAI, Type } from '@google/genai';
import { SCENARIOS, type ScenarioDefinition } from '../src/types/studio.ts';
import { appendGenerationLog, getIntegrationStatus, getRuntimeConfig } from './db.ts';
import { saveOriginalAndWatermarkedPreview } from './watermark.ts';

export interface GenerationScenarioSuccess {
  photoId: string;
  scenarioId: string;
  scenarioTitle: string;
  originalPath: string;
  previewPath: string;
  createdAt: string;
}

export interface GenerationBatchResult {
  ok: boolean;
  providerUsed?: 'cloudflare-workers-ai' | 'google-genai';
  generated: GenerationScenarioSuccess[];
  errorCode?: string;
  errorMessage?: string;
}

interface SubjectAnalysisResult {
  subjectCategory: 'human_baby' | 'dog' | 'cat' | 'other_animal';
  speciesOrSubjectLabel: string;
  identityFeatures: string;
  lightingAndColorsToHarmonize: string;
}

interface ImageEditingProvider {
  id: 'cloudflare-workers-ai' | 'google-genai';
  modelName: string;
  generateEditedPortrait(params: {
    subjectBuffer: Buffer;
    scenarioRefBuffer: Buffer;
    prompt: string;
  }): Promise<Buffer>;
}

function getScenarioReferenceImageBuffer(scenario: ScenarioDefinition): Buffer | null {
  const candidates = [
    path.resolve(process.cwd(), 'src', 'assets', 'images', scenario.referenceImageFilename),
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '..',
      'src',
      'assets',
      'images',
      scenario.referenceImageFilename
    ),
  ];
  for (const refPath of candidates) {
    if (fs.existsSync(refPath)) {
      return fs.readFileSync(refPath);
    }
  }
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPermanentQuotaOrBillingError(rawMessage: string): boolean {
  return (
    /FreeTier|limit:\s*0|billing|RESOURCE_EXHAUSTED|\b429\b/i.test(rawMessage) &&
    /limit:\s*0|FreeTier|PerDay|billing/i.test(rawMessage)
  );
}

function isTransientRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  if (isPermanentQuotaOrBillingError(msg)) {
    return false;
  }
  return /\b503\b|UNAVAILABLE|high demand|ECONNRESET|ETIMEDOUT/i.test(msg);
}

function classifySubjectFromDescription(description: string): {
  subjectCategory: 'human_baby' | 'dog' | 'cat' | 'other_animal';
  speciesOrSubjectLabel: string;
} {
  const lower = description.toLowerCase();
  if (/\b(dog|puppy|puppies|canine|retriever|poodle|bulldog|terrier|dachshund|labrador|pug|chihuahua|cachorro|filhote de cão)\b/i.test(lower)) {
    return { subjectCategory: 'dog', speciesOrSubjectLabel: 'dog' };
  }
  if (/\b(cat|kitten|kitties|feline|tabby|siamese|persian|gato|gatinho)\b/i.test(lower)) {
    return { subjectCategory: 'cat', speciesOrSubjectLabel: 'cat' };
  }
  if (/\b(rabbit|bunny|hamster|guinea pig|bird|parrot|pet|animal)\b/i.test(lower) && !/\b(baby|infant|child|newborn|toddler|boy|girl)\b/i.test(lower)) {
    return { subjectCategory: 'other_animal', speciesOrSubjectLabel: 'pet animal' };
  }
  return { subjectCategory: 'human_baby', speciesOrSubjectLabel: 'newborn baby' };
}

async function analyzeSubjectWithCloudflareVision(
  accountId: string,
  apiToken: string,
  subjectBuffer: Buffer
): Promise<SubjectAnalysisResult> {
  const thumb = await sharp(subjectBuffer)
    .resize(384, 384, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/@cf/llava-hf/llava-1.5-7b-hf`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: Array.from(thumb),
      prompt:
        'Describe the exact main subject in this photo in detail: state clearly whether it is a human baby/infant, a dog, a cat, or another animal, and describe their hair or fur color, breed or age appearance, skin or coat tones, eye/nose features, and facial expression.',
      max_tokens: 180,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} Cloudflare Vision: ${await res.text()}`);
  }

  const data = (await res.json()) as {
    success?: boolean;
    result?: { description?: string; response?: string };
  };

  const description = (data.result?.description ?? data.result?.response ?? '').trim();
  if (!description) {
    throw new Error('Empty Cloudflare Vision description');
  }

  const classified = classifySubjectFromDescription(description);
  return {
    subjectCategory: classified.subjectCategory,
    speciesOrSubjectLabel: classified.speciesOrSubjectLabel,
    identityFeatures: description,
    lightingAndColorsToHarmonize:
      'Preserve the exact natural tones, textures, and proportions described above under warm creamy studio window lighting.',
  };
}

async function analyzeUploadedSubject(
  geminiApiKey: string | undefined,
  subjectBuffer: Buffer,
  preferCloudflareVision: boolean
): Promise<SubjectAnalysisResult> {
  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() || '';
  const cfToken = process.env.CLOUDFLARE_API_TOKEN?.trim() || '';

  if (preferCloudflareVision && cfAccountId && cfToken) {
    try {
      return await analyzeSubjectWithCloudflareVision(cfAccountId, cfToken, subjectBuffer);
    } catch {
      // Fall through to Gemini or safe fallback below
    }
  }

  if (geminiApiKey) {
    const ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const subjectBase64 = subjectBuffer.toString('base64');
    const analysisModels = ['gemini-3.1-flash-lite', 'gemini-4-hydrogen'];
    let lastError: unknown = null;

    for (const analysisModel of analysisModels) {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const response = await ai.models.generateContent({
            model: analysisModel,
            contents: {
              parts: [
                {
                  inlineData: {
                    data: subjectBase64,
                    mimeType: 'image/jpeg',
                  },
                },
                {
                  text: [
                    'Analyze this uploaded photograph carefully to prepare a professional studio photoshoot transformation.',
                    'Identify the main subject accurately:',
                    '- Is it a human baby/infant/child ("human_baby"), a dog ("dog"), a cat ("cat"), or another animal ("other_animal")?',
                    '- Describe exact visual identity traits that MUST be preserved without alteration: facial structure, eyes, nose, mouth, cheeks, skin tone, hair OR breed, coat colors, exact markings/spots, ear shape, snout, and natural proportions.',
                    'Return strict JSON matching the schema.',
                  ].join('\n'),
                },
              ],
            },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  subjectCategory: {
                    type: Type.STRING,
                    description: 'One of: human_baby, dog, cat, other_animal',
                  },
                  speciesOrSubjectLabel: {
                    type: Type.STRING,
                    description:
                      'Concise subject description (e.g. newborn human baby, golden retriever puppy)',
                  },
                  identityFeatures: {
                    type: Type.STRING,
                    description:
                      'Detailed facial/coat/physical features from the photo that must be preserved identically',
                  },
                  lightingAndColorsToHarmonize: {
                    type: Type.STRING,
                    description:
                      'Natural skin/fur tone and color details to harmonize with warm studio lighting',
                  },
                },
                required: [
                  'subjectCategory',
                  'speciesOrSubjectLabel',
                  'identityFeatures',
                  'lightingAndColorsToHarmonize',
                ],
              },
            },
          });

          const raw = (response.text ?? '{}').trim();
          const parsed = JSON.parse(raw) as Partial<SubjectAnalysisResult>;
          const category =
            parsed.subjectCategory === 'dog' ||
            parsed.subjectCategory === 'cat' ||
            parsed.subjectCategory === 'other_animal'
              ? parsed.subjectCategory
              : 'human_baby';

          return {
            subjectCategory: category,
            speciesOrSubjectLabel:
              parsed.speciesOrSubjectLabel?.trim() ||
              (category === 'human_baby' ? 'human baby' : 'pet animal'),
            identityFeatures:
              parsed.identityFeatures?.trim() ||
              'Preserve the exact facial features, coloring, proportions, and visual identity of the main subject.',
            lightingAndColorsToHarmonize:
              parsed.lightingAndColorsToHarmonize?.trim() ||
              'Natural tones integrated seamlessly into warm studio window lighting.',
          };
        } catch (err: unknown) {
          lastError = err;
          if (!isTransientRetryableError(err)) {
            break;
          }
          await sleep(600 * (attempt + 1));
        }
      }
    }

    if (!preferCloudflareVision) {
      throw lastError ?? new Error('Falha ao analisar a fotografia enviada.');
    }
  }

  return {
    subjectCategory: 'human_baby',
    speciesOrSubjectLabel: 'adorable newborn baby',
    identityFeatures:
      'natural soft newborn facial proportions, serene peaceful expression, realistic skin texture',
    lightingAndColorsToHarmonize:
      'warm creamy studio window light with soft shadows and natural tones',
  };
}

function buildDualImageEditingPrompt(
  analysis: SubjectAnalysisResult,
  scenario: ScenarioDefinition,
  providerId: 'cloudflare-workers-ai' | 'google-genai',
  modelName: string
): string {
  const isHumanBaby = analysis.subjectCategory === 'human_baby';

  // Text-only FLUX.1 Schnell uses a concise, vivid photographic prompt enriched by Step 1 visual traits
  if (providerId === 'cloudflare-workers-ai' && !/flux-2/i.test(modelName)) {
    const outfitPhrase = isHumanBaby
      ? `wearing ${scenario.outfitDetails}`
      : `strictly keeping the exact ${analysis.speciesOrSubjectLabel} animal appearance (never a human), dressed safely in a pet-adapted version of ${scenario.outfitDetails}`;

    return [
      `Luxury fine-art studio portrait photograph of ${analysis.speciesOrSubjectLabel}, ${analysis.identityFeatures}, ${outfitPhrase}.`,
      scenario.promptTemplate,
      `Harmonized lighting: ${analysis.lightingAndColorsToHarmonize}.`,
      'Shot on 85mm prime lens, soft shallow depth of field, natural skin/fur detail, photorealistic editorial newborn studio photography, clean full-bleed composition with no text or borders.',
    ].join(' ');
  }

  const subjectRefTag = providerId === 'cloudflare-workers-ai' ? 'input_image_0' : 'Image 1';
  const scenarioRefTag = providerId === 'cloudflare-workers-ai' ? 'input_image_1' : 'Image 2';

  const identityRule = isHumanBaby
    ? [
        `SUBJECT PRESERVATION (HUMAN BABY — ${subjectRefTag}):`,
        `- Keep the EXACT same human baby from ${subjectRefTag} (${analysis.speciesOrSubjectLabel}).`,
        `- Preserve their exact face, eyes, nose, mouth, cheeks, skin tone, hair, and natural identity faithfully: ${analysis.identityFeatures}.`,
        `- Dress the baby from ${subjectRefTag} in the exact themed newborn outfit, swaddle, and accessories shown in ${scenarioRefTag} (${scenario.outfitDetails}).`,
      ].join('\n')
    : [
        `SUBJECT PRESERVATION (ANIMAL — ${subjectRefTag}):`,
        `- The subject in ${subjectRefTag} is an animal (${analysis.speciesOrSubjectLabel}, category: ${analysis.subjectCategory}).`,
        `- STRICTLY keep the exact same animal species, breed, snout, ears, eyes, coat color, fur texture, and markings from ${subjectRefTag}: ${analysis.identityFeatures}.`,
        `- NEVER convert or morph this animal into a human baby or human face.`,
        `- Place this real animal naturally and comfortably inside the studio setting from ${scenarioRefTag}, and adapt the reference outfit (${scenario.outfitDetails}) into a realistic, safe, cute pet-appropriate studio outfit/accessory version (such as a soft knit sweater, collar, bandana, bow, or resting wrap inspired by ${scenarioRefTag}).`,
      ].join('\n');

  return [
    `Create a brand-new, photorealistic, full-bleed luxury studio portrait photograph by combining ${subjectRefTag} (subject identity reference) and ${scenarioRefTag} (studio scenario and wardrobe reference for "${scenario.title}").`,
    '',
    identityRule,
    '',
    `SCENARIO & COMPOSITION TRANSFER (${scenarioRefTag}):`,
    `- Reproduce the studio environment, props, backdrop, fabric textures, lighting mood, shadows, camera angle, perspective, and editorial depth of field of ${scenarioRefTag}.`,
    `- Scenario details: ${scenario.promptTemplate}`,
    `- Color/light harmonization notes: ${analysis.lightingAndColorsToHarmonize}.`,
    '',
    `CRITICAL QUALITY & REALISM RULES:`,
    `- Generate a completely new, cohesive studio photograph — DO NOT paste, crop, frame, border, or collage ${subjectRefTag} on top of a background.`,
    `- Ensure natural shadows under and around the subject, realistic fur/skin lighting wrap from the warm studio window light, natural anatomy and proportions, and clean 3:4 portrait framing.`,
    `- No text, no borders, no watermarks inside the generated artwork itself.`,
  ].join('\n');
}

function createCloudflareWorkersAiProvider(
  accountId: string,
  apiToken: string,
  modelName: string
): ImageEditingProvider {
  return {
    id: 'cloudflare-workers-ai',
    modelName,
    async generateEditedPortrait({ subjectBuffer, scenarioRefBuffer, prompt }) {
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${modelName}`;
      const isFlux2MultiRef = /flux-2/i.test(modelName);

      let res: Response;
      if (isFlux2MultiRef) {
        // Resize reference inputs to <= 512x512 JPEG to optimize Cloudflare Workers AI tile neuron usage
        const [subjectTile, scenarioTile] = await Promise.all([
          sharp(subjectBuffer)
            .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 90 })
            .toBuffer(),
          sharp(scenarioRefBuffer)
            .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 90 })
            .toBuffer(),
        ]);

        const form = new FormData();
        form.append('prompt', prompt);
        form.append(
          'input_image_0',
          new Blob([new Uint8Array(subjectTile)], { type: 'image/jpeg' }),
          'subject.jpg'
        );
        form.append(
          'input_image_1',
          new Blob([new Uint8Array(scenarioTile)], { type: 'image/jpeg' }),
          'scenario.jpg'
        );
        form.append('width', '768');
        form.append('height', '1024');

        res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
          body: form,
        });
      } else {
        // @cf/black-forest-labs/flux-1-schnell accepts JSON { prompt, steps }
        const cleanPrompt = prompt
          .replace(/input_image_0|input_image_1/g, 'the described reference')
          .slice(0, 2000);
        res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: cleanPrompt,
            steps: 4,
          }),
        });
      }

      const contentType = res.headers.get('content-type') ?? '';
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status} Cloudflare Workers AI: ${errBody}`);
      }

      if (contentType.startsWith('image/')) {
        return Buffer.from(await res.arrayBuffer());
      }

      const json = (await res.json()) as {
        success?: boolean;
        result?: { image?: string };
        errors?: Array<{ code?: number; message?: string }>;
      };

      if (json.success === false || !json.result?.image) {
        const errMsg =
          json.errors?.map((e) => e.message).filter(Boolean).join('; ') ||
          'Resposta vazia do modelo FLUX';
        throw new Error(errMsg);
      }

      return Buffer.from(json.result.image, 'base64');
    },
  };
}

function createGoogleGenAiProvider(apiKey: string, modelName: string): ImageEditingProvider {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  return {
    id: 'google-genai',
    modelName,
    async generateEditedPortrait({ subjectBuffer, scenarioRefBuffer, prompt }) {
      const subjectBase64 = subjectBuffer.toString('base64');
      const scenarioRefBase64 = scenarioRefBuffer.toString('base64');

      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                {
                  inlineData: {
                    data: subjectBase64,
                    mimeType: 'image/jpeg',
                  },
                },
                {
                  inlineData: {
                    data: scenarioRefBase64,
                    mimeType: 'image/jpeg',
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: '3:4',
              },
            },
          });

          for (const part of response.candidates?.[0]?.content?.parts ?? []) {
            if (part.inlineData?.data) {
              return Buffer.from(part.inlineData.data, 'base64');
            }
          }

          throw new Error('O modelo de IA não retornou uma imagem gerada na resposta.');
        } catch (err: unknown) {
          if (!isTransientRetryableError(err) || attempt === 1) {
            throw err;
          }
          await sleep(900);
        }
      }

      throw new Error('O modelo de IA não retornou uma imagem gerada na resposta.');
    },
  };
}

function resolveActiveProvider(): ImageEditingProvider | null {
  const cfg = getRuntimeConfig();
  const integration = getIntegrationStatus();

  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() || '';
  const cfToken = process.env.CLOUDFLARE_API_TOKEN?.trim() || '';
  const cfModel =
    process.env.CLOUDFLARE_IMAGE_MODEL?.trim() ||
    cfg.cloudflareModel ||
    '@cf/black-forest-labs/flux-1-schnell';

  const geminiKey = process.env.GEMINI_API_KEY?.trim() || '';
  const geminiModel =
    process.env.AI_IMAGE_MODEL?.trim() || cfg.aiModel || 'gemini-3.1-flash-lite-image';

  if (integration.activeImageProvider === 'cloudflare-workers-ai' && cfAccountId && cfToken) {
    return createCloudflareWorkersAiProvider(cfAccountId, cfToken, cfModel);
  }
  if (integration.activeImageProvider === 'google-genai' && geminiKey) {
    return createGoogleGenAiProvider(geminiKey, geminiModel);
  }
  return null;
}

export async function generateNewbornPhotosWithAI(
  sessionId: string,
  uploadedPhotoPath: string,
  scenarioIds: string[]
): Promise<GenerationBatchResult> {
  if (!fs.existsSync(uploadedPhotoPath)) {
    return {
      ok: false,
      generated: [],
      errorCode: 'UPLOAD_NOT_FOUND',
      errorMessage: 'A fotografia de referência não foi encontrada. Envie a foto novamente.',
    };
  }

  const provider = resolveActiveProvider();
  if (!provider) {
    appendGenerationLog({
      id: crypto.randomUUID(),
      sessionId,
      scenarioId: scenarioIds[0] ?? 'none',
      scenarioTitle: 'Verificação de provedor de IA',
      status: 'error',
      errorCode: 'AI_NOT_CONFIGURED',
      errorMessage:
        'Nenhum provedor de edição de imagem configurado com credenciais ativas (CLOUDFLARE_ACCOUNT_ID/CLOUDFLARE_API_TOKEN ou GEMINI_API_KEY).',
      durationMs: 0,
      createdAt: new Date().toISOString(),
    });
    return {
      ok: false,
      generated: [],
      errorCode: 'AI_NOT_CONFIGURED',
      errorMessage:
        'A plataforma está em modo demonstrativo: configure CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN (camada gratuita de 10.000 Neurons/dia com FLUX.2) ou uma chave GEMINI_API_KEY com faturamento ativo no servidor para gerar ensaios reais. Nenhuma cópia ou imagem falsa foi criada.',
    };
  }

  const subjectBuffer = fs.readFileSync(uploadedPhotoPath);
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

  // Step 1: Analyze uploaded photograph first (human baby vs. animal + visual traits)
  let subjectAnalysis: SubjectAnalysisResult;
  try {
    subjectAnalysis = await analyzeUploadedSubject(
      geminiApiKey,
      subjectBuffer,
      provider.id === 'cloudflare-workers-ai'
    );
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    const isAuthError = /\b(401|403)\b|PERMISSION_DENIED|API_KEY_INVALID/i.test(rawMessage);
    appendGenerationLog({
      id: crypto.randomUUID(),
      sessionId,
      scenarioId: scenarioIds[0] ?? 'analysis',
      scenarioTitle: 'Análise do sujeito',
      status: 'error',
      errorCode: isAuthError ? 'AI_AUTH_OR_PERMISSION_ERROR' : 'AI_ANALYSIS_FAILED',
      errorMessage: rawMessage,
      durationMs: 0,
      createdAt: new Date().toISOString(),
    });
    return {
      ok: false,
      providerUsed: provider.id,
      generated: [],
      errorCode: isAuthError ? 'AI_AUTH_OR_PERMISSION_ERROR' : 'AI_ANALYSIS_FAILED',
      errorMessage: isAuthError
        ? 'A API de análise visual recusou a autenticação ou permissão configurada no servidor.'
        : 'Não foi possível analisar a fotografia enviada pela API de inteligência artificial. Tente novamente em instantes.',
    };
  }

  // Step 2: Generate one distinct dual-image conditioned studio portrait per scenario
  const generated: GenerationScenarioSuccess[] = [];

  for (const scId of scenarioIds) {
    const scenario = SCENARIOS.find((s) => s.id === scId);
    if (!scenario) continue;

    const scenarioRefBuffer = getScenarioReferenceImageBuffer(scenario);
    if (!scenarioRefBuffer) {
      appendGenerationLog({
        id: crypto.randomUUID(),
        sessionId,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        status: 'error',
        errorCode: 'SCENARIO_REFERENCE_MISSING',
        errorMessage: `Imagem de referência ausente: ${scenario.referenceImageFilename}`,
        durationMs: 0,
        createdAt: new Date().toISOString(),
      });
      return {
        ok: false,
        providerUsed: provider.id,
        generated,
        errorCode: 'SCENARIO_REFERENCE_MISSING',
        errorMessage: `A imagem de referência do cenário "${scenario.title}" não foi encontrada no servidor.`,
      };
    }

    const startedAt = Date.now();
    try {
      const prompt = buildDualImageEditingPrompt(
        subjectAnalysis,
        scenario,
        provider.id,
        provider.modelName
      );
      const outputBuffer = await provider.generateEditedPortrait({
        subjectBuffer,
        scenarioRefBuffer,
        prompt,
      });

      const photoId = crypto.randomUUID();
      const { originalPath, previewPath } = await saveOriginalAndWatermarkedPreview(
        sessionId,
        photoId,
        outputBuffer
      );

      const createdAt = new Date().toISOString();
      generated.push({
        photoId,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        originalPath,
        previewPath,
        createdAt,
      });

      appendGenerationLog({
        id: crypto.randomUUID(),
        sessionId,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        status: 'success',
        durationMs: Date.now() - startedAt,
        createdAt,
      });
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : String(err);
      const isFreeTierImageLimitZero =
        /FreeTier|limit:\s*0/i.test(rawMessage) && /\b429\b|RESOURCE_EXHAUSTED/i.test(rawMessage);
      const isQuotaError = /\b429\b|RESOURCE_EXHAUSTED|neurons|quota/i.test(rawMessage);
      const isAuthError = /\b(401|403)\b|PERMISSION_DENIED|API_KEY_INVALID|Authentication error/i.test(
        rawMessage
      );

      const errorCode = isFreeTierImageLimitZero
        ? 'AI_BILLING_REQUIRED'
        : isQuotaError
          ? 'AI_QUOTA_EXCEEDED'
          : isAuthError
            ? 'AI_AUTH_OR_PERMISSION_ERROR'
            : 'AI_GENERATION_FAILED';

      appendGenerationLog({
        id: crypto.randomUUID(),
        sessionId,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        status: 'error',
        errorCode,
        errorMessage: rawMessage,
        durationMs: Date.now() - startedAt,
        createdAt: new Date().toISOString(),
      });

      return {
        ok: false,
        providerUsed: provider.id,
        generated,
        errorCode,
        errorMessage: isFreeTierImageLimitZero
          ? 'O provedor atual (Google GenAI) possui limite Free Tier = 0 para geração de imagens. Para gerar ensaios sem custo fixo inicial, configure CLOUDFLARE_ACCOUNT_ID e CLOUDFLARE_API_TOKEN (camada gratuita diária de 10.000 Neurons via FLUX.2) ou ative o faturamento na chave GEMINI_API_KEY. A plataforma permanece em modo demonstrativo sem gerar imagens falsas.'
          : isQuotaError
            ? 'O limite diário ou de taxa do provedor de imagens foi atingido. Tente novamente mais tarde sem custo.'
            : isAuthError
              ? 'O provedor de geração de imagens recusou as credenciais configuradas no servidor. Nenhuma imagem falsa foi gerada.'
              : `Não foi possível concluir a geração do cenário "${scenario.title}" pela API externa. Tente novamente sem custo.`,
      };
    }
  }

  return {
    ok: generated.length > 0,
    providerUsed: provider.id,
    generated,
  };
}
