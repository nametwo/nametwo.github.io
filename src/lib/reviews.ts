import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const REVIEWS_DIR = path.join(process.cwd(), 'content/reviews');

export type ReviewMeta = {
  slug: string;
  title: string;
  date: string;
  field: string;
  venue: string;
  year: number;
  tags: string[];
  summary: string;
};

export function getAllReviews(): ReviewMeta[] {
  const files = fs.readdirSync(REVIEWS_DIR).filter((f) => f.endsWith('.mdx'));
  const reviews = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const fullPath = path.join(REVIEWS_DIR, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return { slug, ...data } as ReviewMeta;
  });
  return reviews.sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllReviewSlugs(): string[] {
  return fs
    .readdirSync(REVIEWS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

// === 여기서부터 새로 추가 ===

// URL용 슬러그 변환. "NLP" → "nlp", "Self-Supervised" → "self-supervised"
// 한글이면 그대로 유지 (브라우저가 알아서 인코딩함).
export function toSlug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-');
}

// 어떤 키(field, venue, tag)별로 글이 몇 개씩 있는지 집계.
// 예: countBy('field') → { 'NLP': 2, 'Vision': 1 }
function countBy(
  reviews: ReviewMeta[],
  getter: (r: ReviewMeta) => string | string[]
): { name: string; count: number; slug: string }[] {
  const counts = new Map<string, number>();
  for (const r of reviews) {
    const value = getter(r);
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count, slug: toSlug(name) }))
    .sort((a, b) => b.count - a.count);  // 많은 순
}

// 사이드바에서 쓸 데이터를 한 번에 묶어서 반환.
export function getSidebarData() {
  const reviews = getAllReviews();
  return {
    total: reviews.length,
    fields: countBy(reviews, (r) => r.field),
    venues: countBy(reviews, (r) => r.venue),
    tags: countBy(reviews, (r) => r.tags),
  };
}

// MDX 파일 본문에서 ## / ### 헤딩만 뽑아 TOC 데이터 생성.
// rehype-slug가 만드는 id 규칙(공백 → -, 소문자화)을 그대로 따라가야
// 클릭 시 정확히 그 섹션으로 점프함.
export type TocItem = {
  depth: 2 | 3;       // ## = 2, ### = 3
  text: string;
  id: string;
};

export function getReviewToc(slug: string): TocItem[] {
  const fullPath = path.join(REVIEWS_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);   // frontmatter 제외한 본문만

  const items: TocItem[] = [];

  // 코드 블록 안의 #는 제외해야 해서 한 줄씩 보면서 코드 블록 토글.
  const lines = content.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // ## 또는 ### 로 시작하는 라인 매칭
    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2];
    // rehype-slug 규칙: 공백을 -로, 소문자화. (한글은 그대로 유지됨)
    const id = text.toLowerCase().trim().replace(/\s+/g, '-');

    items.push({ depth, text, id });
  }

  return items;
}