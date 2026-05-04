import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // next build 시 out/ 디렉토리에 정적 파일 생성
  images: {
    unoptimized: true,       // GitHub Pages는 이미지 최적화 서버가 없음
  },
  trailingSlash: true,       // /about → /about/index.html 로 생성 (Pages 호환성↑)
};

export default nextConfig;
