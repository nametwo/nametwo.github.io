import SiteShell from '@/components/SiteShell';
import ReviewCard from '@/components/ReviewCard';
import { getAllReviews } from '@/lib/reviews';

export default function Home() {
  const reviews = getAllReviews();

  return (
    <SiteShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">전체 리뷰</h1>
        <p className="mt-2 text-sm text-zinc-500">
          총 {reviews.length}편의 논문 리뷰
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
