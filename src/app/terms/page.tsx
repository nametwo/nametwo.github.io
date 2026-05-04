import SiteShell from '@/components/SiteShell';
import { SITE } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
  description: `${SITE.name} 이용약관`,
};

export default function Terms() {
  return (
    <SiteShell>
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <h1>이용약관</h1>
        <p>
          본 약관은 {SITE.name} 사이트 이용에 관한 기본적인 사항을 정합니다.
        </p>

        <h2>1. 콘텐츠의 성격</h2>
        <p>
          본 사이트의 글은 운영자가 학습 및 정리 목적으로 작성한 개인적인
          리뷰입니다. 학술적 정확성을 위해 노력하지만, 오류나 누락이 있을 수
          있으며, 공식적인 학술 자료를 대체하지 않습니다. 중요한 의사결정에
          사용하기 전 반드시 원 논문 및 공식 출처를 직접 확인해주세요.
        </p>

        <h2>2. 저작권</h2>
        <p>
          본 사이트의 글(리뷰 본문)은 운영자에게 저작권이 있으며, 별도의
          표시가 없는 한 다음과 같이 사용 가능합니다:
        </p>
        <ul>
          <li>출처를 명시할 경우 비상업적 목적으로 자유롭게 인용 가능</li>
          <li>전문을 무단으로 복제하여 다른 사이트에 게시하는 것은 금지</li>
        </ul>
        <p>
          글에 인용된 논문, 그림, 표 등의 원저작물은 원 저작권자에게
          귀속되며, 본 사이트는 비평·교육 목적의 공정 이용 범위 내에서
          인용합니다.
        </p>

        <h2>3. 댓글 및 사용자 콘텐츠</h2>
        <p>
          댓글은 Giscus를 통해 GitHub Discussions에 저장됩니다. 작성된 댓글의
          책임은 작성자 본인에게 있으며, 운영자는 다음에 해당하는 댓글을 사전
          통보 없이 삭제할 수 있습니다:
        </p>
        <ul>
          <li>스팸, 광고, 도배성 글</li>
          <li>욕설, 비방, 차별적 표현</li>
          <li>저작권을 침해하는 내용</li>
          <li>관련성 없는 내용</li>
        </ul>

        <h2>4. 외부 링크</h2>
        <p>
          본 사이트는 논문 원문, 관련 자료 등 외부 사이트로의 링크를
          포함합니다. 외부 사이트의 콘텐츠 및 정책에 대해서는 본 사이트가
          책임지지 않습니다.
        </p>

        <h2>5. 면책</h2>
        <p>
          본 사이트의 콘텐츠를 활용하여 발생한 어떠한 직간접적 손해에
          대해서도 운영자는 법적 책임을 지지 않습니다.
        </p>

        <h2>6. 약관 변경</h2>
        <p>
          본 약관은 사정에 따라 변경될 수 있으며, 중요한 변경사항은 본
          페이지를 통해 안내합니다.
        </p>

        <hr />
        <p className="text-sm text-zinc-500">시행일: {SITE.launchDate}</p>
      </article>
    </SiteShell>
  );
}
