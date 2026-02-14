/**
 * Generate all required icon assets from Logo.jpg
 * Usage: node scripts/generate-icons.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'src', 'assets', 'Logo.jpg');
const TAURI_ICONS = join(ROOT, 'src-tauri', 'icons');
const PUBLIC = join(ROOT, 'public');

// All Tauri icon sizes needed
const TAURI_PNGS = [
  { name: '32x32.png', size: 32 },
  { name: '128x128.png', size: 128 },
  { name: '128x128@2x.png', size: 256 },
  { name: 'icon.png', size: 512 },
  { name: 'Square30x30Logo.png', size: 30 },
  { name: 'Square44x44Logo.png', size: 44 },
  { name: 'Square71x71Logo.png', size: 71 },
  { name: 'Square89x89Logo.png', size: 89 },
  { name: 'Square107x107Logo.png', size: 107 },
  { name: 'Square142x142Logo.png', size: 142 },
  { name: 'Square150x150Logo.png', size: 150 },
  { name: 'Square284x284Logo.png', size: 284 },
  { name: 'Square310x310Logo.png', size: 310 },
  { name: 'StoreLogo.png', size: 50 },
];

// ICO sizes (Windows icon contains multiple sizes)
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];

/**
 * Create an ICO file from multiple PNG buffers
 * ICO format: https://en.wikipedia.org/wiki/ICO_(file_format)
 */
function createIco(pngBuffers) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * numImages;
  
  let offset = headerSize + dirSize;
  const entries = [];

  for (const buf of pngBuffers) {
    entries.push({ offset, size: buf.length });
    offset += buf.length;
  }

  const totalSize = offset;
  const ico = Buffer.alloc(totalSize);
  
  // ICO header
  ico.writeUInt16LE(0, 0);      // Reserved
  ico.writeUInt16LE(1, 2);      // Type: 1 = ICO
  ico.writeUInt16LE(numImages, 4); // Number of images

  // Directory entries
  for (let i = 0; i < numImages; i++) {
    const entryOffset = headerSize + i * dirEntrySize;
    // We need to get dimensions from the PNG - read from sharp metadata instead
    // For simplicity, we know the sizes from ICO_SIZES
    const size = ICO_SIZES[i];
    ico.writeUInt8(size >= 256 ? 0 : size, entryOffset);     // Width (0 = 256)
    ico.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1); // Height (0 = 256)
    ico.writeUInt8(0, entryOffset + 2);   // Color palette
    ico.writeUInt8(0, entryOffset + 3);   // Reserved
    ico.writeUInt16LE(1, entryOffset + 4);  // Color planes
    ico.writeUInt16LE(32, entryOffset + 6); // Bits per pixel
    ico.writeUInt32LE(pngBuffers[i].length, entryOffset + 8);  // Image size
    ico.writeUInt32LE(entries[i].offset, entryOffset + 12);     // Image offset
  }

  // Image data
  for (let i = 0; i < numImages; i++) {
    pngBuffers[i].copy(ico, entries[i].offset);
  }

  return ico;
}

async function main() {
  console.log('📐 Generating icons from Logo.jpg...\n');

  // Generate all Tauri PNGs
  for (const { name, size } of TAURI_PNGS) {
    const outPath = join(TAURI_ICONS, name);
    await sharp(SOURCE)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(outPath);
    console.log(`  ✅ ${name} (${size}×${size})`);
  }

  // Generate ICO for Windows (Tauri)
  const icoPngs = [];
  for (const size of ICO_SIZES) {
    const buf = await sharp(SOURCE)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toBuffer();
    icoPngs.push(buf);
  }
  const icoBuffer = createIco(icoPngs);
  writeFileSync(join(TAURI_ICONS, 'icon.ico'), icoBuffer);
  console.log(`  ✅ icon.ico (multi-size: ${ICO_SIZES.join(', ')})`);

  // Generate favicon.ico for public/
  const faviconPngs = [];
  for (const size of [16, 32, 48]) {
    const buf = await sharp(SOURCE)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toBuffer();
    faviconPngs.push(buf);
  }
  // Reuse createIco but with smaller subset
  const faviconSizes = [16, 32, 48];
  function createFaviconIco(pngBufs, sizes) {
    const numImages = pngBufs.length;
    const headerSize = 6;
    const dirEntrySize = 16;
    let offset = headerSize + dirEntrySize * numImages;
    const entries = [];
    for (const buf of pngBufs) {
      entries.push({ offset, size: buf.length });
      offset += buf.length;
    }
    const ico = Buffer.alloc(offset);
    ico.writeUInt16LE(0, 0);
    ico.writeUInt16LE(1, 2);
    ico.writeUInt16LE(numImages, 4);
    for (let i = 0; i < numImages; i++) {
      const eo = headerSize + i * dirEntrySize;
      ico.writeUInt8(sizes[i], eo);
      ico.writeUInt8(sizes[i], eo + 1);
      ico.writeUInt8(0, eo + 2);
      ico.writeUInt8(0, eo + 3);
      ico.writeUInt16LE(1, eo + 4);
      ico.writeUInt16LE(32, eo + 6);
      ico.writeUInt32LE(pngBufs[i].length, eo + 8);
      ico.writeUInt32LE(entries[i].offset, eo + 12);
    }
    for (let i = 0; i < numImages; i++) {
      pngBufs[i].copy(ico, entries[i].offset);
    }
    return ico;
  }
  const faviconBuffer = createFaviconIco(faviconPngs, faviconSizes);
  writeFileSync(join(PUBLIC, 'favicon.ico'), faviconBuffer);
  console.log(`  ✅ public/favicon.ico (16, 32, 48)`);

  // Generate ICNS for macOS
  // ICNS is complex - generate the required PNG sizes and create a basic ICNS
  // The macOS CI runner will handle proper ICNS via tauri build
  // For now, create a simple ICNS with the required icon types
  const icnsTypes = [
    { type: 'icp4', size: 16 },   // 16x16
    { type: 'icp5', size: 32 },   // 32x32
    { type: 'icp6', size: 64 },   // 64x64
    { type: 'ic07', size: 128 },  // 128x128
    { type: 'ic08', size: 256 },  // 256x256
    { type: 'ic09', size: 512 },  // 512x512
    { type: 'ic10', size: 1024 }, // 1024x1024
  ];

  const icnsEntries = [];
  for (const { type, size } of icnsTypes) {
    const buf = await sharp(SOURCE)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toBuffer();
    icnsEntries.push({ type, data: buf });
  }

  // Build ICNS file
  let icnsSize = 8; // Header
  for (const entry of icnsEntries) {
    icnsSize += 8 + entry.data.length; // type(4) + size(4) + data
  }
  
  const icns = Buffer.alloc(icnsSize);
  icns.write('icns', 0, 4, 'ascii');
  icns.writeUInt32BE(icnsSize, 4);
  
  let icnsOffset = 8;
  for (const entry of icnsEntries) {
    icns.write(entry.type, icnsOffset, 4, 'ascii');
    icns.writeUInt32BE(8 + entry.data.length, icnsOffset + 4);
    entry.data.copy(icns, icnsOffset + 8);
    icnsOffset += 8 + entry.data.length;
  }
  
  writeFileSync(join(TAURI_ICONS, 'icon.icns'), icns);
  console.log(`  ✅ icon.icns (macOS bundle icon)`);

  console.log('\n🎉 All icons generated successfully!');
}

main().catch(console.error);
