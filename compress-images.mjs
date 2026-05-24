// compress-images.mjs — run once to compress all PNG/GIF assets
import sharp from 'sharp';
import { readdirSync, statSync, renameSync } from 'fs';
import { join, extname, basename } from 'path';

const INPUT_DIR = './public/images';
const files = readdirSync(INPUT_DIR);

let totalSaved = 0;

for (const file of files) {
  const filePath = join(INPUT_DIR, file);
  const ext = extname(file).toLowerCase();
  const stat = statSync(filePath);
  const originalKB = Math.round(stat.size / 1024);

  // Skip GIFs (sharp can't compress GIF well) and already-processed webp
  if (ext === '.gif' || ext === '.webp') {
    console.log(`⏭  SKIP  ${file} (${originalKB} KB)`);
    continue;
  }

  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    const outPath = filePath; // overwrite in-place (save as compressed PNG)

    try {
      // Read into buffer first so we can overwrite the same file
      const buf = await sharp(filePath)
        .png({ quality: 80, compressionLevel: 9, effort: 10 })
        .toBuffer();

      const newKB = Math.round(buf.length / 1024);
      const saved = originalKB - newKB;
      totalSaved += saved;

      // Write the buffer back
      const { writeFileSync } = await import('fs');
      writeFileSync(outPath, buf);

      console.log(`✅ ${file.padEnd(45)} ${originalKB} KB → ${newKB} KB  (saved ${saved} KB)`);
    } catch (e) {
      console.error(`❌ ERROR ${file}: ${e.message}`);
    }
  }
}

console.log(`\n🎉 Total saved: ${Math.round(totalSaved / 1024 * 10) / 10} MB`);
