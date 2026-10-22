import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'Toven360° — Insights',
    description: 'Technical insights on AI agents, backend engineering, and digital infrastructure from the Toven360° team.',
    site: context.site ?? 'https://toven360.com',
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        author: post.data.author,
        link: `/blog/${post.id}/`,
        categories: [post.data.category, ...post.data.tags],
      })),
    customData: `<language>en-us</language>`,
  });
}