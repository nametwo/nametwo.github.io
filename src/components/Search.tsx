'use client';

import { useEffect, useRef, useState } from 'react';

// pagefind는 빌드 산출물이라 dev 모드에서는 없음.
// 타입 정의도 빌드 시점에만 존재하므로 최소한만 직접 정의.
type PagefindResult = {
  url: string;
  meta: { title: string };
  excerpt: string;
};

// pagefind 모듈의 핵심 API만 추린 좁은 인터페이스.
// search() 결과 안의 r.data()는 PagefindResult를 반환.
type Pagefind = {
  options: (opts: { excerptLength?: number }) => Promise<void>;
  search: (q: string) => Promise<{
    results: { data: () => Promise<PagefindResult> }[];
  }>;
};

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [open, setOpen] = useState(false);
  // 모바일에서만 의미 있음: 아이콘 → 펼친 검색바 토글.
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const pagefindRef = useRef<Pagefind | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // pagefind 모듈은 빌드 결과물 — webpack/turbopack이 번들에 포함하지 않도록
  // /* webpackIgnore: true */ 주석을 줘서 런타임에 브라우저가 직접 fetch하게 함.
  useEffect(() => {
    async function loadPagefind() {
      try {
        const pf = (await import(
          /* webpackIgnore: true */ '/pagefind/pagefind.js' as string
        )) as Pagefind;
        await pf.options({ excerptLength: 30 });
        pagefindRef.current = pf;
      } catch {
        // dev 모드: 인덱스 없음. 빌드 후에만 동작.
        if (process.env.NODE_ENV === 'development') {
          console.info('Pagefind: dev 모드라 검색 비활성화 (build 필요)');
        }
      }
    }
    loadPagefind();
  }, []);

  // 검색 실행 (200ms 디바운싱)
  useEffect(() => {
    if (!query.trim() || !pagefindRef.current) {
      setResults([]);
      return;
    }
    const pf = pagefindRef.current;
    const timer = setTimeout(async () => {
      const search = await pf.search(query);
      const data = await Promise.all(
        search.results.slice(0, 8).map((r) => r.data())
      );
      setResults(data);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Cmd/Ctrl+K로 포커스, ESC로 닫기.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setMobileExpanded(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 외부 클릭 시 드롭다운/모바일 패널 닫기.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setMobileExpanded(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // 모바일 검색 버튼 클릭 시 입력에 포커스.
  const openMobile = () => {
    setMobileExpanded(true);
    setOpen(true);
    // 다음 tick에 포커스 (input이 이제 막 렌더되므로)
    setTimeout(() => mobileInputRef.current?.focus(), 0);
  };

  const renderResults = (onItemClick: () => void) => {
    if (results.length === 0) {
      return <div className="p-4 text-sm text-zinc-500">결과 없음</div>;
    }
    return (
      <ul>
        {results.map((r) => (
          <li
            key={r.url}
            className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
          >
            <a
              href={r.url}
              className="block p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={onItemClick}
            >
              <div className="text-sm font-medium">{r.meta.title}</div>
              <div
                className="mt-1 text-xs text-zinc-500 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* 모바일: 아이콘 버튼만 (sm 미만) */}
      <button
        type="button"
        onClick={openMobile}
        aria-label="검색 열기"
        className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <SearchIcon />
      </button>

      {/* 데스크탑: 인라인 입력창 (sm 이상) */}
      <div className="hidden sm:flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 h-9 w-48 lg:w-64">
        <SearchIcon className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="검색..."
          aria-label="사이트 검색"
          className="flex-1 min-w-0 bg-transparent text-sm outline-none"
        />
        <kbd className="hidden lg:inline text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded px-1">
          ⌘K
        </kbd>
      </div>

      {/* 데스크탑 드롭다운 (인라인 입력 아래) */}
      {open && query && !mobileExpanded && (
        <div className="hidden sm:block absolute right-0 top-full mt-2 w-80 lg:w-96 max-h-96 overflow-y-auto rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-50">
          {renderResults(() => setOpen(false))}
        </div>
      )}

      {/* 모바일 풀폭 패널: 헤더 바로 아래 viewport 전체 폭으로 펼쳐짐.
          헤더(h-14, fixed) 아래로 깔리므로 top은 헤더 하단에 맞춤.
          right-0 + 음수 left로 viewport 전체에 가깝게 — calc로 정확히. */}
      {mobileExpanded && (
        <div className="sm:hidden fixed left-0 right-0 top-14 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
          <div className="flex items-center gap-2 px-4 py-3">
            <SearchIcon className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              ref={mobileInputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              placeholder="검색..."
              aria-label="사이트 검색"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setMobileExpanded(false);
                setOpen(false);
              }}
              aria-label="검색 닫기"
              className="text-xs text-zinc-500 px-2 py-1"
            >
              취소
            </button>
          </div>
          {query && (
            <div className="max-h-[60vh] overflow-y-auto border-t border-zinc-100 dark:border-zinc-800">
              {renderResults(() => {
                setMobileExpanded(false);
                setOpen(false);
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
