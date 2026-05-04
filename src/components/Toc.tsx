'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TocItem } from '@/lib/posts';

// 스크롤 위치보다 이만큼 위의 헤딩을 active로 본다.
// 헤더/여백을 고려한 시각적 "현재 읽는 줄" 기준점.
const OFFSET = 120;

// 오른쪽 따라다니는 목차. 절대 좌표 캐시 + scroll 리스너 방식.
export default function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  // 헤딩의 절대 top 좌표 캐시. id → top.
  // resize/이미지 로드 등으로 변할 수 있어 갱신 가능하게 ref로 들고 있음.
  const positionsRef = useRef<{ id: string; top: number }[]>([]);

  const measure = useCallback(() => {
    const next: { id: string; top: number }[] = [];
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (!el) continue;
      // getBoundingClientRect().top은 뷰포트 기준이므로 scrollY 더해서 문서 절대 좌표로.
      next.push({ id, top: el.getBoundingClientRect().top + window.scrollY });
    }
    positionsRef.current = next;
  }, [items]);

  const updateActive = useCallback(() => {
    const positions = positionsRef.current;
    if (positions.length === 0) return;

    const threshold = window.scrollY + OFFSET;
    // threshold보다 위에 있는 헤딩 중 가장 아래쪽(=가장 최근에 지나친 것).
    let current = positions[0].id;
    for (const p of positions) {
      if (p.top <= threshold) current = p.id;
      else break;
    }
    setActiveId((prev) => (prev === current ? prev : current));
  }, []);

  useEffect(() => {
    measure();
    updateActive();

    const onScroll = () => updateActive();
    const onResize = () => {
      measure();
      updateActive();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [measure, updateActive]);

  // 클릭 시 즉시 하이라이트. 브라우저 스크롤이 끝나기 전에도 반영되어야 함.
  const handleClick = (id: string) => setActiveId(id);

  if (items.length === 0) return null;

  return (
    <div className="sticky top-20">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        On this page
      </h2>
      <nav className="border-l border-zinc-200 dark:border-zinc-700">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => handleClick(item.id)}
            className={`block -ml-px border-l py-1.5 text-sm transition ${
              // ### (depth 3)은 한 단계 더 들여쓰기
              item.depth === 3 ? 'pl-8' : 'pl-4'
            } ${
              activeId === item.id
                ? 'border-blue-600 font-semibold text-blue-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
