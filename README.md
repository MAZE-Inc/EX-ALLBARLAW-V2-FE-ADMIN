# EX-ALLBARLAW-V2-FE-ADMIN

올바로(Allbarlaw) 관리자용 프론트엔드 애플리케이션

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | EX-ALLBARLAW-V2-FE-ADMIN |
| 설명 | 올바로 법률 서비스 관리자용 웹 프론트엔드 |
| 대상 사용자 | 시스템 관리자 |
| 기술 스택 | React 18, TypeScript, Vite, Ant Design |

---

## 주요 기능

### 회원/관리자 관리
- 관리자 계정 CRUD
- 일반 회원 관리
- 변호사 회원 관리 (승인/반려)

### 컨텐츠 관리
- 블로그 CRUD
- 영상 CRUD
- 법률지식 조회

### 게시판 관리
- 공지사항 CRUD
- FAQ CRUD
- 법률용어사전 CRUD

### 카테고리/광고 관리
- 법률 분야 카테고리 관리
- 배너 광고 관리
- 로펌/변호사 광고 관리

### 기타
- 바로톡 채팅 모니터링
- 서비스 이용 통계

---

## 기술 스택

### Core
- **React** 18.3.1 - UI 라이브러리
- **TypeScript** 5.7.2 - 타입 안정성
- **Vite** 6.2.0 - 빌드 도구

### UI 프레임워크
- **Ant Design** 5.26.2 - 관리자 UI 컴포넌트
- **@ant-design/icons** 6.0.0 - 아이콘

### 상태 관리
- **React Query** 5.81.5 - 서버 상태 관리

### 에디터
- **Toast UI Editor** 3.2.3 - Rich Text Editor
- **Quill** 2.0.0 - 대안 에디터

### 통신
- **Axios** 1.10.0 - HTTP 클라이언트

### 유틸리티
- **xlsx** 0.18.5 - 엑셀 파일 처리
- **dayjs** 1.11.13 - 날짜 처리

---

## 시작하기

### 사전 요구사항

- Node.js >= 18.0.0
- npm >= 9.0.0

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-org/EX-ALLBARLAW-V2-FE-ADMIN.git
cd EX-ALLBARLAW-V2-FE-ADMIN

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집
```

### 개발 서버 실행

```bash
npm run dev
# http://localhost:5174 에서 확인
```

### 빌드

```bash
npm run build
```

---

## 프로젝트 구조

```
src/
├── assets/          # 정적 리소스
├── components/      # Ant Design 기반 공통 컴포넌트
├── constants/       # 상수 정의
├── container/       # 컨테이너 컴포넌트
├── contexts/        # React Context
├── hooks/           # 커스텀 훅
├── lib/             # 라이브러리 설정
├── pages/           # 페이지 컴포넌트
│   ├── ad/          # 광고 관리
│   ├── admin/       # 관리자 관리
│   ├── board/       # 게시판 관리
│   ├── category/    # 카테고리 관리
│   ├── chat/        # 채팅 관리
│   ├── content/     # 컨텐츠 관리
│   ├── lawyer/      # 변호사 관리
│   ├── member/      # 회원 관리
│   └── statistics/  # 통계
├── routes/          # 라우팅 설정
├── services/        # API 서비스
├── styles/          # 글로벌 스타일
├── types/           # TypeScript 타입
└── utils/           # 유틸리티 함수
```

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 (포트: 5174) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 미리보기 |
| `npm run lint` | ESLint 실행 |
| `npm run prepare` | Husky Git 훅 설정 |

---

## 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_SERVER_API` | 백엔드 API URL | https://test.allbarlawbiz.com |
| `VITE_AI_SUMMARY_SERVER_API` | AI 서버 URL | https://ai.allbarlaw.com |

---

## 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `main` | 운영 배포 |
| `develop` | 개발 통합 |
| `feature/*` | 기능 개발 |
| `fix/*` | 버그 수정 |

---

## 커밋 컨벤션

```
<type>(<scope>): <subject>

# 예시
feat(admin): 관리자 목록 기능 추가
fix(lawyer): 변호사 승인 오류 수정
```

**Type**: feat, fix, docs, style, refactor, test, chore


## 관련 프로젝트

| 프로젝트 | 설명 |
|---------|------|
| EX-ALLBARLAW-V2-FE | 사용자용 프론트엔드 |
| EX-ALLBARLAW-V2-BE | 백엔드 API 서버 |

---

## 연락처

- 프로젝트 담당자: [담당자명]
- 이메일: [이메일 주소]

---

## 라이선스

이 프로젝트는 내부 사용을 위한 것이며, 별도의 라이선스 없이 외부 공개가 금지됩니다.

---

*최종 업데이트: 2024년 12월 24일*
