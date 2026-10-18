import { describe, expect, it } from 'vitest';

import {
  breadcrumbsFor,
  findSection,
  flattenNavigation,
  footerNavigation,
  navigation,
} from '../src/data/navigation';

describe('navigation', () => {
  it('has unique paths', () => {
    const paths = flattenNavigation().map((item) => item.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('starts every path with a slash and has no trailing slash', () => {
    for (const item of [...flattenNavigation(), ...footerNavigation]) {
      expect(item.path.startsWith('/')).toBe(true);
      expect(item.path === '/' || !item.path.endsWith('/')).toBe(true);
    }
  });

  it('nests children under their section path', () => {
    for (const section of navigation) {
      for (const child of section.children ?? []) {
        expect(child.path.startsWith(`${section.path}/`)).toBe(true);
      }
    }
  });

  it('finds sections', () => {
    expect(findSection('/wir/vorstand')?.title).toBe('Wir');
    expect(findSection('/aktiv-bleiben')?.title).toBe('Aktiv bleiben');
    expect(findSection('/unbekannt')).toBeUndefined();
  });

  it('builds breadcrumbs', () => {
    expect(breadcrumbsFor('/').map((item) => item.title)).toEqual(['Startseite']);
    expect(breadcrumbsFor('/wir').map((item) => item.title)).toEqual(['Startseite', 'Wir']);
    expect(breadcrumbsFor('/wir/vorstand').map((item) => item.title)).toEqual([
      'Startseite',
      'Wir',
      'Vorstand',
    ]);
  });
});
