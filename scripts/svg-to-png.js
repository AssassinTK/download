const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const svgPath = path.resolve(__dirname, '../public/logo.svg');
    const pngPath = path.resolve(__dirname, '../public/logo.png');
    const svg = await fs.promises.readFile(svgPath);
    const image = sharp(svg).png();
    await image.toFile(pngPath);
    console.log('Converted', svgPath, '->', pngPath);
  } catch (err) {
    console.error('Conversion error:', err);
    process.exit(1);
  }
})();
