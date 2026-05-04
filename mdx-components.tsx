import type { MDXComponents } from 'mdx/types';

// MDX 안에서 쓰이는 마크다운 요소(<h1>, <p> 등)를 React 컴포넌트로 매핑.
// 비워두면 기본 HTML 태그가 그대로 쓰여요. 나중에 커스터마이징할 자리.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}