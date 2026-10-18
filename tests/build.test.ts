/**
 * Checks the build output in `dist/`. These tests run after `npm run build`
 * and are skipped when no build output exists.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

import { flattenNavigation } from '../src/data/navigation';

const distDir = join(__dirname, '..', 'dist');
const hasBuild = existsSync(join(distDir, 'index.html'));

function listHtml(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => join(entry.parentPath, entry.name));
}

function detectBase(): string {
  const html = readFileSync(join(distDir, 'index.html'), 'utf8');
  const match = /<link rel="icon" href="([^"]*)favicon\.svg"/.exec(html);
  return (match?.[1] ?? '/').replace(/\/$/, '') || '';
}

describe.skipIf(!hasBuild)('build output', () => {
  const base = detectBase();
  const htmlFiles = listHtml(distDir);

  it('contains a page for every navigation entry', () => {
    for (const item of flattenNavigation()) {
      const file = join(distDir, item.path, 'index.html');
      expect(existsSync(file), `missing ${relative(distDir, file)}`).toBe(true);
    }
  });

  it('contains a 404 page, a sitemap and robots.txt', () => {
    expect(existsSync(join(distDir, '404.html'))).toBe(true);
    expect(existsSync(join(distDir, 'sitemap-index.xml'))).toBe(true);
    expect(existsSync(join(distDir, 'robots.txt'))).toBe(true);
  });

  it('only links to pages and files that exist', () => {
    for (const file of htmlFiles) {
      const html = readFileSync(file, 'utf8');
      const links = [...html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)].map((match) => match[1] ?? '');
      for (const link of links) {
        expect(link.startsWith(`${base}/`) || link === base, `${file}: ${link} misses base`).toBe(
          true,
        );
        const path = link.slice(base.length);
        const target = path.endsWith('/') ? join(distDir, path, 'index.html') : join(distDir, path);
        expect(existsSync(target), `${relative(distDir, file)} links to missing ${link}`).toBe(
          true,
        );
      }
    }
  });

  it('has a lang attribute, a title and a viewport meta tag on every page', () => {
    for (const file of htmlFiles) {
      const html = readFileSync(file, 'utf8');
      expect(html).toContain('<html lang="de">');
      expect(html).toMatch(/<title>[^<]+<\/title>/);
      expect(html).toContain('name="viewport"');
      expect(html).toContain('<main id="inhalt"');
    }
  });
});
