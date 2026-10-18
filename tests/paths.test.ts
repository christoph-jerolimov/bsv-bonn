import { describe, expect, it } from 'vitest';

import { hasFileExtension, idToPath, joinBase, normalizePath, stripBase } from '../src/lib/paths';

describe('joinBase', () => {
  it('prefixes pages with the base path and adds a trailing slash', () => {
    expect(joinBase('/bsv-bonn', '/wir/vorstand')).toBe('/bsv-bonn/wir/vorstand/');
    expect(joinBase('/bsv-bonn', 'wir/vorstand/')).toBe('/bsv-bonn/wir/vorstand/');
  });

  it('keeps the root path intact', () => {
    expect(joinBase('/', '/')).toBe('/');
    expect(joinBase('/bsv-bonn', '/')).toBe('/bsv-bonn/');
    expect(joinBase('/bsv-bonn/', '/')).toBe('/bsv-bonn/');
  });

  it('does not add a trailing slash to files', () => {
    expect(joinBase('/bsv-bonn', '/satzung.pdf')).toBe('/bsv-bonn/satzung.pdf');
    expect(joinBase('/', '/favicon.svg')).toBe('/favicon.svg');
  });

  it('keeps fragments', () => {
    expect(joinBase('/bsv-bonn', '/wir#kontakt')).toBe('/bsv-bonn/wir/#kontakt');
  });
});

describe('normalizePath / stripBase', () => {
  it('normalizes trailing slashes', () => {
    expect(normalizePath('/wir/')).toBe('/wir');
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('')).toBe('/');
  });

  it('strips the base path', () => {
    expect(stripBase('/bsv-bonn', '/bsv-bonn/wir/')).toBe('/wir');
    expect(stripBase('/bsv-bonn', '/bsv-bonn/')).toBe('/');
    expect(stripBase('/', '/wir/')).toBe('/wir');
  });
});

describe('idToPath', () => {
  it('maps collection ids to site paths', () => {
    expect(idToPath('index')).toBe('/');
    expect(idToPath('wir')).toBe('/wir');
    expect(idToPath('wir/vorstand')).toBe('/wir/vorstand');
  });
});

describe('hasFileExtension', () => {
  it('detects files', () => {
    expect(hasFileExtension('/dokument.pdf')).toBe(true);
    expect(hasFileExtension('/wir/vorstand')).toBe(false);
    expect(hasFileExtension('/wir.v2/vorstand')).toBe(false);
  });
});
