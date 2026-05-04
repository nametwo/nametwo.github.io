import Script from 'next/script';
import { SITE } from '@/lib/site';

// next/script의 afterInteractive 전략으로 GA를 비동기 로드.
// dev에서는 데이터 오염 방지를 위해 아예 렌더하지 않음.
export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null;

  const id = SITE.gaId;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
