import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://zeke.studio',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [mdx()],
  redirects: {
    '/about/':       '/archive/about/',
    '/experiments/': '/archive/experiments/',
    '/work/ascii-booth/':             '/archive/work/ascii-booth/',
    '/work/chill_by_netflix/':        '/archive/work/chill_by_netflix/',
    '/work/deepfake_karaoke/':        '/archive/work/deepfake_karaoke/',
    '/work/dublab/':                  '/archive/work/dublab/',
    '/work/formosa/':                 '/archive/work/formosa/',
    '/work/how_to_deepfake_yourself/':'/archive/work/how_to_deepfake_yourself/',
    '/work/order_and_chaos/':         '/archive/work/order_and_chaos/',
    '/work/the_blade/':               '/archive/work/the_blade/',
  },
});
