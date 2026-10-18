/**
 * Validates the markdown content: every navigation entry has a page, every page is
 * reachable from the navigation and all internal links point to existing pages.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

import { flattenNavigation, footerNavigation } from '../src/data/navigation';
import { idToPath } from '../src/lib/paths';

const pagesDir = join(__dirname, '..', 'src', 'content', 'pages');
const termineDir = join(__dirname, '..', 'src', 'content', 'termine');

function listMarkdown(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => join(entry.parentPath, entry.name));
}

function idOf(file: string): string {
  return relative(pagesDir, file).replace(/\\/g, '/').replace(/\.md$/, '');
}

function frontmatterOf(file: string): string {
  const source = readFileSync(file, 'utf8');
  const match = /^---\n([\s\S]*?)\n---/.exec(source);
  return match?.[1] ?? '';
}

function internalLinksOf(file: string): string[] {
  const source = readFileSync(file, 'utf8');
  return [...source.matchAll(/\]\((\/[^)\s#]*)(#[^)]*)?\)/g)].map((match) => match[1] ?? '');
}

const pageFiles = listMarkdown(pagesDir);
const termineFiles = listMarkdown(termineDir);
const pagePaths = new Set(pageFiles.map((file) => idToPath(idOf(file))));

describe('pages', () => {
  it('exist for every navigation entry', () => {
    for (const item of [...flattenNavigation(), ...footerNavigation]) {
      expect(pagePaths, `missing page for ${item.path}`).toContain(item.path);
    }
  });

  it('are all reachable from the navigation', () => {
    const navigationPaths = new Set(flattenNavigation().map((item) => item.path));
    for (const path of pagePaths) {
      expect(navigationPaths, `page ${path} is not linked in the navigation`).toContain(path);
    }
  });

  it('have a title and a description', () => {
    for (const file of pageFiles) {
      const frontmatter = frontmatterOf(file);
      expect(frontmatter, `${file} has no title`).toMatch(/^title: .+/m);
      expect(frontmatter, `${file} has no description`).toMatch(/^description: .+/m);
    }
  });

  it('only link to existing pages', () => {
    for (const file of [...pageFiles, ...termineFiles]) {
      for (const link of internalLinksOf(file)) {
        const target = link.replace(/\/$/, '') || '/';
        expect(pagePaths, `${file} links to unknown page ${link}`).toContain(target);
      }
    }
  });

  it('use trailing slashes for internal links', () => {
    for (const file of [...pageFiles, ...termineFiles]) {
      for (const link of internalLinksOf(file)) {
        expect(link, `${file}: link ${link} should end with a slash`).toMatch(/\/$/);
      }
    }
  });
});

describe('termine', () => {
  it('have a title and a valid date', () => {
    expect(termineFiles.length).toBeGreaterThan(0);
    for (const file of termineFiles) {
      const frontmatter = frontmatterOf(file);
      expect(frontmatter, `${file} has no title`).toMatch(/^title: .+/m);
      expect(frontmatter, `${file} has no ISO date`).toMatch(/^date: \d{4}-\d{2}-\d{2}$/m);
    }
  });

  it('are named after their date', () => {
    for (const file of termineFiles) {
      const date = /^date: (\d{4}-\d{2}-\d{2})$/m.exec(frontmatterOf(file))?.[1];
      expect(file, `${file} should start with ${date}`).toMatch(new RegExp(`/${date}-`));
    }
  });
});
