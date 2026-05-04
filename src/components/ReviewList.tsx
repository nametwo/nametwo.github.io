import SiteShell from '@/components/SiteShell';
import ReviewCard from '@/components/ReviewCard';
import type { ReviewMeta } from '@/lib/reviews';

// 카테고리(분야/학회/태그) 페이지의 공통 셸.
// 헤더 라벨/이름 + 카드 리스트 형태가 동일해서 한 컴포넌트로 묶음.
export default function ReviewList({
  category,
  name,
  reviews,
}: {
  category: string;
  name: string;
  reviews: ReviewMeta[];
}) {
  return (
    <SiteShell>
      <header className="mb-8">
        <p className="text-sm font-semibold text-blue-600">{category}</p>
        <h1 className="mt-1 text-3xl font-bold">{name}</h1>
        <p className="mt-2 text-sm text-zinc-500">
          총 {reviews.length}편의 리뷰
        </p>
      </header>

      <ul className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.slug} review={review} />
        ))}
      </ul>
    </SiteShell>
  );
}
