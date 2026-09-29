import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function createPng(width, height, renderFn) {
  // 8-byte signature
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR: 13 bytes
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with scanline filter 0
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = renderFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', deflated);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Draw CampusHub icon (crisp academic blue background + white CH logo glyph)
function renderCampusHubIcon(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;

  // Background: Deep Royal Navy #1E40AF with subtle rounded corner mask
  let r = 37, g = 99, b = 235, a = 255; // #2563EB primary
  
  // Inner crest area
  const cx = 0.5, cy = 0.5;
  const dist = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);

  // Draw white 'C' and 'H' or modern geometric QR symbol in center
  // Center square box (representing QR/Campus pass)
  const inCenterBox = (nx >= 0.24 && nx <= 0.76 && ny >= 0.24 && ny <= 0.76);
  const inInnerHole = (nx >= 0.36 && nx <= 0.64 && ny >= 0.36 && ny <= 0.64);
  const inInnerCore = (nx >= 0.44 && nx <= 0.56 && ny >= 0.44 && ny <= 0.56);

  if ((inCenterBox && !inInnerHole) || inInnerCore) {
    return [255, 255, 255, 255]; // White QR symbol
  }

  // Corner markers
  const isTopLeft = (nx >= 0.18 && nx <= 0.32 && ny >= 0.18 && ny <= 0.32);
  const isTopRight = (nx >= 0.68 && nx <= 0.82 && ny >= 0.18 && ny <= 0.32);
  const isBottomLeft = (nx >= 0.18 && nx <= 0.32 && ny >= 0.68 && ny <= 0.82);

  if (isTopLeft || isTopRight || isBottomLeft) {
    return [255, 255, 255, 255];
  }

  return [r, g, b, a];
}

const iconsDir = path.resolve('frontend/assets/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate 192x192
const icon192 = createPng(192, 192, renderCampusHubIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);
console.log('Generated icon-192.png (' + icon192.length + ' bytes)');

// Generate 512x512
const icon512 = createPng(512, 512, renderCampusHubIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);
console.log('Generated icon-512.png (' + icon512.length + ' bytes)');

// Generate apple-touch-icon.png (180x180)
const appleIcon = createPng(180, 180, renderCampusHubIcon);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleIcon);
console.log('Generated apple-touch-icon.png (' + appleIcon.length + ' bytes)');

// Also generate SVG version
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#2563EB"/>
  <rect x="120" y="120" width="272" height="272" rx="24" fill="none" stroke="#FFFFFF" stroke-width="36"/>
  <rect x="220" y="220" width="72" height="72" rx="12" fill="#FFFFFF"/>
  <circle cx="160" cy="160" r="20" fill="#FFFFFF"/>
  <circle cx="352" cy="160" r="20" fill="#FFFFFF"/>
  <circle cx="160" cy="352" r="20" fill="#FFFFFF"/>
</svg>`;
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent, 'utf-8');
console.log('Generated icon.svg');
