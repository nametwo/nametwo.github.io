import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { getSeriesName } from '@/lib/series';

// 홈 / 카테고리 페이지에서 공유하는 글 카드.
// kind에 따라 메타 줄(분야·학회·년도 vs 시리즈)이 달라짐.
export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <li className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
      <Link href={`/posts/${post.slug}`} className="group block">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          {post.kind === 'paper' ? (
            <>
              <span className="font-semibold text-blue-600">{post.field}</span>
              <span>·</span>
              <span>
                {post.venue} {post.year}
              </span>
            </>
          ) : (
            <span className="font-semibold text-emerald-600">
              🛠️ {post.series ? getSeriesName(post.series) : '개발 로그'}
            </span>
          )}
          <span>·</span>
          <span>{post.date}</span>
        </div>
        <h2 className="mt-2 text-xl font-bold group-hover:text-blue-600 transition">
          {post.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {post.summary}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </Link>
    </li>
  );
}
