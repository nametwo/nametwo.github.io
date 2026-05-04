import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-zinc-500">
        <div>
          © {new Date().getFullYear()} {SITE.operator.name}. All rights
          reserved.
        </div>
        <nav className="flex gap-4">
          <Link
            href="/about"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            소개
          </Link>
          <Link
            href="/privacy"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/terms"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            이용약관
          </Link>
        </nav>
      </div>
    </footer>
  );
}
