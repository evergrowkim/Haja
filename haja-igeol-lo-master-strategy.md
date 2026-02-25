# "하자 이걸로" - AI 기반 하자관리 SaaS 마스터 개발 전략서 (Master Strategy)

**본 문서는 기존 Atrion 솔루션 분석과 DefectAI PRD v1.0을 결합하여, 차세대 하자관리 플랫폼 "하자 이걸로"의 성공적인 개발을 위한 모든 기술적, 비즈니스적 가이드를 제공합니다.**

---

## 1. 현행 솔루션(Atrion) 심층 분석 및 기술 부채 진단

### 1.1 워크플로우 분석 (As-Is)
- **상태 구조**: `예비접수 → 접수 → 처리 → 완료`의 4단계 단방향 구조.
- **모듈 분리**: 품검, 입사점, 입주 모듈이 데이터베이스 테이블은 공유하나 프론트엔드 코드와 스토어가 3벌로 중복 구현됨.
- **이미지 처리**: `TextField`에 콤마(`,`)로 구분된 URL 문자열 저장. 정규화되지 않아 사진별 관리가 어려움.
- **AI 활용**: OpenAI Assistant API를 사용하나, 2개 필드(공종, 유형)만 분류하며 신뢰도가 낮고 피드백 루프가 없음.

### 1.2 핵심 페인포인트 (Technical Debt)
1. **Monolithic Backend**: `restapi.py` (17,508줄)와 `tasks.py` (18,632줄)에 모든 로직이 집중되어 유지보수가 불가능한 수준.
2. **Code Duplication**: `asStore.js`, `qualitycStore.js`, `precStore.js` 등 거의 동일한 로직이 300% 중복됨.
3. **Data Integrity**: 날짜 필드와 상태 필드 간의 정합성 강제 로직이 부족하여 DB 데이터 오염 가능성 존재.
4. **UI/UX Rigid**: 20개 이상의 컬럼을 가진 가로 스크롤 테이블 위주의 UI로 현장 모바일 기기에서의 사용성이 매우 떨어짐.

---

## 2. "하자 이걸로" 혁신 워크플로우 및 UI/UX 전략

### 2.1 최적의 워크플로우 (Proposed Flow)
- **7단계 유한 상태 머신 (FSM)**:
    `PENDING(접수대기) → RECEIVED(접수완료) → ASSIGNED(배정완료) → IN_PROGRESS(처리중) → COMPLETED(처리완료) → VERIFIED(검수완료) → CLOSED(종결)`
- **반려(REJECTED) 프로세스**: 검수 실패 시 사유를 기록하고 `ASSIGNED` 상태로 즉시 회귀하여 이력을 남김.
- **자동화**: AI 분류 성공 시 즉시 `RECEIVED`로 전이, 공종 매칭을 통한 시공사 자동 배정.

### 2.2 UI/UX 개선안
1. **통합 관리 페이지**: 3개 모듈을 하나로 통합하고 탭(Tab) 필터로 전환하여 코드 중복 0% 달성.
2. **모바일 퍼스트 등록 위저드**: 
    - [📍위치] → [📷사진/AI] → [✅확인]의 3단계 설계.
    - 사진 촬영 즉시 백그라운드 AI 분석 시작.
3. **하이브리드 뷰**: 사무실용 '테이블 뷰'와 현장용 '카드/맵 뷰' 실시간 전환.
4. **인터랙티브 대시보드**: KPI 카드, 주간 추이, 시공사 랭킹 등을 한 화면에서 실시간 모니터링.

---

## 3. 기술 아키텍처 설계

### 3.1 기술 스택 (Tech Stack)
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query v5.
- **Backend**: FastAPI (Python 3.11), SQLAlchemy 2.0 (Repository Pattern), Pydantic v2.
- **Async & Storage**: Celery + Redis, PostgreSQL 16, Qdrant (Vector DB), MinIO (S3).
- **AI/ML**: Claude 3.5 Sonnet (Vision), OpenAI text-embedding-3-small, LangChain.

### 3.2 시스템 구성도
```
Client (Next.js) <-> API Gateway (Nginx) <-> Backend (FastAPI)
                                                |
        ┌───────────────┬───────────────────────┼───────────────┐
        ▼               ▼                       ▼               ▼
   PostgreSQL        Qdrant                  Redis           MinIO
 (RDBMS/Auth)     (Vector/RAG)           (Cache/Tasks)    (Image/PDF)
```

---

## 4. 데이터 모델 상세 설계

### 4.1 핵심 엔티티 (Normalized)
- **Defect**: 하자 핵심 정보 (상태, 위치, 분류).
- **DefectImage**: 정규화된 이미지 테이블 (Before/After/Confirm 구분, AI 메타데이터 저장).
- **DefectHistory**: 상태 변경 및 작업 이력의 완전한 감사 로그(Audit Log).
- **Contractor**: 시공사 및 담당 공종 정보.
- **AI_Classification**: AI가 분석한 원본 데이터 및 신뢰도, 피드백 기록.

---

## 5. AI 및 RAG 상세 설계

### 5.1 Vision AI (하자 분류)
- **모델**: Claude 3.5 Sonnet (Primary), GPT-4o (Fallback).
- **분류 체계**: 공종, 하자유형, 심각도(1~4단계), 분석 근거(Reasoning).
- **최적화**: 이미지 썸네일 생성 후 멀티 모달 입력, 프롬프트 버전 관리를 통한 정확도 85% 달성.

### 5.2 RAG (유사 사례 검색)
- **Hybrid Search**: Dense(임베딩 유사도) + Sparse(BM25 키워드) 결합.
- **Knowledge Base**: 과거 하자 데이터 + 시공 시방서 + 법규 문서를 벡터화.
- **AI Answer**: 검색된 Top 5 사례를 기반으로 AI가 보수 방법 요약 답변 생성.

---

## 6. MVP 개발 로드맵 (10주)

### Phase 1: Foundation (1~4주)
- **1-2주**: 인프라 셋업, 정규화 DB 설계, JWT 인증 시스템.
- **3-4주**: 하자 CRUD, Vision AI 연동, 모바일 퍼스트 등록 UI.

### Phase 2: Search & Intelligence (5~7주)
- **5-6주**: Qdrant 연동, 데이터 인덱싱 파이프라인, 하이브리드 검색 API.
- **7주**: RAG 요약 답변 및 유사 사례 추천 UI.

### Phase 3: Workflow & Business (8~10주)
- **8-9주**: FSM 상태 관리, 자동 배정 로직, 실시간 통합 대시보드.
- **10주**: 데이터 마이그레이션(Atrion → 신규), QA 및 배포.

---

## 7. 성공 지표 및 전략
- **생산성**: 하자 등록 및 분류 시간 90% 단축 (5분 → 30초).
- **품질**: 300% 중복 코드 제거로 버그 발생률 70% 감소.
- **확장성**: SaaS 구조 채택으로 단지별 독립적/통합적 관리 지원.

---
**작성일**: 2024-01-31
**문서 위치**: /Users/youngtaekim/Downloads/Atrion/haja-igeol-lo-master-strategy.md
