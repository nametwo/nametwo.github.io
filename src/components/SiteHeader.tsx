import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import Search from '@/components/Search';
import GitHubLink from '@/components/GitHubLink';
import { SITE } from '@/lib/site';

// 모든 페이지 상단에 고정되는 사이트 헤더.
// fixed로 깔아두는 이유: <html>에 overflow-x: hidden을 걸어둬서
// sticky가 깨질 수 있는 환경 — fixed가 더 안전. body의 pt-14가 헤더 높이 보정.
// z-40 — 리뷰 상세의 ReadingProgress(z-50)는 의도적으로 위에 그려짐.
export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="font-semibold">
          📚 {SITE.name}
        </Link>
        <div className="flex items-center gap-3">
          <Search />
          <GitHubLink />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
