// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import swup from '@swup/astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://toven360.com',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    swup({
      // @ts-ignore
      theme: 'fade',
      animationClass: 'transition-',
      containers: ['main'],
      smoothScrolling: true,
      accessibility: true,
    }),
    sitemap(),
  ],
});