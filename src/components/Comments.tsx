'use client';

import { useEffect, useRef } from 'react';
import { SITE } from '@/lib/site';

// giscus 테마는 사이트 다크모드와 동기화. light/dark 두 가지만 사용.
function getGiscusTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    const cfg = SITE.giscus;
    script.setAttribute('data-repo', cfg.repo);
    script.setAttribute('data-repo-id', cfg.repoId);
    script.setAttribute('data-category', cfg.category);
    script.setAttribute('data-category-id', cfg.categoryId);
    script.setAttribute('data-mapping', cfg.mapping);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', cfg.reactionsEnabled);
    script.setAttribute('data-emit-metadata', cfg.emitMetadata);
    script.setAttribute('data-input-position', cfg.inputPosition);
    script.setAttribute('data-theme', getGiscusTheme());
    script.setAttribute('data-lang', cfg.lang);
    script.setAttribute('data-loading', 'lazy');

    ref.current.appendChild(script);
  }, []);

  // 다크모드 토글 시 giscus 테마 동기화.
  // MutationObserver로 <html>의 class 변경을 감지 → iframe에 postMessage.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = getGiscusTheme();
      const iframe = document.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame'
      );
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme } } },
        'https://giscus.app'
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <h2 className="text-lg font-semibold mb-6">댓글</h2>
      <div ref={ref} />
    </section>
  );
}
