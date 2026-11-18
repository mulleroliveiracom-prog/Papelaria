import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ORIGINALS_DIR, PREVIEWS_DIR, UPLOADS_DIR } from './db.ts';

/**
 * Strips all EXIF / GPS / camera metadata and normalizes orientation and size in memory.
 */
export async function sanitizeUploadBuffer(rawBuffer: Buffer): Promise<Buffer> {
  return sharp(rawBuffer)
    .rotate() // honors phone orientation before stripping EXIF
    .resize(1400, 1400, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Sanitizes an uploaded baby photograph and stores outside public web root.
 */
export async function saveSanitizedUpload(
  sessionId: string,
  rawBuffer: Buffer
): Promise<string> {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const targetPath = path.join(UPLOADS_DIR, `${sessionId}.jpg`);
  const sanitized = await sanitizeUploadBuffer(rawBuffer);
  fs.writeFileSync(targetPath, sanitized);

  return targetPath;
}

/**
 * Stores the untouched high-resolution original image strictly inside private server storage
 * and generates a permanently watermarked, lower-resolution JPEG preview + base64 data URL.
 */
export async function saveOriginalAndWatermarkedPreview(
  sessionId: string,
  photoId: string,
  imageBuffer: Buffer
): Promise<{ originalPath: string; previewPath: string; previewDataUrl: string }> {
  const origSessionDir = path.join(ORIGINALS_DIR, sessionId);
  const prevSessionDir = path.join(PREVIEWS_DIR, sessionId);
  fs.mkdirSync(origSessionDir, { recursive: true });
  fs.mkdirSync(prevSessionDir, { recursive: true });

  const originalPath = path.join(origSessionDir, `${photoId}.png`);
  const previewPath = path.join(prevSessionDir, `${photoId}.jpg`);

  // Save crisp high-resolution unwatermarked original privately
  await sharp(imageBuffer).png({ compressionLevel: 6 }).toFile(originalPath);

  // Build watermarked preview (max 760px width) with diagonal tiled SVG overlay + lock badge
  const previewWidth = 760;
  const previewHeight = 960;

  const resizedBase = await sharp(imageBuffer)
    .resize(previewWidth, previewHeight, { fit: 'cover' })
    .toBuffer();

  const meta = await sharp(resizedBase).metadata();
  const w = meta.width ?? previewWidth;
  const h = meta.height ?? previewHeight;

  const watermarkSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <pattern id="wm" width="320" height="220" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <text x="16" y="70" fill="rgba(255,255,255,0.44)" stroke="rgba(81,67,62,0.34)" stroke-width="0.9"
            font-family="Georgia, serif" font-size="22" font-weight="bold" letter-spacing="1.5">
            MEU BEBÊ EM UM SONHO
          </text>
          <text x="48" y="102" fill="rgba(255,255,255,0.40)" stroke="rgba(81,67,62,0.30)" stroke-width="0.7"
            font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="2">
            PRÉVIA GRATUITA · PROTEGIDA
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wm)" />
      <g transform="translate(${Math.round(w / 2 - 115)}, ${Math.round(h - 54)})">
        <rect x="0" y="0" width="230" height="34" rx="17" fill="rgba(81,67,62,0.72)" />
        <text x="115" y="21" text-anchor="middle" fill="#F5EFE8" font-family="sans-serif" font-size="12" font-weight="600" letter-spacing="0.8">
          PRÉVIA COM MARCA-D'ÁGUA
        </text>
      </g>
    </svg>
  `;

  const previewBuffer = await sharp(resizedBase)
    .composite([{ input: Buffer.from(watermarkSvg), top: 0, left: 0 }])
    .jpeg({ quality: 82 })
    .toBuffer();

  fs.writeFileSync(previewPath, previewBuffer);

  return {
    originalPath,
    previewPath,
    previewDataUrl: `data:image/jpeg;base64,${previewBuffer.toString('base64')}`,
  };
}
