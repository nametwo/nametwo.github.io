import SiteShell from '@/components/SiteShell';
import PostCard from '@/components/PostCard';
import type { PostMeta } from '@/lib/posts';

// 카테고리(분야/학회/태그/시리즈) 페이지의 공통 셸.
export default function PostList({
  category,
  name,
  posts,
}: {
  category: string;
  name: string;
  posts: PostMeta[];
}) {
  return (
    <SiteShell>
      <header className="mb-8">
        <p className="text-sm font-semibold text-blue-600">{category}</p>
        <h1 className="mt-1 text-3xl font-bold">{name}</h1>
        <p className="mt-2 text-sm text-zinc-500">총 {posts.length}편</p>
      </header>

      <ul className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </SiteShell>
  );
}
