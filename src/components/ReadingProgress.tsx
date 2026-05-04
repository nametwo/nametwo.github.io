'use client';

import { useEffect, useState } from 'react';

// 페이지 상단의 가로 읽기 진행 바.
// 리뷰 상세에서만 마운트되도록 사용처에서 제어.
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      // 스크롤 가능한 총 길이. 0 이하인 페이지(짧은 글)에서 NaN 방지용 분기.
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) {
        setProgress(0);
        return;
      }
      const ratio = window.scrollY / max;
      // clamp 0~1
      const clamped = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
      setProgress(clamped * 100);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-blue-600 transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
