import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';

import { rehypeBaseLinks } from './src/lib/rehype-base-links';
import { resolveSiteUrls } from './src/lib/site-urls';

const { site, base } = resolveSiteUrls(process.env);

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    // The remark/rehype pipeline is used so internal links in markdown can be prefixed with `base`.
    processor: unified({
      rehypePlugins: [[rehypeBaseLinks, { base }]],
    }),
  },
  build: {
    format: 'directory',
  },
});
