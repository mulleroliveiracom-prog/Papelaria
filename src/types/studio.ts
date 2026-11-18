export type PackageId =
  | 'pequena-recordacao'
  | 'sonho-especial'
  | 'memorias-inesqueciveis';

export interface PackageInfo {
  id: PackageId;
  codeLabel: string;
  name: string;
  priceCents: number;
  priceFormatted: string;
  photoCount: number;
  recommended: boolean;
  features: string[];
  buttonLabel: string;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  description: string;
  referenceImageFilename: string;
  outfitDetails: string;
  promptTemplate: string;
  isPremium?: boolean;
}

export interface GeneratedPhotoMeta {
  photoId: string;
  scenarioId: string;
  scenarioTitle: string;
  createdAt: string;
  unlocked: boolean;
  previewDataUrl?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired';

export interface OrderPublicView {
  orderId: string;
  sessionId: string;
  packageId: PackageId;
  packageName: string;
  amountCents: number;
  quota: number;
  status: OrderStatus;
  paymentProvider: string;
  providerConfigured: boolean;
  checkoutUrl?: string;
  pixCopyPaste?: string;
  unlockedPhotoIds: string[];
  createdAt: string;
  paidAt?: string;
  failureReason?: string;
}

export interface SessionPublicView {
  sessionId: string;
  accessCode: string;
  sessionToken: string;
  consentAccepted: boolean;
  consentTimestamp?: string;
  hasUploadedPhoto: boolean;
  selectedScenarioIds: string[];
  generatedPhotos: GeneratedPhotoMeta[];
  activeOrder: OrderPublicView | null;
  expiresAt: string;
  createdAt: string;
}

export interface GenerationLogEntry {
  id: string;
  sessionId: string;
  scenarioId: string;
  scenarioTitle: string;
  status: 'success' | 'error';
  errorCode?: string;
  errorMessage?: string;
  durationMs: number;
  createdAt: string;
}

export interface DeletionRequestEntry {
  id: string;
  sessionId: string;
  accessCode: string;
  reason: string;
  status: 'pending' | 'completed';
  requestedAt: string;
  completedAt?: string;
}

export interface IntegrationSettingsView {
  aiProvider: string;
  aiModel: string;
  aiConfigured: boolean;
  aiEndpointConfigured: boolean;
  cloudflareConfigured: boolean;
  cloudflareModel: string;
  activeImageProvider: 'cloudflare-workers-ai' | 'google-genai' | 'unconfigured';
  paymentProvider: string;
  paymentConfigured: boolean;
  webhookUrl: string;
  webhookSecretConfigured: boolean;
  databaseDriver: string;
  databaseUrlConfigured: boolean;
  storageDriver: string;
  storageBucket: string;
  retentionHours: number;
}

export interface AdminDashboardPayload {
  metrics: {
    totalOrders: number;
    totalSessions: number;
    totalGeneratedPhotos: number;
    confirmedSales: number;
    totalRevenueCents: number;
    generationErrorsCount: number;
    deletionRequestsCount: number;
  };
  popularPackages: Array<{
    packageId: PackageId;
    packageName: string;
    ordersCount: number;
    paidCount: number;
  }>;
  recentOrders: OrderPublicView[];
  recentErrors: GenerationLogEntry[];
  deletionRequests: DeletionRequestEntry[];
  integrations: IntegrationSettingsView;
}

export const PACKAGES: PackageInfo[] = [
  {
    id: 'pequena-recordacao',
    codeLabel: 'Pacote 1',
    name: 'Pequena Recordação',
    priceCents: 1490,
    priceFormatted: 'R$ 14,90',
    photoCount: 3,
    recommended: false,
    features: [
      '3 fotos desbloqueadas',
      'Alta resolução',
      "Sem marca-d'água",
      'Download individual',
    ],
    buttonLabel: 'Desbloquear 3 fotos',
  },
  {
    id: 'sonho-especial',
    codeLabel: 'Pacote 2',
    name: 'Sonho Especial',
    priceCents: 2990,
    priceFormatted: 'R$ 29,90',
    photoCount: 8,
    recommended: true,
    features: [
      '8 fotos desbloqueadas',
      'Alta resolução',
      "Sem marca-d'água",
      'Download individual',
      'Mais opções de recordação',
    ],
    buttonLabel: 'Quero 8 fotos',
  },
  {
    id: 'memorias-inesqueciveis',
    codeLabel: 'Pacote 3',
    name: 'Memórias Inesquecíveis',
    priceCents: 4990,
    priceFormatted: 'R$ 49,90',
    photoCount: 15,
    recommended: false,
    features: [
      '15 fotos desbloqueadas',
      'Alta resolução',
      "Sem marca-d'água",
      'Download individual',
      'Maior variedade de cenários',
    ],
    buttonLabel: 'Quero 15 fotos',
  },
];

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'ursinho-dos-sonhos',
    title: 'Ursinho dos sonhos',
    description: 'Cesto artesanal acolhedor com ursinhos de pelúcia em tons bege e creme.',
    referenceImageFilename: 'demo_teddy_bears_1795008519102.jpg',
    outfitDetails:
      'soft oatmeal-beige knit romper/swaddle and a matching cozy teddy-knit beanie or gentle knit scarf accent',
    promptTemplate:
      'Place the subject resting peacefully inside a woven wicker basket lined with a soft beige blanket surrounded by delicate handmade cream plush teddy bears, warm natural window studio light, #F5EFE8 cream backdrop, editorial shallow depth of field, photorealistic.',
  },
  {
    id: 'jardim-encantado',
    title: 'Jardim encantado',
    description: 'Folhagens delicadas, flores suaves e luz dourada de fim de tarde.',
    referenceImageFilename: 'scenario_enchanted_garden_1795009828280.jpg',
    outfitDetails:
      'soft cream muslin linen garment with delicate sage botanical accents and optional dainty flower headband/collar',
    promptTemplate:
      'Place the subject inside a cozy moss-and-eucalyptus botanical studio nest decorated with subtle blush and ivory blossoms, warm golden-hour diffused studio lighting, timeless dreamy editorial portrait, photorealistic.',
  },
  {
    id: 'pequeno-principe',
    title: 'Pequeno príncipe',
    description: 'Atmosfera clássica com mantinha macia, coroa discreta e tons dourados.',
    referenceImageFilename: 'scenario_little_prince_1795009828665.jpg',
    outfitDetails:
      'cream velvet and soft linen prince-inspired outfit with a tiny subtle matte-gold knit crown',
    promptTemplate:
      'Place the subject serenely on cream velvet and soft linen drapes with miniature warm golden stars and soft ivory and champagne studio tones, fine-art studio photography, photorealistic.',
  },
  {
    id: 'pequena-princesa',
    title: 'Pequena princesa',
    description: 'Tecidos fluidos em rosa bebê, renda delicada e suavidade de estúdio.',
    referenceImageFilename: 'demo_little_angel_1795008522004.jpg',
    outfitDetails:
      'delicate ivory and dusty-rose (#EBCFD1) cashmere knit wrap with dainty angel-feather wing/lace and floral headband accent',
    promptTemplate:
      'Place the subject nestled peacefully on plush dusty-rose and ivory knit blankets with soft warm sunlight rays, gentle natural window studio lighting, photorealistic.',
  },
  {
    id: 'nuvem-de-algodao',
    title: 'Nuvem de algodão',
    description: 'Cenário fofo e sereno sobre nuvens macias em tons claros e aconchegantes.',
    referenceImageFilename: 'demo_cloud_dream_1795008520387.jpg',
    outfitDetails:
      'ultra-soft white and cream cotton-knit sleeper outfit with a cozy little cloud bonnet/neck wrap',
    promptTemplate:
      'Place the subject peacefully on a fluffy white cotton cloud prop against a soft warm cream and pale blush sky studio backdrop, gentle diffused studio rim light, fine-art photography, photorealistic.',
  },
  {
    id: 'ceu-estrelado',
    title: 'Céu estrelado',
    description: 'Lua crescente em veludo claro e pequenas estrelas douradas brilhando suavemente.',
    referenceImageFilename: 'demo_moon_stars_1795008520763.jpg',
    outfitDetails:
      'soft cream knit romper/bonnet or cozy starlight-toned knit wrap matching the champagne-velvet crescent moon',
    promptTemplate:
      'Place the subject peacefully nestled on a plush champagne-velvet crescent moon prop with subtle warm golden stars, soft muted beige studio backdrop, fine-art portrait, photorealistic.',
  },
  {
    id: 'estudio-profissional-bege',
    title: 'Estúdio profissional bege',
    description: 'Minimalismo atemporal em linho, tricô neutro e iluminação de galeria.',
    referenceImageFilename: 'demo_luxury_beige_1795008521515.jpg',
    outfitDetails:
      'minimalist luxury textured oatmeal cashmere knit outfit/swaddle in warm sand-beige tones',
    promptTemplate:
      'Place the subject on a monochromatic warm sand-beige studio backdrop (#F5EFE8) with sculptural soft studio window light, museum-grade timeless fine-art portrait, photorealistic.',
  },
  {
    id: 'flores-delicadas',
    title: 'Flores delicadas',
    description: 'Cesto rústico emoldurado por rosas em rosa chá, gipsofila e eucalipto.',
    referenceImageFilename: 'demo_flower_basket_1795008519174.jpg',
    outfitDetails:
      'soft ivory gauze and cream lace wrap with delicate floral studio headband or floral collar accent',
    promptTemplate:
      'Place the subject calmly inside a rustic wicker basket framed by soft blush pink garden roses, baby breath flowers, and eucalyptus stems, warm creamy studio light, photorealistic.',
  },
  {
    id: 'realeza-classica',
    title: 'Realeza Clássica',
    description:
      'Luxo atemporal em almofada de veludo, mini coroa delicada e iluminação quente de estúdio.',
    referenceImageFilename: 'scenario_royal_velvet_1795028021168.jpg',
    outfitDetails:
      'soft cream silk swaddle wrap paired with a tiny minimalist matte-gold knit crown',
    promptTemplate:
      'Place the subject resting serenely wrapped in soft cream silk fabric upon a plush golden-beige velvet cushion with a tiny minimalist golden crown, warm gallery royal portrait studio lighting, photorealistic.',
    isPremium: true,
  },
  {
    id: 'bosque-encantado',
    title: 'Bosque Encantado',
    description:
      'Cenário mágico com musgo natural, berço de madeira rústica e luzes suaves de fada ao fundo.',
    referenceImageFilename: 'scenario_enchanted_woods_1795028021528.jpg',
    outfitDetails:
      'artisan beige cable-knit bonnet and cozy cream plush fur wrap inside a carved wooden cradle',
    promptTemplate:
      'Place the subject sleeping peacefully inside a rustic carved wooden cradle lined with soft natural green moss and plush beige faux fur, blurred enchanted forest backdrop with warm golden fairy light bokeh, realistic fairytale studio photography.',
    isPremium: true,
  },
  {
    id: 'balao-nas-nuvens',
    title: 'Balão nas Nuvens',
    description:
      'Aventura lúdica em cesto de balão de ar quente cercado por nuvens fofinhas em tons pastéis.',
    referenceImageFilename: 'scenario_cloud_balloon_1795028022130.jpg',
    outfitDetails:
      'soft cream knit bonnet and cozy neutral woven swaddle tucked inside the balloon basket',
    promptTemplate:
      'Place the subject comfortably nestled inside a woven wicker hot-air balloon basket surrounded by fluffy white cotton clouds against a pastel slate-blue and warm cream backdrop, gentle ethereal diffused studio lighting, photorealistic.',
    isPremium: true,
  },
  {
    id: 'pequeno-astronauta-na-lua',
    title: 'Pequeno Astronauta na Lua',
    description:
      'Ensaio criativo em lua crescente iluminada sob um céu estrelado em veludo azul-marinho.',
    referenceImageFilename: 'scenario_moon_astronaut_1795028023271.jpg',
    outfitDetails:
      'cozy white and silver knit bonnet with matching soft textured cream-silver wrap',
    promptTemplate:
      'Place the subject resting comfortably on a softly lit textured crescent moon prop under a deep navy-blue velvet night sky with subtle pinpoint starlight sparkles, high-end artistic newborn studio photography, photorealistic.',
    isPremium: true,
  },
  {
    id: 'boho-chic-lavanda',
    title: 'Boho Chic & Lavanda',
    description:
      'Estética leve e natural com linho cru, capim-dos-pampas e ramos delicados de lavanda.',
    referenceImageFilename: 'scenario_boho_lavender_1795028022758.jpg',
    outfitDetails:
      'natural raw cream linen wrap and delicate soft cream knit bonnet',
    promptTemplate:
      'Place the subject wrapped in raw organic cream linen inside a woven rattan basket adorned with dried lavender sprigs and soft beige pampas grass, natural side window daylight, neutral bohemian studio palette, photorealistic.',
    isPremium: true,
  },
  {
    id: 'ursinho-nordico-trico',
    title: 'Ursinho Nórdico em Tricô',
    description:
      'Aconchego máximo com manta de tricô grosso artesanal e mini ursinho de pelúcia.',
    referenceImageFilename: 'scenario_nordic_bear_1795028024163.jpg',
    outfitDetails:
      'cozy handmade knit beanie with small teddy bear ears and matching cream knit wrap holding a tiny crocheted teddy bear',
    promptTemplate:
      'Place the subject wearing a knit bear-ear beanie gently cuddling a tiny crocheted teddy bear plush while resting on a chunky artisan off-white and warm caramel wool knit blanket, warm cozy Nordic studio lighting, photorealistic.',
    isPremium: true,
  },
  {
    id: 'fine-art-preto-e-branco',
    title: 'Fine Art Preto e Branco',
    description:
      'Retrato editorial minimalista em preto e branco com contraste suave digno de quadro de galeria.',
    referenceImageFilename: 'scenario_monochrome_fineart_1795028024985.jpg',
    outfitDetails:
      'soft textured organic cotton gauze swaddle keeping face and tiny hands in crisp focus',
    promptTemplate:
      'Create a high-resolution monochrome black-and-white fine-art studio portrait with crisp focus on facial features and tiny hands wrapped in textured gauze against a minimalist dark charcoal backdrop, soft dramatic directional side lighting, gallery quality, photorealistic.',
    isPremium: true,
  },
  {
    id: 'jardim-das-borboletas',
    title: 'Jardim das Borboletas',
    description:
      'Composição delicada com pétalas pastéis, tecidos fluidos e borboletas sutis em luz radiante.',
    referenceImageFilename: 'scenario_butterfly_garden_1795028026175.jpg',
    outfitDetails:
      'delicate blush-pink knit swaddle resting over sheer flowing cream and rose tulle',
    promptTemplate:
      'Place the subject sleeping over soft layered tulle and dusty blush-pink and champagne rose petals surrounded by delicate subtle pastel butterflies, radiant dreamy studio lighting, editorial fine-art photography, photorealistic.',
    isPremium: true,
  },
  {
    id: 'pequeno-marinheiro',
    title: 'Pequeno Marinheiro',
    description:
      'Estilo náutico clássico em mini barquinho de madeira com tons de areia, creme e azul-marinho.',
    referenceImageFilename: 'scenario_little_sailor_1795028025226.jpg',
    outfitDetails:
      'classic navy-blue and cream striped knit wrap paired with a cozy cream knit bonnet',
    promptTemplate:
      'Place the subject sleeping inside a weathered miniature wooden boat lined with a navy-blue and cream striped knitted blanket against a soft sand-toned studio backdrop, crisp clean editorial photography lighting, photorealistic.',
    isPremium: true,
  },
  {
    id: 'fazendinha-rustica-chic',
    title: 'Fazendinha Rústica Chic',
    description:
      'Charme campestre em cesta de vime vintage com manta xadrez neutra e luz dourada de fim de tarde.',
    referenceImageFilename: 'scenario_rustic_farm_1795028025853.jpg',
    outfitDetails:
      'warm cream oatmeal knit swaddle resting on a neutral beige and light brown plaid flannel blanket',
    promptTemplate:
      'Place the subject inside a vintage woven wicker basket draped with a neutral beige and light brown plaid blanket with subtle dried golden wheat details, warm golden-hour sunset studio lighting, cozy rustic chic photography, photorealistic.',
    isPremium: true,
  },
];
