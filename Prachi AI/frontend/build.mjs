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
  html = html.replaceAll('href="/index.css"', 'href="./index.css"');
  html = html.replaceAll('href="/bundle.css"', 'href="./bundle.css"');
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

  // Also deploy to root prachi/ folder for Vercel & portfolio integration
  const rootPrachiDir = path.resolve('../../prachi');
  if (!fs.existsSync(rootPrachiDir)) fs.mkdirSync(rootPrachiDir, { recursive: true });

  // Create root prachi/index.html with absolute paths
  let prachiHtml = fs.readFileSync('index.html', 'utf-8');
  prachiHtml = prachiHtml.replace(/src="[^"]*src\/main\.tsx"/, 'src="/prachi/bundle.js"');
  prachiHtml = prachiHtml.replaceAll('href="./index.css"', 'href="/prachi/index.css"');
  prachiHtml = prachiHtml.replaceAll('href="/index.css"', 'href="/prachi/index.css"');
  prachiHtml = prachiHtml.replaceAll('href="./bundle.css"', 'href="/prachi/bundle.css"');
  prachiHtml = prachiHtml.replaceAll('href="/bundle.css"', 'href="/prachi/bundle.css"');
  prachiHtml = prachiHtml.replaceAll('href="./assets/', 'href="/prachi/assets/');
  fs.writeFileSync(path.join(rootPrachiDir, 'index.html'), prachiHtml);

  // Copy bundle.js, bundle.js.map, bundle.css, bundle.css.map, index.css to root prachi
  const filesToCopy = ['bundle.js', 'bundle.js.map', 'bundle.css', 'bundle.css.map', 'index.css'];
  for (const f of filesToCopy) {
    const src = path.join('dist', f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(rootPrachiDir, f));
    }
  }

  // Copy assets folder to root prachi
  if (fs.existsSync('dist/assets')) {
    const rootAssetsDir = path.join(rootPrachiDir, 'assets');
    if (!fs.existsSync(rootAssetsDir)) fs.mkdirSync(rootAssetsDir, { recursive: true });
    for (const file of fs.readdirSync('dist/assets')) {
      fs.copyFileSync(path.join('dist/assets', file), path.join(rootAssetsDir, file));
    }
  }

  console.log('Frontend built successfully into frontend/dist AND root prachi/ directory!');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
