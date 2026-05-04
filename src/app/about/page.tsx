import SiteShell from '@/components/SiteShell';
import { SITE } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개',
  description: `${SITE.name} 운영자 소개`,
};

export default function About() {
  return (
    <SiteShell>
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <h1>소개</h1>
        <p>
          안녕하세요, <strong>{SITE.operator.name}</strong>입니다.
        </p>
        <p>
          이 사이트는 AI/ML 분야 논문을 읽고 정리하는 공간입니다. 주로 NLP,
          Vision, 그리고 최신 트렌드를 다룹니다.
        </p>

        <h2>운영자</h2>
        <ul>
          <li>이름: {SITE.operator.name}</li>
          <li>
            GitHub:{' '}
            <a href={SITE.github} target="_blank" rel="noopener noreferrer">
              {SITE.github.replace('https://', '')}
            </a>
          </li>
          <li>이메일: {SITE.operator.emailMasked}</li>
        </ul>

        <h2>왜 이 블로그를 운영하나요?</h2>
        <p>
          좋은 논문을 읽고 정리하는 것은 그 자체로 학습이 됩니다. 또한 비슷한
          주제에 관심 있는 분들에게 도움이 되었으면 합니다.
        </p>

        <h2>피드백 / 제보</h2>
        <p>
          글에 오류가 있거나 다루었으면 하는 논문이 있다면 각 글의 댓글 또는 위
          이메일로 알려주세요.
        </p>
      </article>
    </SiteShell>
  );
}
