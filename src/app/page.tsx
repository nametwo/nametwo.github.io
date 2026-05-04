import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import PostCard from '@/components/PostCard';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const posts = getAllPosts();

  return (
    <SiteShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">최근 글</h1>
        <p className="mt-2 text-sm text-zinc-500">
          논문 리뷰와 개발 로그를 함께 정리합니다
        </p>
      </header>

      <div className="mb-8 flex gap-4 text-sm">
        <Link
          href="/papers"
          className="text-blue-600 hover:underline"
        >
          논문 리뷰만 보기 →
        </Link>
        <Link
          href="/devlogs"
          className="text-emerald-600 hover:underline"
        >
          개발 로그만 보기 →
        </Link>
      </div>

      <ul className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </SiteShell>
  );
}
