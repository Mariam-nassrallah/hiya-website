// Copies the built admin dashboard (hiya-admin/dist) into the website build
// (dist/admin), so both are published as one static site.
// Uses only Node's built-in fs, so it works the same on Windows, macOS and Linux.
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'hiya-admin', 'dist');
const target = join(root, 'dist', 'admin');

// The admin's page URLs (see hiya-admin/src/App.jsx). Keep this list in sync.
const ADMIN_PAGES = ['login', 'users', 'products', 'orders'];

if (!existsSync(join(source, 'index.html'))) {
  console.error('hiya-admin/dist/index.html not found. Run the admin build first.');
  process.exit(1);
}
if (!existsSync(join(root, 'dist', 'index.html'))) {
  console.error('dist/index.html not found. Run the website build first.');
  process.exit(1);
}

// 1. Copy the whole admin build to dist/admin
rmSync(target, { recursive: true, force: true }); // remove an old copy
cpSync(source, target, { recursive: true });
console.log('Copied hiya-admin/dist -> dist/admin');

// 2. Safety net: put the admin's index.html at dist/admin/<page>/index.html.
//    Static hosts serve a folder's index.html for /admin/login even when no
//    rewrite rule is set up, so these pages (and a refresh on them) always load.
//    The rewrite /admin/* -> /admin/index.html still covers every other path.
for (const page of ADMIN_PAGES) {
  mkdirSync(join(target, page), { recursive: true });
  copyFileSync(join(target, 'index.html'), join(target, page, 'index.html'));
}
console.log(`Added page entry points: ${ADMIN_PAGES.map((p) => `/admin/${p}`).join(', ')}`);
