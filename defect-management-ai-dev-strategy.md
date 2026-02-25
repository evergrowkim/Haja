# "하자 이걸로" - AI 기반 하자관리 SaaS 개발 전략서

## 1. 프로젝트 개요
**"하자 이걸로"**는 공동주택 하자관리 프로세스의 페인포인트를 AI(Vision AI, RAG)로 해결하는 차세대 SaaS 플랫폼입니다. 기존 Atrion 시스템의 아키텍처적 한계를 극복하고, 사용자 경험을 혁신하는 것을 목표로 합니다.

---

## 2. 아키텍처 설계

### 2.1 기술 스택
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query v5, Zustand
- **Backend**: FastAPI (Python 3.11), SQLAlchemy 2.0, Pydantic v2, Celery + Redis
- **AI/ML**: Claude 3.5 Sonnet (Vision), GPT-4V (Fallback), OpenAI Embedding (ada-002), LangChain
- **Database**: PostgreSQL 16 (Primary), Qdrant (Vector DB), Redis 7 (Cache/Broker)
- **Infra**: Docker, Nginx/Traefik, MinIO (S3 Compatible Storage)

### 2.2 핵심 개선 원칙 (Atrion 분석 기반)
1. **모듈화**: 대형 Monolith(`restapi.py`) 탈피, 도메인별 API 라우터 및 서비스 레이어 분리
2. **코드 중복 제거**: 3개 모듈(품검/입사점/입주)의 중복 코드를 단일 컴포넌트와 Phase 필드로 통합
3. **데이터 정규화**: 콤마 구분 URL 필드 대신 별도의 `DefectImage` 테이블 사용
4. **상태 머신 (FSM)**: 복잡한 조건문 대신 명확한 상태 전이 규칙과 이력 관리 적용
5. **RESTful 설계**: 표준 HTTP Method(GET, POST, PATCH, DELETE) 및 리소스 경로 준수

---

## 3. 워크플로우 재설계

### 3.1 하자 처리 상태 (7단계)
1. **PENDING (접수대기)**: 초기 등록 상태
2. **RECEIVED (접수완료)**: AI 분류 및 담당자 확인 완료
3. **ASSIGNED (배정완료)**: 시공사 자동/수동 배정 완료
4. **IN_PROGRESS (처리중)**: 시공사 작업 착수
5. **COMPLETED (처리완료)**: 보수 및 사진 업로드 완료
6. **VERIFIED (검수완료)**: 관리자/입주민 검수 통과
7. **CLOSED (종결)**: 모든 프로세스 종료

### 3.2 AI 통합 워크플로우
- **자동 분류**: 사진 업로드 시 Claude Vision API가 공종/유형/심각도를 5초 내 분석
- **스마트 배정**: AI 분류 결과를 기반으로 담당 시공사를 자동 매칭
- **유사 사례 추천**: RAG 시스템이 과거 23,000건 이상의 사례 중 가장 유사한 5건을 즉시 추천

---

## 4. UI/UX 혁신

### 4.1 주요 기능
- **통합 관리 대시보드**: 실시간 KPI 카드, 주간 추이, 시공사 성과 지표 제공
- **스텝 위저드 등록**: [위치 선택] → [사진 촬영] → [AI 확인] 3단계의 직관적 UX
- **하이브리드 뷰**: 대량 관리용 테이블 뷰와 모바일용 카드 뷰 전환 지원
- **RAG 검색 창**: 자연어 질문("발코니 도장 박리 보수 방법?")에 AI 요약 답변 및 관련 사례 제시

---

## 5. MVP 개발 로드맵 (10주)

### 5.1 Phase 1: Foundation (Week 1-4)
- 인프라 구축 및 인증 시스템 구현
- 하자 CRUD API 및 파일 스토리지 연동
- **Vision AI 분류** 기능 (Claude 3.5 Sonnet) 통합
- 기본 관리 UI (목록/등록/상세) 개발

### 5.2 Phase 2: RAG & Search (Week 5-7)
- Qdrant 벡터 DB 구축 및 임베딩 파이프라인
- **하이브리드 검색** (Dense + Sparse) 구현
- AI 요약 답변 및 유사 사례 추천 시스템 완성

### 5.3 Phase 3: Workflow & Dashboard (Week 8-10)
- 시공사 자동 배정 로직 및 알림 시스템
- Before/After 사진 비교 및 검수 워크플로우
- 실시간 통계 대시보드 및 리포팅 기능

---

## 6. 성공 지표 (KPI)
- **하자 분류 시간**: 5분 → 30초 (90% 단축)
- **분류 정확도**: 85% 이상 (Claude 3.5 기반)
- **배정 시간**: 2시간 → 5분 이내
- **코드 중복도**: 0% (통합 아키텍처 적용)

---
**작성일**: 2024-01-31
**상태**: 개발 준비 완료
