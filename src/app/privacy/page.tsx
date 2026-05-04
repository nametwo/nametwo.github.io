import SiteShell from '@/components/SiteShell';
import { SITE } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: `${SITE.name}의 개인정보처리방침`,
};

export default function Privacy() {
  return (
    <SiteShell>
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <h1>개인정보처리방침</h1>
        <p>
          본 사이트는 방문자의 개인정보를 직접 수집·저장하지 않습니다. 다만
          사이트 운영을 위해 다음의 외부 서비스를 사용하며, 각 서비스가
          자체적으로 일부 정보를 수집할 수 있습니다.
        </p>

        <h2>1. 수집하는 정보 및 목적</h2>
        <h3>Google Analytics</h3>
        <p>
          방문자 통계 분석을 위해 Google Analytics 4를 사용합니다. 쿠키를 통해
          다음 정보가 수집될 수 있습니다:
        </p>
        <ul>
          <li>IP 주소(익명화 처리됨)</li>
          <li>방문 페이지 및 체류 시간</li>
          <li>디바이스 종류, 운영체제, 브라우저</li>
          <li>접속 국가/지역</li>
        </ul>
        <p>
          자세한 내용은{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 개인정보처리방침
          </a>
          을 참조해주세요. Google Analytics 추적을 차단하려면{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google에서 제공하는 차단 도구
          </a>
          를 사용할 수 있습니다.
        </p>

        <h3>Giscus 댓글 시스템</h3>
        <p>
          댓글 기능은 GitHub Discussions 기반의 Giscus를 사용합니다. 댓글 작성
          시 GitHub 계정 정보(이름, 프로필 이미지, 댓글 내용)가 GitHub에
          저장되며, 본 사이트는 이를 별도로 저장하지 않습니다. GitHub의 정책에
          따라 처리됩니다.
        </p>

        <h2>2. 직접 수집하는 정보</h2>
        <p>
          본 사이트는 회원가입, 로그인, 결제 기능을 제공하지 않으며 방문자의
          개인정보를 직접 수집·저장하지 않습니다.
        </p>

        <h2>3. 쿠키 사용</h2>
        <p>
          위에 언급된 외부 서비스(Google Analytics, Giscus)가 자체 쿠키를
          사용합니다. 또한 사이트는 다크모드 설정 등 사용자 환경 설정을
          저장하기 위해 브라우저의 localStorage를 사용합니다 (외부 서버로
          전송되지 않음).
        </p>

        <h2>4. 개인정보 처리 변경 안내</h2>
        <p>
          본 처리방침은 사이트의 기능 변경에 따라 업데이트될 수 있으며, 중요한
          변경사항은 본 페이지를 통해 안내됩니다.
        </p>

        <h2>5. 문의</h2>
        <p>
          개인정보 처리 관련 문의는{' '}
          <strong>{SITE.operator.emailMasked}</strong>로 연락 부탁드립니다.
        </p>

        <hr />
        <p className="text-sm text-zinc-500">시행일: {SITE.launchDate}</p>
      </article>
    </SiteShell>
  );
}
