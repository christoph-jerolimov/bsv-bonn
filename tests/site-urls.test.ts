import { describe, expect, it } from 'vitest';

import { DEFAULT_BASE, DEFAULT_SITE, normalizeBase, resolveSiteUrls } from '../src/lib/site-urls';

describe('normalizeBase', () => {
  it('normalizes slashes', () => {
    expect(normalizeBase(undefined)).toBe('/');
    expect(normalizeBase('')).toBe('/');
    expect(normalizeBase('/')).toBe('/');
    expect(normalizeBase('bsv-bonn')).toBe('/bsv-bonn');
    expect(normalizeBase('/bsv-bonn/')).toBe('/bsv-bonn');
    expect(normalizeBase('//bsv-bonn//')).toBe('/bsv-bonn');
  });
});

describe('resolveSiteUrls', () => {
  it('falls back to the defaults without environment variables', () => {
    expect(resolveSiteUrls({})).toEqual({ site: DEFAULT_SITE, base: DEFAULT_BASE });
  });

  it('derives site and base from the GitHub repository', () => {
    expect(resolveSiteUrls({ GITHUB_REPOSITORY: 'Example-Org/My-Site' })).toEqual({
      site: 'https://example-org.github.io',
      base: '/My-Site',
    });
  });

  it('serves user and organisation pages from the root', () => {
    expect(resolveSiteUrls({ GITHUB_REPOSITORY: 'example/example.github.io' })).toEqual({
      site: 'https://example.github.io',
      base: '/',
    });
  });

  it('prefers explicit overrides, e.g. for a custom domain', () => {
    expect(
      resolveSiteUrls({
        GITHUB_REPOSITORY: 'example/bsv-bonn',
        SITE_URL: 'https://bsv-bonn.de',
        BASE_PATH: '/',
      }),
    ).toEqual({ site: 'https://bsv-bonn.de', base: '/' });
  });
});
