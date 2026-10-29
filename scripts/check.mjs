/* Sanity checks run by `npm run check` and CI: JS syntax, files referenced by index.html, manifest JSON. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const files = walk(root);
let failures = 0;

for (const file of files.filter((f) => f.endsWith('.js'))) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    failures++;
    console.error(`Syntax error in ${file}\n${err.stderr}`);
  }
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
for (const m of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) {
  if (!files.includes(join(root, m[1]))) {
    failures++;
    console.error(`index.html references a missing file: ${m[1]}`);
  }
}

JSON.parse(readFileSync(join(root, 'manifest.webmanifest'), 'utf8'));
console.log(failures ? `${failures} problem(s) found` : 'All checks passed');
process.exit(failures ? 1 : 0);
