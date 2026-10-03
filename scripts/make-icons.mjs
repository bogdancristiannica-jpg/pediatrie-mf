// Generează pictogramele PWA (PNG) fără nicio dependență: fundal albastru-verzui, cruce albă.
// Rulează doar când schimbi designul pictogramei; fișierele rezultate se comit în src/assets/.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src", "assets");
const BG = [0x0a, 0x5c, 0x6b],
  FG = [255, 255, 255];

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

function png(size) {
  const bar = Math.round(size * 0.18),
    arm = Math.round(size * 0.28),
    c = size / 2;
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    row[0] = 0;
    for (let x = 0; x < size; x++) {
      const inBar = (Math.abs(x - c) < bar / 2 && Math.abs(y - c) < arm) || (Math.abs(y - c) < bar / 2 && Math.abs(x - c) < arm);
      const px = inBar ? FG : BG;
      row[1 + x * 3] = px[0];
      row[2 + x * 3] = px[1];
      row[3 + x * 3] = px[2];
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const s of [180, 192, 512]) {
  writeFileSync(resolve(out, `icon-${s}.png`), png(s));
  console.log(`src/assets/icon-${s}.png`);
}
