import type { Element, Root } from 'hast';
import { describe, expect, it } from 'vitest';

import { isSiteAbsolute, rehypeBaseLinks, rewriteValue } from '../src/lib/rehype-base-links';

function link(href: string): Element {
  return { type: 'element', tagName: 'a', properties: { href }, children: [] };
}

function tree(...children: Element[]): Root {
  return { type: 'root', children };
}

describe('isSiteAbsolute', () => {
  it('only matches site absolute paths', () => {
    expect(isSiteAbsolute('/wir')).toBe(true);
    expect(isSiteAbsolute('//example.org/x')).toBe(false);
    expect(isSiteAbsolute('https://example.org')).toBe(false);
    expect(isSiteAbsolute('mailto:info@example.org')).toBe(false);
    expect(isSiteAbsolute('#top')).toBe(false);
    expect(isSiteAbsolute('../wir')).toBe(false);
  });
});

describe('rewriteValue', () => {
  it('prefixes only site absolute values', () => {
    expect(rewriteValue('/bsv-bonn', '/wir/vorstand/')).toBe('/bsv-bonn/wir/vorstand/');
    expect(rewriteValue('/bsv-bonn', 'https://example.org/')).toBe('https://example.org/');
  });
});

describe('rehypeBaseLinks', () => {
  it('rewrites links, images and nested elements', () => {
    const image: Element = {
      type: 'element',
      tagName: 'img',
      properties: { src: '/bilder/logo.png', alt: 'Logo' },
      children: [],
    };
    const paragraph: Element = {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [link('/wir'), link('mailto:a@b.de'), image],
    };
    const root = tree(paragraph);

    rehypeBaseLinks({ base: '/bsv-bonn' })(root);

    expect(link('/wir').properties.href).toBe('/wir');
    expect((paragraph.children[0] as Element).properties.href).toBe('/bsv-bonn/wir/');
    expect((paragraph.children[1] as Element).properties.href).toBe('mailto:a@b.de');
    expect(image.properties.src).toBe('/bsv-bonn/bilder/logo.png');
  });

  it('does nothing when the site is served from the root', () => {
    const anchor = link('/wir');
    rehypeBaseLinks({ base: '/' })(tree(anchor));
    expect(anchor.properties.href).toBe('/wir');
  });
});
