// Serves the built site (dist/) the same way the Render static site does,
// so you can test the production build before deploying.
//
//   npm run build
//   npm run preview:dist        -> http://localhost:4173
//
// Rules, in order (same as on Render):
//   1. A real file (or a folder with an index.html) is served as it is.
//   2. /admin/*  -> /admin/index.html   (admin dashboard pages)
//   3. /*        -> /index.html         (website)
// Every request is printed with its status, so a 404 is easy to spot.
// One difference on purpose: a missing FILE (a path with an extension, such as
// /admin/assets/app.js) returns 404 instead of an HTML page, so broken asset
// paths show up here instead of failing silently.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

/** Returns the file on disk for a URL path, or null. Folders use their index.html. */
function findFile(urlPath) {
  const file = normalize(join(DIST, urlPath));
  if (!file.startsWith(DIST + sep) && file !== DIST) return null; // stay inside dist/
  if (!existsSync(file)) return null;
  if (statSync(file).isDirectory()) {
    const index = join(file, 'index.html');
    return existsSync(index) ? index : null;
  }
  return file;
}

createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = findFile(urlPath);
  let note = '';

  if (!file && !extname(urlPath)) {
    // Page addresses: apply the rewrite rules
    const isAdmin = urlPath === '/admin' || urlPath.startsWith('/admin/');
    file = join(DIST, isAdmin ? join('admin', 'index.html') : 'index.html');
    note = ` -> rewrite to ${isAdmin ? '/admin/index.html' : '/index.html'}`;
  }

  if (!file) {
    console.log(`404 ${urlPath}   <-- missing file`);
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  console.log(`200 ${urlPath}${note}`);
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
}).listen(PORT, () => {
  console.log(`Serving dist/ like Render at http://localhost:${PORT}`);
  console.log(`  website: http://localhost:${PORT}/`);
  console.log(`  admin:   http://localhost:${PORT}/admin/login`);
});
