// 사이트 전역 상수. metadata, sitemap, JSON-LD 등에서 단일 소스로 참조.
export const SITE = {
  url: 'https://nametwo.github.io',
  name: '논문 리뷰',
  title: '논문 리뷰 | nametwo',
  description: 'AI/ML 논문을 깊이 있게 리뷰하고 정리합니다.',
  author: 'nametwo',
  ogImage: '/og-default.png',
  locale: 'ko_KR',
  verification: {
    google: 'G_QnIAlnbEoVyo9myFb3f8hBrQXcmCC2b45WJaKnris',
  },
} as const;
