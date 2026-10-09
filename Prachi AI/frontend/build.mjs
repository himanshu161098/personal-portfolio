import { build } from '../backend/node_modules/esbuild/lib/main.js';
import fs from 'fs';
import path from 'path';

console.log('Building frontend with esbuild...');
try {
  await build({
    entryPoints: ['src/main.tsx'],
    bundle: true,
    outfile: 'dist/bundle.js',
    minify: false,
    sourcemap: true,
    target: ['es2020'],
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    loader: {
      '.png': 'dataurl',
      '.svg': 'text',
    },
  });

  // Ensure dist exists
  if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });

  // Read index.html, update script tag for production bundle, and write to dist
  let html = fs.readFileSync('index.html', 'utf-8');
  html = html.replace(/src="[^"]*src\/main\.tsx"/, 'src="./bundle.js"');
  html = html.replace('href="/index.css"', 'href="./index.css"');
  html = html.replace('href="/bundle.css"', 'href="./bundle.css"');
  fs.writeFileSync('dist/index.html', html);

  if (fs.existsSync('src/styles/index.css')) {
    fs.copyFileSync('src/styles/index.css', 'dist/index.css');
  }

  // Copy assets folder if present
  if (fs.existsSync('src/assets')) {
    if (!fs.existsSync('dist/assets')) fs.mkdirSync('dist/assets', { recursive: true });
    for (const file of fs.readdirSync('src/assets')) {
      fs.copyFileSync(path.join('src/assets', file), path.join('dist/assets', file));
    }
  }

  console.log('Frontend built successfully into frontend/dist!');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
