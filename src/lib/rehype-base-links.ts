/**
 * Rehype plugin that prefixes site absolute links (`/wir/vorstand`) and sources in
 * markdown content with the configured base path, so the content works both at the
 * domain root and under a GitHub Pages project path such as `/bsv-bonn/`.
 */
import type { Element, Root } from 'hast';

import { joinBase } from './paths';

export interface RehypeBaseLinksOptions {
  base: string;
}

const ATTRIBUTES_BY_TAG: Record<string, string[]> = {
  a: ['href'],
  img: ['src'],
  source: ['src'],
  audio: ['src'],
  video: ['src', 'poster'],
};

export function isSiteAbsolute(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//');
}

export function rewriteValue(base: string, value: string): string {
  return isSiteAbsolute(value) ? joinBase(base, value) : value;
}

type Node = Root | Element | { type: string; children?: Node[] };

function visit(node: Node, base: string): void {
  if (node.type === 'element') {
    const element = node as Element;
    const attributes = ATTRIBUTES_BY_TAG[element.tagName];
    if (attributes) {
      for (const attribute of attributes) {
        const value = element.properties[attribute];
        if (typeof value === 'string') {
          element.properties[attribute] = rewriteValue(base, value);
        }
      }
    }
  }
  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      visit(child, base);
    }
  }
}

export function rehypeBaseLinks(options: RehypeBaseLinksOptions) {
  const base = options.base;
  return (tree: Root): void => {
    if (base === '/' || base === '') {
      return;
    }
    visit(tree, base);
  };
}
