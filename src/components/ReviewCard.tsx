import Link from 'next/link';
import type { ReviewMeta } from '@/lib/reviews';

// 홈 / 카테고리 페이지에서 공유하는 리뷰 카드.
// 한 곳만 수정하면 모든 목록의 카드가 같이 변함.
export default function ReviewCard({ review }: { review: ReviewMeta }) {
  return (
    <li className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
      <Link href={`/reviews/${review.slug}`} className="group block">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="font-semibold text-blue-600">{review.field}</span>
          <span>·</span>
          <span>
            {review.venue} {review.year}
          </span>
          <span>·</span>
          <span>{review.date}</span>
        </div>
        <h2 className="mt-2 text-xl font-bold group-hover:text-blue-600 transition">
          {review.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {review.summary}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {review.tags.map((tag) => (
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
