import Link from 'next/link';
import { getSidebarData } from '@/lib/posts';
import type { ReactNode } from 'react';

// 모든 페이지가 공유할 좌측 사이드바 + 본문 레이아웃.
export default function SiteShell({ children }: { children: ReactNode }) {
  const { papers, devlogs, fields, venues, series, tags } = getSidebarData();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-8 px-6 py-12">
        <aside className="col-span-12 lg:col-span-3">
          <div className="lg:sticky lg:top-20">
            <p className="mb-6 text-xs text-zinc-500">
              논문 리뷰 {papers}편 · 개발 로그 {devlogs}편
            </p>

            <nav className="space-y-6 text-sm">
              <Section title="분야" items={fields} basePath="/fields" />
              <Section title="학회" items={venues} basePath="/venues" />
              <Section title="시리즈" items={series} basePath="/series" />
              <Section title="태그" items={tags.slice(0, 10)} basePath="/tags" />
            </nav>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 min-w-0">{children}</main>
      </div>
    </div>
  );
}

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
