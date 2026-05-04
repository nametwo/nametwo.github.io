// 시리즈 슬러그 → 표시 이름 매핑.
// frontmatter의 series는 영문 슬러그(URL용), 화면에는 여기 매핑된 한글 이름이 표시됨.
// 새 시리즈 추가 시 한 줄씩 추가.
export const SERIES_NAMES: Record<string, string> = {
  'nextjs-blog': '블로그 만들기',
};

export function getSeriesName(slug: string): string {
  return SERIES_NAMES[slug] ?? slug;
}
