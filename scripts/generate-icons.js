// Script to generate PNG icons from HTML canvas
// Run with: node scripts/generate-icons.js

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const sizes = [512, 192, 180, 144, 96, 72, 48];
  
  for (const size of sizes) {
    console.log(`Generating ${size}x${size} icon...`);
    
    await page.setViewport({ width: size, height: size });
    
    // Create the icon using canvas
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; }
          body { width: ${size}px; height: ${size}px; overflow: hidden; }
          canvas { display: block; }
        </style>
      </head>
      <body>
        <canvas id="icon" width="${size}" height="${size}"></canvas>
        <script>
          const ctx = document.getElementById('icon').getContext('2d');
          const size = ${size};
          const scale = size / 512;
          
          // Background gradient
          const bgGrad = ctx.createLinearGradient(0, 0, size, size);
          bgGrad.addColorStop(0, '#5DD3C8');
          bgGrad.addColorStop(0.5, '#4DB6AC');
          bgGrad.addColorStop(1, '#26A69A');
          
          // Draw rounded rectangle background
          const radius = 108 * scale;
          ctx.beginPath();
          ctx.roundRect(0, 0, size, size, radius);
          ctx.fillStyle = bgGrad;
          ctx.fill();
          
          // Subtle circles overlay
          ctx.globalAlpha = 0.1;
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(80 * scale, 80 * scale, 60 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(432 * scale, 432 * scale, 80 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(420 * scale, 100 * scale, 40 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          
          // Center point
          const cx = size / 2;
          const cy = size / 2 - 20 * scale;
          
          ctx.save();
          ctx.translate(cx, cy);
          
          // Outer lotus petals
          for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i - 2) * 0.35);
            ctx.beginPath();
            ctx.ellipse(0, -60 * scale, 25 * scale, 50 * scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            ctx.restore();
          }
          
          // Inner lotus petals
          for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.rotate((i - 1) * 0.4);
            ctx.beginPath();
            ctx.ellipse(0, -40 * scale, 20 * scale, 40 * scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
            ctx.restore();
          }
          
          // Heart in center
          const heartGrad = ctx.createLinearGradient(-30 * scale, -30 * scale, 30 * scale, 30 * scale);
          heartGrad.addColorStop(0, '#F48FB1');
          heartGrad.addColorStop(1, '#EC407A');
          
          const heartSize = 35 * scale;
          ctx.beginPath();
          ctx.moveTo(0, heartSize * 0.4);
          ctx.bezierCurveTo(-heartSize, -heartSize * 0.2, -heartSize, -heartSize, 0, -heartSize * 0.5);
          ctx.bezierCurveTo(heartSize, -heartSize, heartSize, -heartSize * 0.2, 0, heartSize * 0.4);
          ctx.fillStyle = heartGrad;
          ctx.shadowColor = 'rgba(236, 64, 122, 0.4)';
          ctx.shadowBlur = 15 * scale;
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // Sparkles
          ctx.fillStyle = 'white';
          ctx.globalAlpha = 0.9;
          
          function drawStar(x, y, r) {
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
              const angle = (i * Math.PI) / 2;
              const x1 = x + Math.cos(angle) * r;
              const y1 = y + Math.sin(angle) * r;
              if (i === 0) ctx.moveTo(x1, y1);
              else ctx.lineTo(x1, y1);
              const midAngle = angle + Math.PI / 4;
              const x2 = x + Math.cos(midAngle) * r * 0.3;
              const y2 = y + Math.sin(midAngle) * r * 0.3;
              ctx.lineTo(x2, y2);
            }
            ctx.closePath();
            ctx.fill();
          }
          
          drawStar(-80 * scale, -50 * scale, 8 * scale);
          drawStar(85 * scale, -40 * scale, 6 * scale);
          drawStar(70 * scale, 50 * scale, 5 * scale);
          
          ctx.restore();
          
          // Draw "M" at bottom
          ctx.font = 'bold ' + (60 * scale) + 'px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'white';
          ctx.globalAlpha = 0.95;
          ctx.fillText('M', cx, size - 70 * scale);
        </script>
      </body>
      </html>
    `);
    
    // Wait for rendering
    await new Promise(r => setTimeout(r, 100));
    
    // Take screenshot
    const iconPath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.png`);
    await page.screenshot({ path: iconPath, omitBackground: true });
    console.log(`  Saved: ${iconPath}`);
  }
  
  // Also create apple-touch-icon
  console.log('Creating apple-touch-icon.png...');
  const applePath = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');
  fs.copyFileSync(
    path.join(__dirname, '..', 'public', 'icons', 'icon-180x180.png'),
    applePath
  );
  console.log(`  Saved: ${applePath}`);
  
  // Create favicon.ico (use 48x48 as a simple version)
  console.log('Creating favicon.png...');
  const faviconPath = path.join(__dirname, '..', 'public', 'favicon.png');
  fs.copyFileSync(
    path.join(__dirname, '..', 'public', 'icons', 'icon-48x48.png'),
    faviconPath
  );
  console.log(`  Saved: ${faviconPath}`);
  
  await browser.close();
  console.log('\\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
