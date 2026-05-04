import Link from 'next/link';
import { getSidebarData } from '@/lib/reviews';
import type { ReactNode } from 'react';

// 모든 페이지가 공유할 좌측 사이드바 + 본문 레이아웃.
// children 자리에 페이지마다 다른 내용이 들어감.
export default function SiteShell({ children }: { children: ReactNode }) {
  // 서버 컴포넌트라서 파일 시스템에 직접 접근 가능. 빌드 시점에 데이터가 박힘.
  const { total, fields, venues, tags } = getSidebarData();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-8 px-6 py-12">
        
        {/* 좌측 사이드바 */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="lg:sticky lg:top-20">
            <p className="mb-6 text-xs text-zinc-500">전체 {total}편</p>

            <nav className="space-y-6 text-sm">
              <Section title="분야" items={fields} basePath="/fields" />
              <Section title="학회" items={venues} basePath="/venues" />
              <Section title="태그" items={tags.slice(0, 10)} basePath="/tags" />
            </nav>
          </div>
        </aside>

        {/* 본문 영역 */}
        <main className="col-span-12 lg:col-span-9 min-w-0">{children}</main>
      </div>
    </div>
  );
}

// 사이드바의 한 섹션 (분야/학회/태그). 반복되는 마크업이라 컴포넌트로 분리.
function Section({
  title,
  items,
  basePath,
}: {
  title: string;
  items: { name: string; count: number; slug: string }[];
  basePath: string;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="pb-2 text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${basePath}/${item.slug}`}
              className="flex justify-between py-1 hover:text-blue-600"
            >
              <span>{item.name}</span>
              <span className="text-zinc-400">{item.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}