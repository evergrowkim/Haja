# "하자 이걸로" - AI 기반 하자관리 SaaS 초정밀 설계 도면 (Blueprint)

본 문서는 Atrion 시스템의 기술적 부채를 청산하고, PRD v1.0의 요구사항을 완벽하게 구현하기 위한 상세 기술 명세서입니다.

---

## 1. 데이터 모델 설계 (정규화 및 고도화)

Atrion의 `TextField` 콤마 구분 방식을 폐기하고, 확장 가능한 관계형 구조를 채택합니다.

### 1.1 주요 테이블 스키마 (SQLAlchemy 스타일)

```python
# 하자(Defect) 핵심 테이블
class Defect(Base):
    id = Column(UUID, primary_key=True)
    receipt_number = Column(String(50), unique=True, index=True) # YYMMDD-seq
    project_id = Column(UUID, ForeignKey("projects.id"))
    phase = Column(Enum("품검", "입사점", "입주"))
    
    # 위치 정보 (정규화)
    building = Column(String(10), index=True) # 동
    unit = Column(String(10), index=True)     # 호
    location_detail = Column(String(50))      # 거실, 침실1 등
    
    # 분류 정보 (AI와 사용자 입력 구분)
    work_type = Column(String(50))           # 공종
    defect_type = Column(String(50))         # 유형
    severity = Column(Enum("LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4"))
    description = Column(Text)
    
    # 상태 관리 (FSM)
    status = Column(Enum("PENDING", "RECEIVED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "REJECTED", "VERIFIED", "CLOSED"))
    
    # 배정 정보
    contractor_id = Column(UUID, ForeignKey("contractors.id"), nullable=True)
    assigned_at = Column(DateTime, nullable=True)
    
    # 타임스탬프
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

# 이미지 관리 테이블 (Atrion의 TextField 방식 개선)
class DefectImage(Base):
    id = Column(UUID, primary_key=True)
    defect_id = Column(UUID, ForeignKey("defects.id", ondelete="CASCADE"))
    image_url = Column(String(500))
    image_type = Column(Enum("BEFORE", "AFTER", "CONFIRM")) # 작업전, 작업후, 확인서
    ai_metadata = Column(JSONB) # AI가 분석한 객체 위치, 라벨 등
    created_at = Column(DateTime, default=func.now())

# 상태 변경 이력 (Audit Log)
class DefectHistory(Base):
    id = Column(UUID, primary_key=True)
    defect_id = Column(UUID, ForeignKey("defects.id"))
    from_status = Column(String(20))
    to_status = Column(String(20))
    changed_by = Column(UUID, ForeignKey("users.id"))
    note = Column(Text)
    created_at = Column(DateTime, default=func.now())
```

---

## 2. 워크플로우 엔진 (상태 머신) 설계

Atrion의 500줄짜리 `EditDefect` 함수를 대체할 상태 전이 로직입니다.

### 2.1 상태 전이 핸들러 패턴 (FastAPI/Python)

```python
class DefectStateMachine:
    def __init__(self, defect: Defect):
        self.defect = defect

    def transition_to(self, next_status: str, user: User, note: str = ""):
        # 1. 전이 가능 여부 체크
        if not self._is_valid_transition(self.defect.status, next_status):
            raise InvalidStatusTransitionException()
            
        # 2. 전이 전 후처리 (Hooks)
        if next_status == "RECEIVED":
            self._handle_reception()
        elif next_status == "ASSIGNED":
            self._handle_assignment()
            
        # 3. 상태 변경 및 이력 기록
        old_status = self.defect.status
        self.defect.status = next_status
        db.add(DefectHistory(defect_id=self.defect.id, from_status=old_status, to_status=next_status, changed_by=user.id, note=note))
```

---

## 3. AI 및 RAG 시스템 상세 설계

### 3.1 Vision AI 프롬프트 전략 (Claude 3.5 Sonnet)
이미지 내의 '화살표 스티커' 인식 기능을 강화한 프롬프트입니다.

```text
"당신은 건설 현장 품질 관리 전문가입니다. 
제공된 사진에서 화살표 스티커가 가리키는 하자를 분석하세요.
1. 공종: [도배, 타일, 도장, 가구, 창호, 기타] 중 선택
2. 유형: [오염, 파손, 들뜸, 균열, 기능불량] 중 선택
3. 심각도: 사진상 손상 규모에 따라 1~4단계 지정
결과는 반드시 JSON 형식으로만 응답하세요."
```

### 3.2 RAG 하이브리드 검색 아키텍처
1. **Dense Search**: OpenAI `text-embedding-3-small`을 사용하여 의미적 유사도 검색 (Qdrant)
2. **Sparse Search**: BM25 알고리즘을 사용하여 '발코니', '도배지' 등 핵심 키워드 매칭
3. **Reranking**: 두 결과를 합친 후 AI가 질문과 가장 관련 있는 TOP 3 사례를 최종 선별

---

## 4. UI/UX 개선 상세 (Next.js + Tailwind)

### 4.1 "통합 하자 목록" (Atrion의 3개 중복 페이지 통합)
- **Problem**: 품검, 사전점검, AS 페이지가 각각 1500줄씩 복제되어 있음.
- **Solution**: `DefectList` 공통 컴포넌트 제작. `phase` prop에 따라 필터링 및 컬럼 구성을 동적으로 변경.

### 4.2 "모바일 퍼스트 하자 등록"
- 카메라 API 연동: 사진 촬영 즉시 백그라운드에서 AI 분류 시작 (Celery).
- 사용자가 동/호를 선택하는 동안 AI는 이미 분류 결과를 도출하여 '추천' 항목으로 제시.

---

## 5. 10주 MVP 상세 개발 로드맵

### [Sprint 1] 1-2주: 인프라 및 기반 구축
- **BE**: FastAPI 서버 셋업, PostgreSQL 정규화 스키마 구현, JWT 인증.
- **FE**: Next.js App Router 기반 프로젝트 초기화, 공통 모달 및 폼 컴포넌트 제작.

### [Sprint 2] 3-4주: AI 분류 및 하자 등록
- **AI**: Claude Vision API 연동, 이미지 처리 워커(Celery) 구축.
- **FE**: 3단계 하자 등록 위저드 개발, AI 분류 결과 실시간 표시(WebSocket).

### [Sprint 3] 5-7주: RAG 검색 및 지식 베이스
- **Data**: 기존 Atrion 데이터(2만 건) 임베딩 및 Qdrant 인덱싱.
- **BE**: 하이브리드 검색 API 개발, AI 요약 답변 기능 구현.
- **FE**: 검색 대시보드 및 유사 사례 추천 패널 개발.

### [Sprint 4] 8-9주: 워크플로우 자동화 및 대시보드
- **BE**: 시공사 자동 배정 로직, 이메일/알림 알림톡 연동.
- **FE**: 통합 대시보드 (Chart.js), 시공사 전용 모바일 웹 화면.

### [Sprint 5] 10주: 검수 및 배포
- **QA**: E2E 테스트(Playwright), 부하 테스트.
- **DevOps**: Docker 배포 파이프라인 완성, 데이터 최종 이관.

---

## 6. Atrion 데이터 이관(Migration) 전략

기존 데이터의 페인포인트를 해결하며 마이그레이션합니다.
- `before_photo` 문자열 → `DefectImage` 테이블 레코드로 분리
- `recept_phase` 필드 → 정규화된 `phase` Enum으로 변환
- 중복된 `middle_work` 데이터 클렌징 작업 병행

---
**문서 보관**: /Users/youngtaekim/Downloads/Atrion/defect-management-ai-detailed-blueprint.md
