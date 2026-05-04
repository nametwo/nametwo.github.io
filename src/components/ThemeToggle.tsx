'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

// <html>의 dark 클래스를 현재 theme에 맞게 동기화.
function applyTheme(theme: Theme) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

export default function ThemeToggle() {
  // SSR/정적 export 시점에는 localStorage를 모르므로 mount 전에는 null.
  // null이면 placeholder를 렌더해서 hydration mismatch 방지.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme | null) ?? 'system';
    setTheme(stored);
  }, []);

  // system 모드일 때만 OS 변경을 반영. light/dark 강제 모드는 무시.
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const choose = (next: Theme) => {
    localStorage.setItem('theme', next);
    setTheme(next);
    applyTheme(next);
  };

  // mount 전: 동일 크기의 빈 자리만 차지해서 레이아웃 안 흔들리게.
  if (theme === null) {
    return (
      <div
        suppressHydrationWarning
        className="inline-flex h-8 w-[6.5rem] rounded-md border border-zinc-200 dark:border-zinc-700"
      />
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="테마"
      className="inline-flex rounded-md border border-zinc-200 dark:border-zinc-700 p-0.5"
    >
      <Option label="라이트" active={theme === 'light'} onClick={() => choose('light')}>
        <SunIcon />
      </Option>
      <Option label="시스템" active={theme === 'system'} onClick={() => choose('system')}>
        <MonitorIcon />
      </Option>
      <Option label="다크" active={theme === 'dark'} onClick={() => choose('dark')}>
        <MoonIcon />
      </Option>
    </div>
  );
}

function Option({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-7 w-7 items-center justify-center rounded transition ${
        active
          ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100'
          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
      }`}
    >
      {children}
    </button>
  );
}

// === 인라인 SVG 아이콘 (외부 라이브러리 미사용) ===

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
