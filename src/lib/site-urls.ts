/**
 * Resolves the public `site` URL and the `base` path of the website.
 *
 * On GitHub Pages a project site is served from `https://<owner>.github.io/<repo>/`,
 * so the base path has to match the repository name. The deploy workflow passes the
 * repository through `GITHUB_REPOSITORY`; `SITE_URL` and `BASE_PATH` can override both
 * values (for example when a custom domain is used).
 */
export interface SiteUrls {
  site: string;
  base: string;
}

export const DEFAULT_SITE = 'https://christoph-jerolimov.github.io';
export const DEFAULT_BASE = '/bsv-bonn';

export type EnvLike = Record<string, string | undefined>;

export function normalizeBase(base: string | undefined): string {
  if (!base) {
    return '/';
  }
  let normalized = base.trim();
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  // collapse duplicate and trailing slashes, keep a single leading slash
  normalized = normalized.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
}

export function resolveSiteUrls(env: EnvLike): SiteUrls {
  const repository = env.GITHUB_REPOSITORY;
  const [owner, repo] = repository?.split('/') ?? [];

  const site = env.SITE_URL ?? (owner ? `https://${owner.toLowerCase()}.github.io` : DEFAULT_SITE);

  let base: string;
  if (env.BASE_PATH !== undefined) {
    base = normalizeBase(env.BASE_PATH);
  } else if (repo) {
    // `<owner>.github.io` repositories are served from the domain root
    base = repo.toLowerCase() === `${owner?.toLowerCase()}.github.io` ? '/' : normalizeBase(repo);
  } else {
    base = DEFAULT_BASE;
  }

  return { site, base };
}
