// Copies the built admin dashboard (hiya-admin/dist) into the website build
// (dist/admin), so both are published as one static site.
// Uses only Node's built-in fs, so it works the same on Windows, macOS and Linux.
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'hiya-admin', 'dist');
const target = join(root, 'dist', 'admin');

if (!existsSync(join(source, 'index.html'))) {
  console.error('hiya-admin/dist/index.html not found. Run the admin build first.');
  process.exit(1);
}
if (!existsSync(join(root, 'dist', 'index.html'))) {
  console.error('dist/index.html not found. Run the website build first.');
  process.exit(1);
}

rmSync(target, { recursive: true, force: true }); // remove an old copy
cpSync(source, target, { recursive: true });
console.log('Copied hiya-admin/dist -> dist/admin');
