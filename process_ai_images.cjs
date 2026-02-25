const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = '/Users/varunshiyam/.gemini/antigravity/brain/d0519ef2-b0ea-443b-85d1-e09519a2e473';
const destDir = path.join(__dirname, 'src', 'assets', 'images', 'menu-items');

const mappings = {
  'jp1_edamame_\\d+\\.png': 'jp1_edamame.webp',
};

async function processImages() {
  const files = fs.readdirSync(sourceDir);
  let converted = 0;
  
  for (const file of files) {
    for (const [pattern, targetName] of Object.entries(mappings)) {
      if (new RegExp(pattern).test(file)) {
        console.log(`Matched ${file} to ${targetName}`);
        const inputPath = path.join(sourceDir, file);
        const outputPath = path.join(destDir, targetName);
        
        try {
          await sharp(inputPath)
            .webp({ quality: 80, effort: 6 })
            .toFile(outputPath);
          console.log(`✅ Converted ${targetName}`);
          converted++;
        } catch (e) {
          console.error(`❌ Failed to convert ${file}:`, e.message);
        }
      }
    }
  }
  
  console.log(`Finished converting ${converted} AI images to WebP.`);
}

processImages();
