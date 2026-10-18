/**
 * Helpers to build site internal links that respect the configured `base` path.
 */
import { normalizeBase } from './site-urls';

/**
 * Joins the base path with a site absolute path.
 *
 * - `joinBase('/bsv-bonn', '/wir/vorstand')` → `/bsv-bonn/wir/vorstand/`
 * - `joinBase('/', '/')` → `/`
 * - `joinBase('/bsv-bonn', '/dokument.pdf')` → `/bsv-bonn/dokument.pdf`
 */
export function joinBase(base: string, path: string): string {
  const normalizedBase = normalizeBase(base);
  const prefix = normalizedBase === '/' ? '' : normalizedBase;

  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  const [pathname, hash] = splitHash(cleanPath);
  cleanPath = pathname;

  if (cleanPath !== '/' && !hasFileExtension(cleanPath) && !cleanPath.endsWith('/')) {
    cleanPath = `${cleanPath}/`;
  }

  return `${prefix}${cleanPath}${hash}`;
}

/**
 * Builds a link relative to the configured base path of the site.
 */
export function href(path: string): string {
  return joinBase(import.meta.env.BASE_URL, path);
}

/**
 * Normalizes a path for comparisons (no base, single leading slash, no trailing slash).
 */
export function normalizePath(path: string): string {
  const [pathname] = splitHash(path);
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/**
 * Strips the base path from a pathname, so `/bsv-bonn/wir/` becomes `/wir`.
 */
export function stripBase(base: string, pathname: string): string {
  const normalizedBase = normalizeBase(base);
  if (normalizedBase !== '/' && pathname.startsWith(normalizedBase)) {
    return normalizePath(pathname.slice(normalizedBase.length) || '/');
  }
  return normalizePath(pathname);
}

/**
 * Converts a content collection id (`wir/vorstand`, `index`) into a site path (`/wir/vorstand`, `/`).
 */
export function idToPath(id: string): string {
  if (id === 'index') {
    return '/';
  }
  const withoutIndex = id.replace(/\/index$/, '');
  return `/${withoutIndex}`;
}

/**
 * Checks whether a path points to a file (e.g. `/formular.pdf`) rather than a page.
 */
export function hasFileExtension(path: string): boolean {
  const lastSegment = path.split('/').pop() ?? '';
  return /\.[a-z0-9]+$/i.test(lastSegment);
}

function splitHash(path: string): [string, string] {
  const index = path.indexOf('#');
  if (index === -1) {
    return [path, ''];
  }
  return [path.slice(0, index), path.slice(index)];
}
