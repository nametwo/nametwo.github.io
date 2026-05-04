// 사이트 전역 상수. metadata, sitemap, JSON-LD 등에서 단일 소스로 참조.
export const SITE = {
  url: 'https://nametwo.github.io',
  name: 'nametwo.log',
  title: 'nametwo.log',
  description: '개발하면서 배운 것들과 읽은 논문을 정리하는 공간입니다.',
  author: 'nametwo',
  ogImage: '/og-default.png',
  locale: 'ko_KR',
  verification: {
    google: 'G_QnIAlnbEoVyo9myFb3f8hBrQXcmCC2b45WJaKnris',
  },
  github: 'https://github.com/nametwo',
  gaId: 'G-TRG7ZNYZ19',
  operator: {
    name: '이선용',
    // 봇 스팸 방지를 위해 마스킹된 형태로만 노출.
    emailMasked: 'dlt***@gmail.com',
  },
  launchDate: '2026-05-04',
  giscus: {
    repo: 'nametwo/nametwo.github.io',
    repoId: 'R_kgDOSOcYrQ',
    category: 'Announcements',
    categoryId: 'DIC_kwDOSOcYrc4C8Sli',
    mapping: 'pathname',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    lang: 'ko',
  },
} as const;
