import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as any;

  const fontPath = resolve(
    './node_modules/@fontsource/montserrat/files/montserrat-latin-800-normal.woff'
  );
  const fontData = readFileSync(fontPath);
  const globeBuffer = readFileSync(resolve('./public/globe.png'));
  const globeData = 'data:image/png;base64,' + globeBuffer.toString('base64');

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a0e1a',
          padding: '80px',
          fontFamily: 'Montserrat',
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(107, 182, 232, 0.25), transparent 50%), radial-gradient(circle at 10% 90%, rgba(232, 245, 91, 0.15), transparent 50%)',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '20px' },
              children: [
                                {
                  type: 'img',
                  props: {
                    src: globeData,
                    width: 72,
                    height: 72,
                    style: {
                      objectFit: 'contain',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '32px',
                      fontWeight: 800,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                    },
                    children: 'Toven360°',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '24px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 800,
                      color: '#e8f55b',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    },
                    children: post.data.category,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '68px',
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.15,
                      letterSpacing: '-0.03em',
                    },
                    children: post.data.title,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '32px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '22px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontWeight: 400,
                    },
                    children: post.data.author,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '22px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontWeight: 400,
                    },
                    children: 'toven360.com',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Montserrat',
          data: fontData,
          weight: 800,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};