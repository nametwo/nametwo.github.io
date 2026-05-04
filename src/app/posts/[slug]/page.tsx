import type { Metadata } from 'next';
import { getAllPostSlugs, getAllPosts, getPostToc } from '@/lib/posts';
import { getSeriesName } from '@/lib/series';
import { SITE } from '@/lib/site';
import SiteShell from '@/components/SiteShell';
import Toc from '@/components/Toc';
import ReadingProgress from '@/components/ReadingProgress';
import Comments from '@/components/Comments';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getAllPosts().find((p) => p.slug === slug);
  if (!meta) return {};

  const url = `${SITE.url}/posts/${slug}`;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: meta.title,
      description: meta.summary,
      publishedTime: meta.date,
      tags: meta.tags,
      authors: [SITE.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.summary,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getAllPosts().find((p) => p.slug === slug);
  if (!meta) notFound();

  const toc = getPostToc(slug);
  const { default: MDXContent } = await import(`@/../content/posts/${slug}.mdx`);

  // schema.org BlogPosting 구조화 데이터.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.summary,
    datePublished: meta.date,
    author: { '@type': 'Person', name: SITE.author },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    keywords: meta.tags.join(', '),
    url: `${SITE.url}/posts/${slug}`,
  };

  return (
    <SiteShell>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <header className="mb-12">
            <p className="text-sm font-semibold text-blue-600">
              {meta.kind === 'paper'
                ? `${meta.field} · ${meta.venue} ${meta.year}`
                : meta.series
                  ? getSeriesName(meta.series)
                  : '개발 로그'}
            </p>
            <h1
              data-pagefind-meta="title"
              className="mt-2 text-4xl font-bold leading-tight"
            >
              {meta.title}
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              {meta.date} · 태그: {meta.tags.join(', ')}
            </p>
          </header>

          <article
            data-pagefind-body
            className="prose prose-zinc dark:prose-invert max-w-none"
          >
            <MDXContent />
          </article>

          <Comments />
        </div>

        <aside className="col-span-12 lg:col-span-4 hidden lg:block">
          <Toc items={toc} />
        </aside>
      </div>
    </SiteShell>
  );
}
