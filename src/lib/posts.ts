import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { getSeriesName } from './series';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export type PostKind = 'paper' | 'devlog';

export type BasePostMeta = {
  slug: string;
  kind: PostKind;
  title: string;
  date: string;
  tags: string[];
  summary: string;
};

export type PaperMeta = BasePostMeta & {
  kind: 'paper';
  field: string;
  venue: string;
  year: number;
};

export type DevlogMeta = BasePostMeta & {
  kind: 'devlog';
  series?: string;
};

export type PostMeta = PaperMeta | DevlogMeta;

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const fullPath = path.join(POSTS_DIR, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return { slug, ...data } as PostMeta;
  });
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getAllPapers(): PaperMeta[] {
  return getAllPosts().filter((p): p is PaperMeta => p.kind === 'paper');
}

export function getAllDevlogs(): DevlogMeta[] {
  return getAllPosts().filter((p): p is DevlogMeta => p.kind === 'devlog');
}

// URL용 슬러그 변환. "NLP" → "nlp", "Self-Supervised" → "self-supervised"
// 한글이면 그대로 유지 (브라우저가 알아서 인코딩함).
export function toSlug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-');
}

// 어떤 키별로 글이 몇 개씩 있는지 집계.
function countBy<T>(
  items: T[],
  getter: (item: T) => string | string[] | undefined
): { name: string; count: number; slug: string }[] {
  const counts = new Map<string, number>();
  for (const it of items) {
    const value = getter(it);
    if (value === undefined) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (!v) continue;
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count, slug: toSlug(name) }))
    .sort((a, b) => b.count - a.count); // 많은 순
}

// 사이드바에서 쓸 데이터를 한 번에 묶어서 반환.
// 분야/학회는 paper에만 의미 있고, 시리즈는 devlog에만 의미 있음.
// 태그는 둘 다 합산.
export function getSidebarData() {
  const papers = getAllPapers();
  const devlogs = getAllDevlogs();
  return {
    papers: papers.length,
    devlogs: devlogs.length,
    fields: countBy(papers, (p) => p.field),
    venues: countBy(papers, (p) => p.venue),
    // 시리즈는 frontmatter 값이 이미 영문 슬러그라 toSlug() 우회.
    // name은 매핑 테이블에서 한글 표시명으로 치환.
    series: countBy(devlogs, (d) => d.series).map((s) => ({
      slug: s.name,
      name: getSeriesName(s.name),
      count: s.count,
    })),
    tags: countBy<PostMeta>([...papers, ...devlogs], (p) => p.tags),
  };
}

// MDX 파일 본문에서 ## / ### 헤딩만 뽑아 TOC 데이터 생성.
// rehype-slug가 만드는 id 규칙(공백 → -, 소문자화)을 그대로 따라가야
// 클릭 시 정확히 그 섹션으로 점프함.
export type TocItem = {
  depth: 2 | 3; // ## = 2, ### = 3
  text: string;
  id: string;
};

export function getPostToc(slug: string): TocItem[] {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents); // frontmatter 제외한 본문만

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

    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2];
    const id = text.toLowerCase().trim().replace(/\s+/g, '-');

    items.push({ depth, text, id });
  }

  return items;
}
