#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

// 自動生成動態引入的路由配置
async function generateRoutes() {
  const componentsDir = path.join(__dirname, '../components');
  const files = await fs.readdir(componentsDir);
  
  const routes = files
    .filter(file => file.endsWith('.tsx') && !file.includes('.test.'))
    .map(file => {
      const name = path.basename(file, '.tsx');
      return `
const ${name} = React.lazy(() => import('../components/${name}'));`;
    })
    .join('\n');

  const routerContent = `
import React from 'react';

// 動態引入的組件
${routes}

export const routes = {
  ${files
    .filter(file => file.endsWith('.tsx') && !file.includes('.test.'))
    .map(file => {
      const name = path.basename(file, '.tsx');
      return `'${name}': ${name}`;
    })
    .join(',\n  ')}
};
`;

  await fs.writeFile(
    path.join(__dirname, '../src/routes.tsx'),
    routerContent
  );
}

// 優化靜態資源
async function optimizeAssets() {
  const publicDir = path.join(__dirname, '../public');
  const files = await fs.readdir(publicDir);
  
  // 處理圖片優化
  const imageFiles = files.filter(file => 
    file.match(/\.(png|jpg|jpeg|gif|svg)$/i)
  );

  if (imageFiles.length > 0) {
    console.log('正在優化圖片...');
    const sharp = require('sharp');
    
    for (const file of imageFiles) {
      const filePath = path.join(publicDir, file);
      const stats = await fs.stat(filePath);
      
      // 只優化大於 50KB 的圖片
      if (stats.size > 50 * 1024) {
        try {
          const image = sharp(filePath);
          const metadata = await image.metadata();
          
          // 根據圖片類型選擇優化策略
          if (metadata.format === 'svg') {
            // SVG 保持原樣
            continue;
          } else {
            // 其他格式進行壓縮
            await image
              .resize(metadata.width, metadata.height, {
                fit: 'inside',
                withoutEnlargement: true
              })
              .webp({ quality: 80 })
              .toFile(filePath.replace(/\.[^.]+$/, '.webp'));
          }
        } catch (err) {
          console.error(`優化圖片 ${file} 失敗:`, err);
        }
      }
    }
  }
}

// 生成緩存配置
async function generateServiceWorker() {
  const workboxBuild = require('workbox-build');
  
  const { count, size, warnings } = await workboxBuild.generateSW({
    globDirectory: 'build',
    globPatterns: [
      '**/*.{js,css,html,png,jpg,jpeg,gif,svg,webp}'
    ],
    swDest: 'build/service-worker.js',
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [{
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    }],
  });
  
  console.log(`生成 Service Worker 文件，緩存 ${count} 個文件，總大小 ${size} bytes`);
  if (warnings.length > 0) {
    console.warn('Service Worker 警告:', warnings);
  }
}

// 主函數
async function main() {
  try {
    await generateRoutes();
    await optimizeAssets();
    await generateServiceWorker();
    console.log('所有優化任務完成！');
  } catch (err) {
    console.error('優化過程發生錯誤:', err);
    process.exit(1);
  }
}

main();