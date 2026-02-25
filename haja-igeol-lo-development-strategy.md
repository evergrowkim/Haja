# "하자 이걸로" - PHP/Laravel 기반 AI 하자관리 SaaS 개발 전략서

**문서 버전**: v3.0 (PHP/Laravel Edition)
**작성일**: 2026-01-31
**프로젝트 코드명**: 하자 이걸로 (DefectAI)
**설계 방침**: 기존 Atrion 알고리즘 미참고, 완전 신규 설계

---

## 목차

1. [프로젝트 비전](#1-프로젝트-비전)
2. [왜 PHP/Laravel인가](#2-왜-phplaravel인가)
3. [기술 스택](#3-기술-스택)
4. [시스템 아키텍처](#4-시스템-아키텍처)
5. [데이터 모델 설계](#5-데이터-모델-설계)
6. [워크플로우 엔진 (FSM)](#6-워크플로우-엔진-fsm)
7. [AI 시스템 설계](#7-ai-시스템-설계)
8. [RAG 검색 시스템](#8-rag-검색-시스템)
9. [API 설계](#9-api-설계)
10. [프론트엔드 아키텍처](#10-프론트엔드-아키텍처)
11. [백엔드 아키텍처](#11-백엔드-아키텍처)
12. [실시간 시스템](#12-실시간-시스템)
13. [UI/UX 전략](#13-uiux-전략)
14. [인프라 및 배포](#14-인프라-및-배포)
15. [테스트 전략](#15-테스트-전략)
16. [10주 스프린트 계획](#16-10주-스프린트-계획)
17. [디렉토리 구조](#17-디렉토리-구조)
18. [성공 지표 (KPI)](#18-성공-지표-kpi)
19. [리스크 관리](#19-리스크-관리)

---

## 1. 프로젝트 비전

"하자 이걸로"는 공동주택 하자관리의 세 가지 핵심 문제를 AI로 해결합니다.

```
문제 1: 수작업 분류          →  Vision AI가 사진 한 장으로 공종/유형/심각도를 30초 내 자동 분류
문제 2: 지식 단절             →  RAG 시스템이 23,000건 과거 사례에서 유사 사례를 3초 내 추천
문제 3: 비효율적 배정/추적    →  스마트 배정 + 7단계 FSM으로 전체 프로세스 자동화
```

**설계 원칙**: 기존 Atrion의 코드와 알고리즘은 일체 참고하지 않습니다. Laravel 생태계의 강점을 최대한 활용하여, 처음부터 현대적인 SaaS로 설계합니다.

---

## 2. 왜 PHP/Laravel인가

### 2.1 이 프로젝트에 Laravel이 적합한 이유

| 요구사항 | Laravel 대응 | 적합도 |
|---------|-------------|-------|
| AI API 통합 (Claude, OpenAI) | **Prism PHP** - Laravel 공식 LLM 통합 패키지 | ★★★★★ |
| 비동기 AI 처리 | **Laravel Queue** + Redis - 잡 체이닝, 배치, 자동 재시도 | ★★★★★ |
| 실시간 상태 업데이트 | **Laravel Reverb** - 자체 호스팅 WebSocket | ★★★★★ |
| 벡터 검색 (RAG) | **LLPhant** + Qdrant - PHP용 RAG 파이프라인 | ★★★★☆ |
| SaaS 인프라 | Cashier(결제), Sanctum(인증), Spatie(권한) | ★★★★★ |
| 빠른 프로토타이핑 | Eloquent ORM, Artisan CLI, 풍부한 에코시스템 | ★★★★★ |

### 2.2 FastAPI(Python) 대비 트레이드오프

| 항목 | Laravel | FastAPI |
|------|---------|---------|
| AI 라이브러리 생태계 | API 호출 충분, ML 학습은 불가 | Python 네이티브 (장점) |
| 웹 프레임워크 성숙도 | 매우 높음 (Auth, Queue, Mail, Storage 내장) | 직접 구성 필요 |
| ORM | Eloquent (매우 편리) | SQLAlchemy (강력하지만 설정 복잡) |
| 실시간 | Reverb (내장) | WebSocket 별도 구성 |
| 배포 | Laravel Cloud / Forge | Docker 직접 관리 |
| 개발 속도 | 빠름 | 보통 |

**결론**: 이 프로젝트의 AI 기능은 모두 외부 API 호출(Claude, OpenAI)이므로, ML 라이브러리가 필요하지 않습니다. 오케스트레이션 레이어로서 Laravel이 더 생산적입니다.

---

## 3. 기술 스택

### 3.1 Backend

| 기술 | 버전 | 역할 |
|------|------|------|
| **PHP** | 8.4 | 런타임 (Property Hooks, JIT 개선) |
| **Laravel** | 12.x | 핵심 프레임워크 |
| **Prism PHP** | 1.x | LLM 통합 (Claude, OpenAI 통합 인터페이스) |
| **LLPhant** | latest | RAG 파이프라인 (임베딩, 검색, 답변 생성) |
| **Laravel Reverb** | latest | WebSocket 서버 (실시간 알림) |
| **Laravel Sanctum** | latest | API 토큰 인증 |
| **Spatie Permission** | latest | RBAC 역할/권한 관리 |
| **Spatie Media Library** | latest | 이미지 업로드/변환/관리 |
| **Laravel Excel** | latest | 엑셀 Import/Export |
| **DomPDF / Snappy** | latest | PDF 리포트 생성 |

### 3.2 Frontend

| 기술 | 버전 | 역할 |
|------|------|------|
| **Vue 3** | 3.5+ | UI 프레임워크 |
| **Inertia.js** | 2.0 | SPA 라우팅 (Laravel 연동) |
| **TypeScript** | 5.x | 타입 안전성 |
| **Tailwind CSS** | 3.x | 유틸리티 CSS |
| **shadcn-vue** | latest | UI 컴포넌트 (Radix 기반 접근성) |
| **Pinia** | 2.x | 클라이언트 상태 관리 |
| **VueUse** | latest | 유틸리티 Composables |
| **ApexCharts** | latest | 대시보드 차트 |
| **Laravel Echo** | latest | WebSocket 클라이언트 (Reverb 연동) |

### 3.3 데이터베이스 및 인프라

| 기술 | 버전 | 역할 |
|------|------|------|
| **PostgreSQL** | 16 | 주 데이터베이스 (JSONB, Full-text Search) |
| **Qdrant** | 1.7+ | 벡터 DB (RAG 유사 사례 검색) |
| **Redis** | 7.x | 캐시 + 큐 브로커 + 세션 + Reverb 스케일링 |
| **MinIO** | latest | S3 호환 파일 스토리지 (이미지, PDF) |
| **Docker** | 24.x | 컨테이너화 |
| **Nginx** | latest | 리버스 프록시 + SSL |

### 3.4 AI 서비스

| 서비스 | 용도 |
|--------|------|
| **Claude 3.5 Sonnet** (Anthropic) | Vision AI 하자 이미지 분류 (Primary) |
| **GPT-4o** (OpenAI) | Vision AI (Fallback) |
| **text-embedding-3-small** (OpenAI) | 텍스트 벡터 임베딩 (RAG용) |

---

## 4. 시스템 아키텍처

### 4.1 전체 구성도

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│                                                                  │
│   Vue 3 + Inertia 2.0 + TypeScript + Tailwind + shadcn-vue      │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐     │
│   │Dashboard │ │ Defects  │ │  Search  │ │   Settings    │     │
│   └──────────┘ └──────────┘ └──────────┘ └───────────────┘     │
│                  Laravel Echo (WebSocket Client)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Nginx (Reverse Proxy)                       │
│          Rate Limiting · SSL · Gzip · Static Files               │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼                             ▼
┌────────────────────────┐     ┌─────────────────────────┐
│   Laravel 12 (PHP-FPM) │     │   Laravel Reverb         │
│                        │     │   (WebSocket Server)      │
│  ┌──────────────────┐  │     │                           │
│  │   Inertia SSR    │  │     │  Private Channels:        │
│  ├──────────────────┤  │     │  • defect.{project_id}    │
│  │   Route Layer    │  │     │  • user.{user_id}         │
│  ├──────────────────┤  │     └─────────────────────────┘
│  │ Controller Layer │  │
│  ├──────────────────┤  │
│  │  Service Layer   │  │
│  │  ┌────────────┐  │  │
│  │  │DefectService│  │  │
│  │  │AIService   │  │  │
│  │  │RAGService  │  │  │
│  │  │AssignService│ │  │
│  │  └────────────┘  │  │
│  ├──────────────────┤  │
│  │ Repository/ORM   │  │
│  │  (Eloquent)      │  │
│  └──────────────────┘  │
└────────────┬───────────┘
             │
    ┌────────┼────────────────────┐
    ▼        ▼                    ▼
┌────────┐ ┌──────┐ ┌──────────────────────────┐
│Postgres│ │Redis │ │ Laravel Queue Workers     │
│  16    │ │ 7.x  │ │ (Supervisor managed)      │
└────────┘ └──────┘ │                            │
                     │ ┌──────────────────────┐  │
                     │ │ AI Classification Job │  │
                     │ │ (Prism → Claude API)  │  │
                     │ ├──────────────────────┤  │
                     │ │ Embedding Index Job   │  │
                     │ │ (OpenAI → Qdrant)     │  │
                     │ ├──────────────────────┤  │
                     │ │ Notification Job      │  │
                     │ │ (Email / 알림톡)       │  │
                     │ ├──────────────────────┤  │
                     │ │ Report Generation Job │  │
                     │ │ (PDF / Excel)         │  │
                     │ └──────────────────────┘  │
                     └──────────┬─────────────────┘
                                │
              ┌─────────────────┼──────────────┐
              ▼                 ▼              ▼
       ┌────────────┐  ┌──────────────┐  ┌─────────┐
       │ Claude API │  │ OpenAI API   │  │  MinIO  │
       │ (Vision)   │  │ (Embedding)  │  │ (Files) │
       └────────────┘  └──────────────┘  └─────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │   Qdrant     │
                        │ (Vector DB)  │
                        └──────────────┘
```

### 4.2 요청 흐름: 하자 등록 → AI 분류 → 자동 배정

```
1. 사용자: 사진 촬영 + 동/호/위치 입력 (Vue 위저드)
2. Inertia POST → DefectController@store
3. DefectService:
   a. Spatie MediaLibrary → MinIO 이미지 업로드
   b. Defect Eloquent 모델 생성 (status: PENDING)
   c. ClassifyDefectJob::dispatch($defect)  ← Queue에 비동기 발행
   d. DefectCreated 이벤트 브로드캐스트 (Reverb)
4. Queue Worker → ClassifyDefectJob:
   a. Prism PHP → Claude 3.5 Sonnet Vision API 호출
   b. 구조화된 응답 파싱 (공종/유형/심각도/신뢰도)
   c. AiClassification 모델 저장
   d. Defect.status → RECEIVED 전이
   e. AssignContractorJob::dispatch($defect)  ← 연쇄 배정
   f. IndexDefectJob::dispatch($defect)  ← 벡터 인덱싱
   g. DefectClassified 이벤트 브로드캐스트 (Reverb)
5. Queue Worker → AssignContractorJob:
   a. 공종 매칭 → 시공사 조회 → 업무량 기반 배정
   b. Defect.status → ASSIGNED 전이
   c. 시공사에게 알림 발송
   d. DefectAssigned 이벤트 브로드캐스트 (Reverb)
6. 프론트엔드: Laravel Echo가 Reverb 이벤트 수신 → 실시간 UI 업데이트
```

---

## 5. 데이터 모델 설계

### 5.1 ERD 개요

```
tenants ──1:N── projects ──1:N── defects ──1:N── defect_images
                                    │
                                    ├──1:N── defect_histories
                                    ├──1:N── ai_classifications
                                    ├──N:1── contractors
                                    └──N:1── users (reporter/assignee)

users ──N:M── projects (through project_user)
users ──N:M── roles (through Spatie Permission)
contractors ──1:N── contractor_work_types
```

### 5.2 Eloquent 모델 및 마이그레이션

#### Tenant (멀티테넌시)

```php
// database/migrations/create_tenants_table.php
Schema::create('tenants', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name');                    // 회사명
    $table->string('slug')->unique();          // URL 식별자
    $table->string('plan')->default('free');   // 요금제
    $table->json('settings')->nullable();      // 테넌트별 설정
    $table->timestamps();
});
```

#### Project (프로젝트/단지)

```php
Schema::create('projects', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
    $table->string('name');                     // 단지명
    $table->string('code', 20)->unique();       // 현장코드
    $table->text('address')->nullable();
    $table->integer('total_buildings')->default(0);
    $table->integer('total_units')->default(0);
    $table->string('phase', 20)->default('pre_check');
    $table->date('start_date')->nullable();
    $table->date('end_date')->nullable();
    $table->timestamps();

    $table->index(['tenant_id', 'code']);
});
```

#### Defect (하자 — 핵심 테이블)

```php
Schema::create('defects', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('receipt_number', 20)->unique();  // YYMMDD-0001
    $table->foreignUuid('project_id')->constrained()->cascadeOnDelete();

    // Phase 통합 (하나의 테이블로 품검/사전점검/입주 관리)
    $table->string('phase', 20);                     // quality_check | pre_check | movein

    // 위치 정보
    $table->string('building', 10);                  // 동
    $table->string('unit', 10);                      // 호
    $table->string('room', 30)->nullable();          // 거실, 안방 등
    $table->string('position', 50)->nullable();      // 벽, 천장, 바닥 등

    // 분류 정보 (AI 결과 적용, 사용자 수정 가능)
    $table->string('work_type', 50)->nullable();     // 공종
    $table->string('defect_type', 50)->nullable();   // 하자유형
    $table->string('severity', 10)->nullable();      // LEVEL_1 ~ LEVEL_4
    $table->text('description')->nullable();

    // 상태 (FSM)
    $table->string('status', 20)->default('PENDING');

    // 배정 정보
    $table->foreignUuid('contractor_id')->nullable()->constrained();
    $table->timestamp('assigned_at')->nullable();
    $table->foreignUuid('assigned_by')->nullable()->constrained('users');

    // 처리 정보
    $table->date('promise_date')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->foreignUuid('completed_by')->nullable()->constrained('users');
    $table->timestamp('verified_at')->nullable();
    $table->foreignUuid('verified_by')->nullable()->constrained('users');
    $table->timestamp('closed_at')->nullable();

    // 메타
    $table->foreignUuid('reporter_id')->nullable()->constrained('users');
    $table->boolean('is_urgent')->default(false);
    $table->text('reject_reason')->nullable();
    $table->text('work_note')->nullable();

    $table->timestamps();
    $table->softDeletes();

    // 인덱스
    $table->index(['project_id', 'status']);
    $table->index(['project_id', 'building', 'unit']);
    $table->index(['contractor_id', 'status']);
    $table->index('created_at');
});
```

#### DefectImage (이미지 — 정규화된 별도 테이블)

```php
Schema::create('defect_images', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('defect_id')->constrained()->cascadeOnDelete();
    $table->string('image_url', 500);
    $table->string('thumbnail_url', 500)->nullable();
    $table->string('image_type', 10);               // BEFORE | AFTER | CONFIRM
    $table->integer('sort_order')->default(0);
    $table->json('ai_metadata')->nullable();         // AI 감지 영역, 라벨
    $table->integer('file_size')->nullable();
    $table->timestamp('created_at')->useCurrent();
});
```

#### DefectHistory (감사 로그 — 완전한 이력 추적)

```php
Schema::create('defect_histories', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('defect_id')->constrained()->cascadeOnDelete();
    $table->string('from_status', 20)->nullable();
    $table->string('to_status', 20);
    $table->foreignUuid('changed_by')->constrained('users');
    $table->text('note')->nullable();
    $table->json('metadata')->nullable();
    $table->timestamp('created_at')->useCurrent();

    $table->index(['defect_id', 'created_at']);
});
```

#### AiClassification (AI 분류 결과 + 피드백 루프)

```php
Schema::create('ai_classifications', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('defect_id')->constrained()->cascadeOnDelete();

    // AI 예측
    $table->string('predicted_work_type', 50)->nullable();
    $table->string('predicted_defect_type', 50)->nullable();
    $table->string('predicted_severity', 10)->nullable();
    $table->float('confidence_score')->default(0);
    $table->text('reasoning')->nullable();

    // 사용자 피드백
    $table->boolean('user_corrected')->default(false);
    $table->string('corrected_work_type', 50)->nullable();
    $table->string('corrected_defect_type', 50)->nullable();
    $table->string('corrected_severity', 10)->nullable();

    // 모델 메타
    $table->string('model_name', 50);
    $table->string('prompt_version', 10);
    $table->integer('latency_ms');
    $table->json('token_usage')->nullable();
    $table->json('raw_response')->nullable();

    $table->timestamp('created_at')->useCurrent();
});
```

#### Contractor (시공사)

```php
Schema::create('contractors', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
    $table->string('name', 100);
    $table->string('contact_name', 50)->nullable();
    $table->string('phone', 20)->nullable();
    $table->string('email', 100)->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

Schema::create('contractor_work_types', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('contractor_id')->constrained()->cascadeOnDelete();
    $table->foreignUuid('project_id')->constrained()->cascadeOnDelete();
    $table->string('work_type', 50);

    $table->unique(['contractor_id', 'project_id', 'work_type']);
});
```

### 5.3 Eloquent 모델 관계 정의

```php
// app/Models/Defect.php
class Defect extends Model
{
    use HasUuids, SoftDeletes;

    protected $casts = [
        'is_urgent'    => 'boolean',
        'assigned_at'  => 'datetime',
        'completed_at' => 'datetime',
        'verified_at'  => 'datetime',
        'closed_at'    => 'datetime',
        'promise_date' => 'date',
    ];

    // 관계
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(DefectImage::class)->orderBy('sort_order');
    }

    public function beforeImages(): HasMany
    {
        return $this->images()->where('image_type', 'BEFORE');
    }

    public function afterImages(): HasMany
    {
        return $this->images()->where('image_type', 'AFTER');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(DefectHistory::class)->latest();
    }

    public function classifications(): HasMany
    {
        return $this->hasMany(AiClassification::class)->latest();
    }

    public function latestClassification(): HasOne
    {
        return $this->hasOne(AiClassification::class)->latestOfMany();
    }

    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    // 스코프
    public function scopeForProject(Builder $query, string $projectId): Builder
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeWithStatus(Builder $query, string|array $status): Builder
    {
        return $query->whereIn('status', (array) $status);
    }

    public function scopePhase(Builder $query, string $phase): Builder
    {
        return $query->where('phase', $phase);
    }
}
```

---

## 6. 워크플로우 엔진 (FSM)

### 6.1 상태 전이 다이어그램

```
┌──────────┐   AI 분류    ┌──────────┐  자동 배정   ┌──────────┐
│ PENDING  │────완료──────▶│ RECEIVED │─────────────▶│ ASSIGNED │
│ (접수대기)│              │ (접수완료)│              │ (배정완료)│
└──────────┘              └──────────┘              └─────┬────┘
                                                         │
                                                   시공사 착수
                                                         │
                                                  ┌──────▼──────┐
                                                  │ IN_PROGRESS  │
                                                  │  (처리중)     │
                                                  └──────┬──────┘
                                                         │
                                                  보수 완료 + 사진
                                                         │
                                                  ┌──────▼──────┐
                                                  │  COMPLETED   │
                                                  │  (처리완료)   │
                                                  └───┬─────┬───┘
                                                      │     │
                                                검수통과  검수반려
                                                      │     │
                                              ┌───────▼┐  ┌─▼────────┐
                                              │VERIFIED│  │ REJECTED │
                                              │(검수완료)│  │  (반려)   │
                                              └───┬────┘  └─────┬────┘
                                                  │             │
                                              종결 처리    ASSIGNED로
                                                  │        재배정
                                              ┌───▼────┐
                                              │ CLOSED │
                                              │ (종결)  │
                                              └────────┘
```

### 6.2 Laravel Enum 기반 상태 머신

```php
// app/Enums/DefectStatus.php
enum DefectStatus: string
{
    case PENDING     = 'PENDING';
    case RECEIVED    = 'RECEIVED';
    case ASSIGNED    = 'ASSIGNED';
    case IN_PROGRESS = 'IN_PROGRESS';
    case COMPLETED   = 'COMPLETED';
    case REJECTED    = 'REJECTED';
    case VERIFIED    = 'VERIFIED';
    case CLOSED      = 'CLOSED';

    /**
     * 이 상태에서 전이 가능한 다음 상태 목록
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::PENDING     => [self::RECEIVED],
            self::RECEIVED    => [self::ASSIGNED],
            self::ASSIGNED    => [self::IN_PROGRESS],
            self::IN_PROGRESS => [self::COMPLETED],
            self::COMPLETED   => [self::VERIFIED, self::REJECTED],
            self::REJECTED    => [self::ASSIGNED],
            self::VERIFIED    => [self::CLOSED],
            self::CLOSED      => [],
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->allowedTransitions());
    }

    public function label(): string
    {
        return match ($this) {
            self::PENDING     => '접수대기',
            self::RECEIVED    => '접수완료',
            self::ASSIGNED    => '배정완료',
            self::IN_PROGRESS => '처리중',
            self::COMPLETED   => '처리완료',
            self::REJECTED    => '반려',
            self::VERIFIED    => '검수완료',
            self::CLOSED      => '종결',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING     => 'gray',
            self::RECEIVED    => 'blue',
            self::ASSIGNED    => 'yellow',
            self::IN_PROGRESS => 'indigo',
            self::COMPLETED   => 'green',
            self::REJECTED    => 'red',
            self::VERIFIED    => 'emerald',
            self::CLOSED      => 'slate',
        };
    }
}
```

### 6.3 상태 전이 서비스

```php
// app/Services/DefectStateMachine.php
class DefectStateMachine
{
    public function __construct(
        private Defect $defect,
    ) {}

    public function transitionTo(
        DefectStatus $target,
        User $user,
        ?string $note = null,
        array $metadata = [],
    ): Defect {
        $current = DefectStatus::from($this->defect->status);

        // 1. 전이 유효성 검증
        if (!$current->canTransitionTo($target)) {
            throw new InvalidTransitionException(
                "{$current->label()}에서 {$target->label()}(으)로 전이할 수 없습니다."
            );
        }

        // 2. 전이별 필수 요건 검증
        $this->validateRequirements($target);

        // 3. 상태 변경
        $this->defect->status = $target->value;
        $this->defect->updated_at = now();

        // 4. 상태별 후처리
        $this->executeHooks($target, $user);

        // 5. 이력 기록
        $this->defect->histories()->create([
            'from_status' => $current->value,
            'to_status'   => $target->value,
            'changed_by'  => $user->id,
            'note'        => $note,
            'metadata'    => $metadata,
        ]);

        $this->defect->save();

        // 6. 이벤트 브로드캐스트
        DefectStatusChanged::dispatch($this->defect, $current, $target);

        return $this->defect;
    }

    private function validateRequirements(DefectStatus $target): void
    {
        match ($target) {
            DefectStatus::COMPLETED => $this->requireAfterPhotos(),
            DefectStatus::REJECTED  => $this->requireRejectReason(),
            default => null,
        };
    }

    private function requireAfterPhotos(): void
    {
        if ($this->defect->afterImages()->count() === 0) {
            throw new ValidationException('처리 완료를 위해 작업 후 사진이 필요합니다.');
        }
    }

    private function requireRejectReason(): void
    {
        if (empty($this->defect->reject_reason)) {
            throw new ValidationException('반려 사유를 입력해주세요.');
        }
    }

    private function executeHooks(DefectStatus $target, User $user): void
    {
        match ($target) {
            DefectStatus::ASSIGNED => $this->onAssigned($user),
            DefectStatus::COMPLETED => $this->onCompleted($user),
            DefectStatus::VERIFIED => $this->onVerified($user),
            default => null,
        };
    }

    private function onAssigned(User $user): void
    {
        $this->defect->assigned_at = now();
        $this->defect->assigned_by = $user->id;

        // 시공사 알림 (Queue)
        NotifyContractorJob::dispatch($this->defect);
    }

    private function onCompleted(User $user): void
    {
        $this->defect->completed_at = now();
        $this->defect->completed_by = $user->id;
    }

    private function onVerified(User $user): void
    {
        $this->defect->verified_at = now();
        $this->defect->verified_by = $user->id;
    }
}
```

---

## 7. AI 시스템 설계

### 7.1 Prism PHP를 활용한 Vision AI 분류

```php
// app/Services/AiClassificationService.php
use Prism\Prism\Prism;
use Prism\Prism\Enums\Provider;

class AiClassificationService
{
    /**
     * 하자 이미지 AI 분류 (Claude 3.5 Sonnet)
     */
    public function classify(Defect $defect, array $imageUrls): AiClassification
    {
        $startTime = microtime(true);

        try {
            $result = $this->callPrimary($imageUrls);
        } catch (\Exception $e) {
            Log::warning('Claude API failed, falling back to GPT-4o', [
                'error' => $e->getMessage()
            ]);
            $result = $this->callFallback($imageUrls);
        }

        $latency = (int) ((microtime(true) - $startTime) * 1000);

        return AiClassification::create([
            'defect_id'              => $defect->id,
            'predicted_work_type'    => $result['work_type'],
            'predicted_defect_type'  => $result['defect_type'],
            'predicted_severity'     => $result['severity'],
            'confidence_score'       => $result['confidence'],
            'reasoning'              => $result['reasoning'],
            'model_name'             => $result['model'],
            'prompt_version'         => 'v1.0',
            'latency_ms'            => $latency,
            'token_usage'           => $result['tokens'] ?? null,
            'raw_response'          => $result['raw'] ?? null,
        ]);
    }

    private function callPrimary(array $imageUrls): array
    {
        $response = Prism::text()
            ->using(Provider::Anthropic, 'claude-sonnet-4-20250514')
            ->withSystemPrompt($this->getSystemPrompt())
            ->withMessages([
                $this->buildVisionMessage($imageUrls),
            ])
            ->asStructured(DefectClassificationSchema::class)
            ->generate();

        $data = $response->structured;
        $data['model'] = 'claude-3.5-sonnet';
        $data['tokens'] = [
            'input'  => $response->usage->inputTokens,
            'output' => $response->usage->outputTokens,
        ];

        return $data;
    }

    private function callFallback(array $imageUrls): array
    {
        $response = Prism::text()
            ->using(Provider::OpenAI, 'gpt-4o')
            ->withSystemPrompt($this->getSystemPrompt())
            ->withMessages([
                $this->buildVisionMessage($imageUrls),
            ])
            ->asStructured(DefectClassificationSchema::class)
            ->generate();

        $data = $response->structured;
        $data['model'] = 'gpt-4o';

        return $data;
    }

    private function getSystemPrompt(): string
    {
        return <<<'PROMPT'
당신은 15년 경력의 공동주택 품질관리 전문가입니다.
제공된 하자 사진을 분석하여 정확한 분류를 수행하세요.

[분석 규칙]
1. 화살표 스티커가 있으면, 스티커가 가리키는 부분이 하자 위치입니다.
2. 여러 하자가 보이면 가장 심각한 것을 우선 분류합니다.
3. 불확실한 경우 confidence를 낮게 설정하고 reasoning에 근거를 기술합니다.

[공종 선택지]
도장, 목창호, 도배, 타일, 바닥, 전기, 설비, PL창호, 건축일반, 기타

[하자유형 선택지]
균열/크랙, 들뜸/탈락, 변형/처짐, 마감불량, 오염/변색, 파손/손상, 개폐불량, 누수, 기타

[심각도 기준]
LEVEL_1: 경미 (미관상 문제)
LEVEL_2: 보통 (경미한 기능 영향)
LEVEL_3: 중대 (주요 기능 상실, 즉시 보수 필요)
LEVEL_4: 긴급 (안전 위협, 거주 불가)
PROMPT;
    }

    private function buildVisionMessage(array $imageUrls): array
    {
        $content = [['type' => 'text', 'text' => '이 사진의 하자를 분석해주세요.']];

        foreach (array_slice($imageUrls, 0, 10) as $url) {
            $content[] = [
                'type' => 'image',
                'source' => ['type' => 'url', 'url' => $url],
            ];
        }

        return ['role' => 'user', 'content' => $content];
    }
}
```

### 7.2 Prism Structured Output 스키마

```php
// app/Schemas/DefectClassificationSchema.php
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\NumberSchema;

class DefectClassificationSchema
{
    public static function schema(): ObjectSchema
    {
        return new ObjectSchema(
            name: 'defect_classification',
            description: '하자 이미지 AI 분류 결과',
            properties: [
                new StringSchema('work_type', '공종 (도장, 타일, 설비 등)'),
                new StringSchema('defect_type', '하자유형 (균열, 파손, 누수 등)'),
                new StringSchema('severity', '심각도 (LEVEL_1~LEVEL_4)'),
                new NumberSchema('confidence', '분류 신뢰도 (0.0~1.0)'),
                new StringSchema('reasoning', '판단 근거 설명'),
            ],
            requiredFields: ['work_type', 'defect_type', 'severity', 'confidence', 'reasoning'],
        );
    }
}
```

### 7.3 AI 분류 Queue Job

```php
// app/Jobs/ClassifyDefectJob.php
class ClassifyDefectJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 10; // 재시도 간격 (초)
    public int $timeout = 30; // 최대 실행 시간

    public function __construct(
        public Defect $defect,
        public array $imageUrls,
    ) {}

    public function handle(
        AiClassificationService $aiService,
        DefectStateMachine $stateMachine,
        SmartAssignmentService $assignmentService,
    ): void {
        // 1. AI 분류 실행
        $classification = $aiService->classify($this->defect, $this->imageUrls);

        // 2. 분류 결과를 하자 레코드에 적용
        $this->defect->update([
            'work_type'   => $classification->predicted_work_type,
            'defect_type' => $classification->predicted_defect_type,
            'severity'    => $classification->predicted_severity,
        ]);

        // 3. 상태 전이: PENDING → RECEIVED
        $stateMachine = new DefectStateMachine($this->defect);
        $stateMachine->transitionTo(
            DefectStatus::RECEIVED,
            User::system(), // 시스템 사용자
            'AI 자동 분류 완료 (신뢰도: ' . round($classification->confidence_score * 100) . '%)',
        );

        // 4. 자동 배정 시도
        $contractor = $assignmentService->assign($this->defect);
        if ($contractor) {
            $this->defect->update(['contractor_id' => $contractor->id]);
            $stateMachine->transitionTo(
                DefectStatus::ASSIGNED,
                User::system(),
                "{$contractor->name}에 자동 배정",
            );
        }

        // 5. 벡터 인덱싱 (RAG용)
        IndexDefectJob::dispatch($this->defect);

        // 6. 실시간 알림
        broadcast(new DefectClassified($this->defect, $classification));
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Defect classification failed', [
            'defect_id' => $this->defect->id,
            'error'     => $exception->getMessage(),
        ]);

        // 실패 시 사용자에게 수동 분류 요청 알림
        broadcast(new DefectClassificationFailed($this->defect));
    }
}
```

### 7.4 스마트 시공사 배정

```php
// app/Services/SmartAssignmentService.php
class SmartAssignmentService
{
    public function assign(Defect $defect): ?Contractor
    {
        if (!$defect->work_type) {
            return null;
        }

        // 1. 해당 프로젝트 + 공종 담당 시공사 조회
        $candidates = Contractor::whereHas('workTypes', function ($q) use ($defect) {
            $q->where('project_id', $defect->project_id)
              ->where('work_type', $defect->work_type);
        })->where('is_active', true)->get();

        if ($candidates->isEmpty()) {
            return null;
        }

        if ($candidates->count() === 1) {
            return $candidates->first();
        }

        // 2. 복수 시공사인 경우 업무량 기반 로드 밸런싱
        return $candidates->sortBy(function ($contractor) {
            return $contractor->defects()
                ->whereIn('status', ['ASSIGNED', 'IN_PROGRESS'])
                ->count();
        })->first();
    }
}
```

---

## 8. RAG 검색 시스템

### 8.1 LLPhant 기반 RAG 파이프라인

```php
// app/Services/RagSearchService.php
use LLPhant\Embeddings\EmbeddingGenerator\OpenAI\OpenAIADAEmbeddingGenerator;
use LLPhant\VectorStores\Qdrant\QdrantVectorStore;
use LLPhant\Query\SemanticSearch\QuestionAnswering;

class RagSearchService
{
    private OpenAIADAEmbeddingGenerator $embeddingGenerator;
    private QdrantVectorStore $vectorStore;

    public function __construct()
    {
        $this->embeddingGenerator = new OpenAIADAEmbeddingGenerator(
            modelName: 'text-embedding-3-small',
        );
        $this->vectorStore = new QdrantVectorStore(
            collectionName: 'defects',
            host: config('services.qdrant.host'),
            port: config('services.qdrant.port'),
        );
    }

    /**
     * 자연어 검색 → 유사 사례 + AI 요약 답변
     */
    public function search(string $query, string $projectId, int $limit = 5): array
    {
        // 1. 쿼리 임베딩 생성
        $queryEmbedding = $this->embeddingGenerator->embedText($query);

        // 2. 벡터 유사도 검색 (Dense)
        $denseResults = $this->vectorStore->similaritySearch(
            embedding: $queryEmbedding,
            k: $limit * 2,
            filter: ['project_id' => $projectId],
        );

        // 3. 결과 정렬 및 제한
        $topResults = collect($denseResults)->take($limit);

        // 4. AI 요약 답변 생성
        $answer = $this->generateAnswer($query, $topResults);

        return [
            'answer'       => $answer,
            'similar_cases' => $topResults->toArray(),
            'total_found'  => count($denseResults),
        ];
    }

    /**
     * 하자 등록 시 벡터 인덱싱
     */
    public function indexDefect(Defect $defect): void
    {
        $text = implode(' | ', array_filter([
            "공종: {$defect->work_type}",
            "유형: {$defect->defect_type}",
            "심각도: {$defect->severity}",
            "위치: {$defect->room} {$defect->position}",
            "내용: {$defect->description}",
            $defect->work_note ? "처리방법: {$defect->work_note}" : null,
        ]));

        $embedding = $this->embeddingGenerator->embedText($text);

        $this->vectorStore->upsert(
            id: $defect->id,
            embedding: $embedding,
            payload: [
                'project_id'  => $defect->project_id,
                'work_type'   => $defect->work_type,
                'defect_type' => $defect->defect_type,
                'severity'    => $defect->severity,
                'description' => $defect->description,
                'status'      => $defect->status,
                'building'    => $defect->building,
                'unit'        => $defect->unit,
                'created_at'  => $defect->created_at->toISOString(),
            ],
        );
    }

    private function generateAnswer(string $query, $cases): string
    {
        $context = $cases->map(fn ($c) => $c['description'] ?? '')->implode("\n---\n");

        $response = Prism::text()
            ->using(Provider::Anthropic, 'claude-sonnet-4-20250514')
            ->withSystemPrompt(
                "당신은 하자 보수 전문가입니다. 주어진 유사 사례를 참고하여 질문에 대한 간결한 답변을 한국어로 제공하세요."
            )
            ->withPrompt(
                "질문: {$query}\n\n참고 사례:\n{$context}\n\n위 사례를 기반으로 답변해주세요."
            )
            ->generate();

        return $response->text;
    }
}
```

### 8.2 벡터 인덱싱 Job

```php
// app/Jobs/IndexDefectJob.php
class IndexDefectJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public Defect $defect) {}

    public function handle(RagSearchService $ragService): void
    {
        $ragService->indexDefect($this->defect);
    }
}
```

---

## 9. API 설계

### 9.1 라우트 구조 (Laravel Routes)

```php
// routes/api.php
Route::prefix('v1')->group(function () {

    // 인증
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/refresh', [AuthController::class, 'refresh']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        // 하자 관리
        Route::apiResource('defects', DefectController::class);
        Route::post('defects/{defect}/transition', [DefectController::class, 'transition']);
        Route::post('defects/{defect}/images', [DefectController::class, 'uploadImages']);
        Route::get('defects/{defect}/history', [DefectController::class, 'history']);
        Route::post('defects/bulk-import', [DefectController::class, 'bulkImport']);
        Route::get('defects-export', [DefectController::class, 'export']);

        // AI
        Route::post('ai/classify', [AiController::class, 'classify']);
        Route::get('ai/classifications/{defect}', [AiController::class, 'show']);
        Route::post('ai/classifications/{classification}/feedback', [AiController::class, 'feedback']);

        // RAG 검색
        Route::post('search', [SearchController::class, 'search']);
        Route::get('search/similar/{defect}', [SearchController::class, 'similar']);

        // 대시보드
        Route::prefix('dashboard')->group(function () {
            Route::get('summary', [DashboardController::class, 'summary']);
            Route::get('trends', [DashboardController::class, 'trends']);
            Route::get('distribution', [DashboardController::class, 'distribution']);
            Route::get('contractors', [DashboardController::class, 'contractors']);
        });

        // 관리
        Route::apiResource('projects', ProjectController::class);
        Route::apiResource('contractors', ContractorController::class);
        Route::apiResource('users', UserController::class);
    });
});
```

### 9.2 Inertia.js 라우트 (페이지 렌더링)

```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {

    // 대시보드
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // 하자 관리
    Route::resource('defects', DefectPageController::class);
    Route::get('defects/{defect}/detail', [DefectPageController::class, 'detail']);

    // RAG 검색
    Route::get('search', [SearchPageController::class, 'index'])->name('search');

    // 리포트
    Route::get('reports', [ReportPageController::class, 'index'])->name('reports');

    // 설정
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::resource('projects', ProjectPageController::class);
        Route::resource('contractors', ContractorPageController::class);
        Route::resource('users', UserPageController::class);
    });
});
```

### 9.3 API 응답 리소스 (Laravel API Resources)

```php
// app/Http/Resources/DefectResource.php
class DefectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'receipt_number' => $this->receipt_number,
            'phase'          => $this->phase,

            'location' => [
                'building' => $this->building,
                'unit'     => $this->unit,
                'room'     => $this->room,
                'position' => $this->position,
            ],

            'classification' => [
                'work_type'   => $this->work_type,
                'defect_type' => $this->defect_type,
                'severity'    => $this->severity,
            ],

            'status' => [
                'value' => $this->status,
                'label' => DefectStatus::from($this->status)->label(),
                'color' => DefectStatus::from($this->status)->color(),
            ],

            'contractor' => new ContractorResource($this->whenLoaded('contractor')),
            'reporter'   => new UserResource($this->whenLoaded('reporter')),

            'images' => [
                'before' => DefectImageResource::collection($this->whenLoaded('beforeImages')),
                'after'  => DefectImageResource::collection($this->whenLoaded('afterImages')),
            ],

            'ai_classification' => new AiClassificationResource(
                $this->whenLoaded('latestClassification')
            ),

            'dates' => [
                'promise_date'  => $this->promise_date?->format('Y-m-d'),
                'assigned_at'   => $this->assigned_at?->toISOString(),
                'completed_at'  => $this->completed_at?->toISOString(),
                'verified_at'   => $this->verified_at?->toISOString(),
                'created_at'    => $this->created_at->toISOString(),
            ],

            'is_urgent'     => $this->is_urgent,
            'description'   => $this->description,
            'work_note'     => $this->work_note,
            'reject_reason' => $this->reject_reason,
        ];
    }
}
```

---

## 10. 프론트엔드 아키텍처

### 10.1 Vue 3 + Inertia 2.0 구조

```
resources/
├── js/
│   ├── app.ts                    # Inertia 앱 진입점
│   ├── ssr.ts                    # SSR 진입점
│   │
│   ├── Pages/                    # Inertia 페이지 (라우트 매핑)
│   │   ├── Auth/
│   │   │   └── Login.vue
│   │   ├── Dashboard/
│   │   │   └── Index.vue
│   │   ├── Defects/
│   │   │   ├── Index.vue         # 하자 목록 (통합)
│   │   │   ├── Create.vue        # 등록 위저드
│   │   │   └── Show.vue          # 상세 뷰
│   │   ├── Search/
│   │   │   └── Index.vue         # RAG 검색
│   │   ├── Reports/
│   │   │   └── Index.vue
│   │   └── Settings/
│   │       ├── Projects/
│   │       ├── Contractors/
│   │       └── Users/
│   │
│   ├── Components/               # 재사용 컴포넌트
│   │   ├── ui/                   # shadcn-vue 기본 컴포넌트
│   │   │   ├── Button.vue
│   │   │   ├── Dialog.vue
│   │   │   ├── Sheet.vue         # 슬라이드오버
│   │   │   ├── Table.vue
│   │   │   ├── Badge.vue
│   │   │   ├── Card.vue
│   │   │   └── Toaster.vue
│   │   ├── defects/
│   │   │   ├── DefectTable.vue
│   │   │   ├── DefectCard.vue    # 모바일 카드
│   │   │   ├── DefectDetailPanel.vue
│   │   │   ├── DefectWizard.vue  # 3단계 등록
│   │   │   ├── DefectFilters.vue
│   │   │   ├── StatusBadge.vue
│   │   │   ├── AiResultCard.vue
│   │   │   ├── ImageGallery.vue
│   │   │   └── HistoryTimeline.vue
│   │   ├── dashboard/
│   │   │   ├── KpiCards.vue
│   │   │   ├── TrendChart.vue
│   │   │   ├── DistributionChart.vue
│   │   │   └── ContractorRanking.vue
│   │   ├── search/
│   │   │   ├── SearchInput.vue
│   │   │   ├── AiAnswer.vue
│   │   │   └── SimilarCases.vue
│   │   └── layout/
│   │       ├── AppLayout.vue     # 메인 레이아웃
│   │       ├── Sidebar.vue
│   │       ├── Header.vue
│   │       └── MobileNav.vue
│   │
│   ├── Composables/              # Vue Composables
│   │   ├── useDefects.ts
│   │   ├── useRealtime.ts        # Echo/Reverb 래퍼
│   │   ├── useFilters.ts
│   │   └── useResponsive.ts
│   │
│   ├── Stores/                   # Pinia 스토어 (최소한으로)
│   │   ├── authStore.ts
│   │   └── uiStore.ts           # 사이드바 상태, 뷰 모드 등
│   │
│   └── Types/                    # TypeScript 타입
│       ├── defect.ts
│       ├── project.ts
│       ├── user.ts
│       └── api.ts
│
├── css/
│   └── app.css                   # Tailwind 진입점
│
└── views/
    └── app.blade.php             # Inertia 루트 템플릿
```

### 10.2 실시간 업데이트 (Laravel Echo + Reverb)

```typescript
// resources/js/Composables/useRealtime.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export function useDefectRealtime(projectId: string) {
  const defects = ref<Defect[]>([]);

  onMounted(() => {
    window.Echo.private(`defects.${projectId}`)
      .listen('DefectCreated', (e: { defect: Defect }) => {
        defects.value.unshift(e.defect);
        toast.info(`새 하자 접수: ${e.defect.receipt_number}`);
      })
      .listen('DefectClassified', (e: { defect: Defect; classification: AiClassification }) => {
        updateDefect(e.defect);
        toast.success(`AI 분류 완료: ${e.defect.receipt_number}`);
      })
      .listen('DefectAssigned', (e: { defect: Defect }) => {
        updateDefect(e.defect);
      })
      .listen('DefectStatusChanged', (e: { defect: Defect }) => {
        updateDefect(e.defect);
      });
  });

  onUnmounted(() => {
    window.Echo.leave(`defects.${projectId}`);
  });

  return { defects };
}
```

---

## 11. 백엔드 아키텍처

### 11.1 도메인별 Service 분리

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/                  # API 전용
│   │   │   ├── AuthController.php
│   │   │   ├── DefectController.php
│   │   │   ├── AiController.php
│   │   │   ├── SearchController.php
│   │   │   └── DashboardController.php
│   │   └── Pages/                # Inertia 페이지 렌더링
│   │       ├── DashboardController.php
│   │       ├── DefectPageController.php
│   │       └── ...
│   ├── Requests/                 # Form Request Validation
│   │   ├── StoreDefectRequest.php
│   │   ├── TransitionDefectRequest.php
│   │   └── ...
│   ├── Resources/                # API Resources
│   │   ├── DefectResource.php
│   │   ├── DefectCollection.php
│   │   └── ...
│   └── Middleware/
│       └── EnsureProjectAccess.php
│
├── Models/
│   ├── Defect.php
│   ├── DefectImage.php
│   ├── DefectHistory.php
│   ├── AiClassification.php
│   ├── Project.php
│   ├── Contractor.php
│   ├── ContractorWorkType.php
│   ├── Tenant.php
│   └── User.php
│
├── Services/                     # 비즈니스 로직 (핵심)
│   ├── DefectService.php         # 하자 CRUD + 접수번호 생성
│   ├── DefectStateMachine.php    # FSM 상태 전이
│   ├── AiClassificationService.php  # Vision AI 호출
│   ├── RagSearchService.php      # RAG 검색
│   ├── SmartAssignmentService.php   # 자동 배정
│   ├── ReportService.php         # PDF/Excel 생성
│   └── NotificationService.php   # 알림 발송
│
├── Jobs/                         # Queue Jobs
│   ├── ClassifyDefectJob.php
│   ├── IndexDefectJob.php
│   ├── NotifyContractorJob.php
│   ├── GenerateReportJob.php
│   └── BulkImportJob.php
│
├── Events/                       # Broadcastable Events
│   ├── DefectCreated.php
│   ├── DefectClassified.php
│   ├── DefectAssigned.php
│   ├── DefectStatusChanged.php
│   └── DefectClassificationFailed.php
│
├── Enums/
│   ├── DefectStatus.php
│   ├── DefectPhase.php
│   ├── ImageType.php
│   └── Severity.php
│
├── Policies/                     # Authorization
│   ├── DefectPolicy.php
│   └── ProjectPolicy.php
│
└── Providers/
    └── AppServiceProvider.php
```

### 11.2 Controller 패턴 (얇은 Controller, 두꺼운 Service)

```php
// app/Http/Controllers/Api/DefectController.php
class DefectController extends Controller
{
    public function __construct(
        private DefectService $defectService,
    ) {}

    public function index(Request $request): DefectCollection
    {
        $defects = $this->defectService->list(
            projectId: $request->input('project_id'),
            filters: $request->only(['status', 'phase', 'work_type', 'building', 'q']),
            sort: $request->input('sort', '-created_at'),
            perPage: $request->input('per_page', 30),
        );

        return new DefectCollection($defects);
    }

    public function store(StoreDefectRequest $request): DefectResource
    {
        $defect = $this->defectService->create(
            data: $request->validated(),
            images: $request->file('images', []),
            user: $request->user(),
        );

        return new DefectResource($defect);
    }

    public function transition(
        TransitionDefectRequest $request,
        Defect $defect,
    ): DefectResource {
        $this->authorize('update', $defect);

        $stateMachine = new DefectStateMachine($defect);
        $defect = $stateMachine->transitionTo(
            target: DefectStatus::from($request->input('status')),
            user: $request->user(),
            note: $request->input('note'),
        );

        return new DefectResource($defect->fresh());
    }
}
```

---

## 12. 실시간 시스템

### 12.1 Laravel Reverb 설정

```php
// config/broadcasting.php
'reverb' => [
    'driver'  => 'reverb',
    'key'     => env('REVERB_APP_KEY'),
    'secret'  => env('REVERB_APP_SECRET'),
    'app_id'  => env('REVERB_APP_ID'),
    'options' => [
        'host'   => env('REVERB_HOST', '0.0.0.0'),
        'port'   => env('REVERB_PORT', 8080),
        'scheme' => env('REVERB_SCHEME', 'https'),
    ],
],
```

### 12.2 Broadcastable Event 예시

```php
// app/Events/DefectClassified.php
class DefectClassified implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Defect $defect,
        public AiClassification $classification,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("defects.{$this->defect->project_id}"),
            new PrivateChannel("user.{$this->defect->reporter_id}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'defect' => new DefectResource($this->defect),
            'classification' => [
                'work_type'   => $this->classification->predicted_work_type,
                'defect_type' => $this->classification->predicted_defect_type,
                'severity'    => $this->classification->predicted_severity,
                'confidence'  => $this->classification->confidence_score,
            ],
        ];
    }
}
```

---

## 13. UI/UX 전략

### 13.1 핵심 개선사항

| 기존 패턴 (일반 레거시) | "하자 이걸로" |
|----------------------|-------------|
| window.open() 팝업 | Inertia 라우팅 + Sheet 컴포넌트 |
| 수십 개 컬럼 가로 스크롤 | 핵심 8컬럼 + 슬라이드오버 상세 |
| 3개 중복 페이지 | 단일 페이지 + Phase 탭 |
| alert() 에러 | Toast (Sonner) 알림 |
| 하드코딩 모바일 감지 | CSS 미디어 쿼리 + 뷰 모드 토글 |
| 수동 상태 변경 | AI 자동 전이 + 원클릭 버튼 |
| 새로고침으로 상태 확인 | Reverb 실시간 WebSocket |

### 13.2 화면 구성

```
┌────────────────────────────────────────────────────┐
│  / (Dashboard)                                      │
│  ├── KPI 요약 카드 4개                               │
│  ├── 주간 추이 차트 (ApexCharts)                     │
│  ├── 공종별 분포 파이 차트                            │
│  └── 시공사 성과 테이블                               │
│                                                      │
│  /defects                                            │
│  ├── Phase 탭: [전체] [품검] [사전점검] [입주]         │
│  ├── 데스크톱: 테이블 뷰 | 모바일: 카드 뷰 (자동 전환)  │
│  ├── 필터: 상태, 공종, 동, 호, 기간                    │
│  ├── 일괄 작업: 약속일 설정, 배정, 완료 처리            │
│  └── 행 클릭 → Sheet (슬라이드오버) 상세 패널           │
│                                                      │
│  /defects/create                                     │
│  └── 3단계 위저드: [위치] → [사진+AI] → [확인+제출]    │
│                                                      │
│  /defects/{id}                                       │
│  ├── 기본 정보 + AI 분류 결과 (신뢰도 바)              │
│  ├── Before/After 이미지 비교                         │
│  ├── 상태 타임라인 (이력)                             │
│  ├── 유사 사례 추천 (RAG)                            │
│  └── 상태 변경 액션 버튼                              │
│                                                      │
│  /search                                             │
│  ├── 자연어 검색 입력                                 │
│  ├── AI 요약 답변 카드                                │
│  └── 유사 사례 카드 목록                              │
│                                                      │
│  /reports                                            │
│  └── PDF/Excel 다운로드, 통계 리포트                   │
│                                                      │
│  /settings                                           │
│  ├── 프로젝트 관리                                    │
│  ├── 시공사/공종 관리                                 │
│  └── 사용자/권한 관리                                 │
└────────────────────────────────────────────────────┘
```

### 13.3 디자인 시스템

#### 상태 배지

```vue
<!-- Components/defects/StatusBadge.vue -->
<template>
  <Badge :variant="variant">
    {{ status.label }}
  </Badge>
</template>

<script setup lang="ts">
const statusMap = {
  PENDING:     { label: '접수대기', variant: 'secondary' },
  RECEIVED:    { label: '접수완료', variant: 'info' },
  ASSIGNED:    { label: '배정완료', variant: 'warning' },
  IN_PROGRESS: { label: '처리중',   variant: 'primary' },
  COMPLETED:   { label: '처리완료', variant: 'success' },
  REJECTED:    { label: '반려',    variant: 'destructive' },
  VERIFIED:    { label: '검수완료', variant: 'success' },
  CLOSED:      { label: '종결',    variant: 'outline' },
};
</script>
```

---

## 14. 인프라 및 배포

### 14.1 Docker Compose

```yaml
services:
  # ── Application ──
  app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - .:/var/www/html
    depends_on: [postgres, redis, qdrant, minio]
    environment:
      - APP_ENV=local
      - DB_CONNECTION=pgsql
      - DB_HOST=postgres
      - REDIS_HOST=redis
      - QUEUE_CONNECTION=redis
      - REVERB_HOST=0.0.0.0

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
      - .:/var/www/html
    depends_on: [app]

  queue-worker:
    build: .
    command: php artisan queue:work redis --tries=3 --timeout=60
    depends_on: [app, redis]

  reverb:
    build: .
    command: php artisan reverb:start --host=0.0.0.0 --port=8080
    ports: ["8080:8080"]
    depends_on: [app, redis]

  scheduler:
    build: .
    command: php artisan schedule:work
    depends_on: [app]

  # ── Infrastructure ──
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: haja_db
      POSTGRES_USER: haja
      POSTGRES_PASSWORD: secret

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  qdrant:
    image: qdrant/qdrant:v1.7.4
    ports: ["6333:6333"]
    volumes:
      - qdrant_data:/qdrant/storage

  minio:
    image: minio/minio:latest
    ports: ["9000:9000", "9001:9001"]
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

volumes:
  pgdata:
  qdrant_data:
  minio_data:
```

### 14.2 Dockerfile

```dockerfile
FROM php:8.4-fpm-alpine

# 시스템 의존성
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    supervisor

# PHP 확장
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_pgsql zip gd pcntl bcmath

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .
RUN composer install --no-dev --optimize-autoloader

# Node.js (프론트엔드 빌드용)
RUN apk add --no-cache nodejs npm
RUN npm ci && npm run build

EXPOSE 9000
CMD ["php-fpm"]
```

### 14.3 환경 변수

```bash
# .env.example
APP_NAME="하자 이걸로"
APP_ENV=local
APP_KEY=
APP_URL=http://localhost

# Database
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=haja_db
DB_USERNAME=haja
DB_PASSWORD=

# Redis
REDIS_HOST=redis

# Queue
QUEUE_CONNECTION=redis

# Reverb (WebSocket)
REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST=0.0.0.0
REVERB_PORT=8080

# Storage (MinIO)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=haja-files
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

# AI APIs
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Qdrant
QDRANT_HOST=qdrant
QDRANT_PORT=6333

# Mail
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
```

---

## 15. 테스트 전략

### 15.1 테스트 구조

| 유형 | 도구 | 목표 | 대상 |
|------|------|------|------|
| Unit | Pest PHP | 70%+ | Service, StateMachine, Enum |
| Feature | Pest PHP | 주요 API 100% | Controller, Job |
| Browser | Playwright | 핵심 10개 시나리오 | E2E 사용자 플로우 |
| AI 정확도 | 커스텀 | 85%+ | 라벨링 데이터셋 |

### 15.2 Pest 테스트 예시

```php
// tests/Feature/DefectTransitionTest.php
it('transitions defect from PENDING to RECEIVED', function () {
    $defect = Defect::factory()->create(['status' => 'PENDING']);
    $user = User::factory()->create();

    $stateMachine = new DefectStateMachine($defect);
    $result = $stateMachine->transitionTo(DefectStatus::RECEIVED, $user, 'AI 분류 완료');

    expect($result->status)->toBe('RECEIVED');
    expect($defect->histories)->toHaveCount(1);
    expect($defect->histories->first()->to_status)->toBe('RECEIVED');
});

it('rejects invalid transition from PENDING to COMPLETED', function () {
    $defect = Defect::factory()->create(['status' => 'PENDING']);
    $user = User::factory()->create();

    $stateMachine = new DefectStateMachine($defect);
    $stateMachine->transitionTo(DefectStatus::COMPLETED, $user);
})->throws(InvalidTransitionException::class);

it('requires after photo for COMPLETED transition', function () {
    $defect = Defect::factory()->create(['status' => 'IN_PROGRESS']);
    $user = User::factory()->create();
    // 사진 없이 완료 시도

    $stateMachine = new DefectStateMachine($defect);
    $stateMachine->transitionTo(DefectStatus::COMPLETED, $user);
})->throws(ValidationException::class);
```

---

## 16. 10주 스프린트 계획

### Phase 1: Foundation (Week 1-4)

#### Sprint 1 (Week 1-2): 인프라 + 인증 + 기반

| 일 | Backend | Frontend |
|----|---------|----------|
| D1-2 | `laravel new haja`, Docker Compose, PostgreSQL, `php artisan migrate`, Sanctum 설정 | `npm create vue`, Inertia 설정, Tailwind, shadcn-vue, AppLayout |
| D3-4 | User 모델, Spatie Permission, AuthController (login/logout/me) | Login.vue, 인증 미들웨어, 사이드바/헤더 레이아웃 |
| D5-7 | Defect CRUD Service + Controller, API Resources, StoreDefectRequest | DefectTable.vue, DefectFilters.vue, 페이지네이션 |
| D8-10 | MinIO + Spatie Media Library 연동, 이미지 업로드 API | 하자 목록 페이지 완성, 필터/정렬 동작 |

**마일스톤**: 로그인 → 하자 CRUD → 이미지 업로드 동작

#### Sprint 2 (Week 3-4): AI 분류 + 등록 위저드

| 일 | Backend | Frontend |
|----|---------|----------|
| D1-3 | Prism PHP 설치, AiClassificationService, ClassifyDefectJob, Queue 설정 | DefectWizard.vue (3단계), 카메라/파일 업로드 UI |
| D4-5 | DefectStateMachine (FSM), 전이 API, SmartAssignmentService | AiResultCard.vue (신뢰도 바, 수정 UI) |
| D6-7 | Reverb 설정, 이벤트 브로드캐스트, Echo 연동 | 실시간 AI 분류 결과 표시, DefectDetailPanel (Sheet) |
| D8-10 | GPT-4o Fallback, 에러 핸들링, 로깅 강화 | 모바일 카드 뷰 (DefectCard.vue), 반응형 |

**마일스톤**: 사진 업로드 → AI 자동 분류 → 시공사 배정 → 실시간 반영

### Phase 2: RAG & Search (Week 5-7)

#### Sprint 3 (Week 5-6): 벡터 DB + 검색

| 일 | Backend | Frontend |
|----|---------|----------|
| D1-3 | LLPhant + Qdrant 설정, EmbeddingPipeline, IndexDefectJob | Search/Index.vue, SearchInput.vue |
| D4-5 | 기존 데이터 일괄 임베딩 스크립트 (Artisan Command) | SimilarCases.vue (하자 상세 내 추천) |
| D6-8 | RagSearchService (검색 + AI 답변), 캐싱 | AiAnswer.vue (요약 답변 카드), 필터 |
| D9-10 | 검색 성능 최적화, 유사 사례 표시 | ImageGallery.vue, HistoryTimeline.vue |

#### Sprint 4 (Week 7): 피드백 루프

| 일 | Backend | Frontend |
|----|---------|----------|
| D1-3 | AI 피드백 API, 정확도 모니터링 쿼리 | 피드백 UI (분류 수정 버튼), 정확도 표시 |
| D4-5 | 프롬프트 버전 관리, A/B 테스트 기반 | 검색 결과 개선, UX 폴리싱 |

**마일스톤**: "발코니 도장 박리" 검색 → 유사 사례 5건 + AI 답변

### Phase 3: Workflow & Dashboard (Week 8-10)

#### Sprint 5 (Week 8-9): 상태 자동화 + 대시보드

| 일 | Backend | Frontend |
|----|---------|----------|
| D1-3 | 전체 FSM 전이 완성, 반려/재배정, 일괄 상태 변경 API | 상태 변경 Dialog, 반려 사유 입력, 일괄 작업 |
| D4-5 | NotificationService (이메일, 알림톡), 알림 Queue | 알림 드롭다운, 실시간 알림 표시 |
| D6-8 | Dashboard 통계 API (집계 쿼리), ContractorRanking API | Dashboard (KPI 카드, ApexCharts, 성과 테이블) |
| D9-10 | Laravel Excel Import/Export, DomPDF 리포트 | Import/Export UI, Reports 페이지 |

#### Sprint 6 (Week 10): QA + 배포

| 일 | Backend | Frontend |
|----|---------|----------|
| D1-2 | Pest 테스트 작성 (Unit + Feature), AI 정확도 검증 | Playwright E2E 테스트, 크로스 브라우저 |
| D3-4 | 데이터 마이그레이션 스크립트, 검증 | UI 폴리싱, 접근성, LCP < 2.5s |
| D5 | 프로덕션 Docker 빌드, 보안 점검, 배포 | 최종 QA |

**마일스톤**: 전체 워크플로우 E2E, 프로덕션 배포

---

## 17. 디렉토리 구조

### 최종 프로젝트 구조

```
haja-igeol-lo/
├── app/
│   ├── Enums/
│   │   ├── DefectStatus.php
│   │   ├── DefectPhase.php
│   │   ├── ImageType.php
│   │   └── Severity.php
│   ├── Events/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   ├── Controllers/Pages/
│   │   ├── Middleware/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Jobs/
│   ├── Models/
│   ├── Policies/
│   ├── Providers/
│   └── Services/
│
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
│
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   ├── Components/
│   │   ├── Composables/
│   │   ├── Stores/
│   │   └── Types/
│   ├── css/
│   └── views/
│
├── routes/
│   ├── api.php
│   ├── web.php
│   └── channels.php
│
├── tests/
│   ├── Feature/
│   ├── Unit/
│   └── E2E/ (Playwright)
│
├── docker/
│   ├── nginx/default.conf
│   └── supervisor/worker.conf
│
├── scripts/
│   └── migrate-data.php
│
├── docker-compose.yml
├── Dockerfile
├── composer.json
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## 18. 성공 지표 (KPI)

| 지표 | 목표 | 측정 |
|------|------|------|
| 하자 분류 시간 | 5분 → 30초 (90%↓) | 접수→분류 시간 로그 |
| AI 분류 정확도 | 85%+ | 라벨링 데이터셋 |
| RAG 검색 응답 | < 3초 | API P95 |
| 시공사 배정 시간 | 2시간 → 5분 | 접수→배정 차이 |
| API 응답 (P95) | < 2초 | APM |
| 페이지 로드 (LCP) | < 2.5초 | Lighthouse |
| 테스트 커버리지 | BE 70%+ | Pest Coverage |

---

## 19. 리스크 관리

| 리스크 | 확률 | 대응 |
|--------|------|------|
| Claude API 장애 | 중간 | GPT-4o 자동 Fallback (Prism 1줄 변경) |
| AI 정확도 미달 | 중간 | 사용자 피드백 루프, 프롬프트 A/B 테스트 |
| PHP에서 벡터 DB 연동 이슈 | 낮음 | LLPhant + Qdrant 패키지 검증 완료 |
| 실시간 WebSocket 부하 | 낮음 | Reverb + Redis 수평 확장 |
| API 비용 초과 | 높음 | 이미지 리사이즈, 캐싱, 일일 한도 설정 |

### 비용 최적화

```
1. 이미지 전처리: Spatie Media Library로 업로드 시 1024px 리사이즈 (토큰 절감)
2. 분류 캐시: 동일 이미지 해시 → Redis 캐시 히트 (중복 호출 방지)
3. 임베딩 배치: 100건 단위 일괄 임베딩 생성 (API 호출 횟수 절감)
4. 일일 한도: 하자 분류 1,000건/일, 월 예산 $500 상한 설정
```

---

## 20. 프로덕션 SaaS 추가 요구사항

MVP(10주)를 넘어, 실제 구독형 SaaS로 운영하기 위해 추가로 필요한 기능입니다.

### 20.1 구독/결제 시스템

| 기능 | 구현 방식 | 비고 |
|------|---------|------|
| 요금제 관리 | Laravel Cashier (Stripe) 또는 토스페이먼츠 연동 | 월/연 구독 |
| 플랜별 기능 제한 | Middleware + Tenant 설정 | Free / Pro / Enterprise |
| 사용량 기반 과금 | AI API 호출 수 미터링 | 하자 건수별 |
| 청구서/세금계산서 | PDF 자동 생성 + 이메일 발송 | 전자세금계산서 API 연동 |
| 무료 체험 | 14일 트라이얼 (카드 등록 없이) | 전환율 최적화 |

### 20.2 멀티테넌시 (Multi-tenancy)

```
Tenant A (삼성물산)         Tenant B (대우건설)
┌─────────────────────┐    ┌─────────────────────┐
│ Project: 래미안A단지  │    │ Project: 푸르지오B    │
│ Project: 래미안B단지  │    │ Project: 푸르지오C    │
│ Users: 50명          │    │ Users: 30명          │
│ Plan: Enterprise     │    │ Plan: Pro            │
└─────────────────────┘    └─────────────────────┘
       완전 데이터 격리 (tenant_id 기반 Row-Level Isolation)
```

- **구현**: `stancl/tenancy` 또는 단순 `tenant_id` 스코프 방식
- **데이터 격리**: 모든 쿼리에 자동 tenant_id 필터 (Global Scope)
- **커스터마이징**: 테넌트별 로고, 색상, 공종 분류 체계 설정 가능

### 20.3 온보딩 시스템

- 가입 후 첫 프로젝트 생성 위저드
- 시공사/공종 초기 설정 가이드
- 샘플 데이터로 기능 체험 (데모 모드)
- 사용자 초대 (이메일 초대 링크)

### 20.4 관리자 콘솔 (Super Admin)

- 전체 테넌트 관리 (가입 현황, 플랜, 사용량)
- 시스템 모니터링 (AI API 비용, 서버 상태)
- 공지사항/점검 안내
- 고객 문의 대시보드

### 20.5 보안 및 컴플라이언스

| 항목 | 구현 |
|------|------|
| 개인정보 처리 | 개인정보처리방침, 이용약관, 동의 절차 |
| 데이터 보관 | 계약 종료 후 90일 보관 → 자동 파기 |
| 접근 로그 | 모든 로그인/데이터 접근 기록 |
| 2FA | OTP 기반 2단계 인증 (선택) |
| HTTPS | 전 구간 TLS 1.3 강제 |
| 백업 | 일간 DB 전체 백업 + 30일 보관 |

---

## 21. 투입 인력 구성 및 R&R

### 21.1 팀 구성

```
┌─────────────────────────────────────────────────────────┐
│                    프로젝트 팀 구성                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  PM / 기획 (1명)                                         │
│  └── 프로젝트 총괄, 요구사항 관리, 일정 관리, 고객 커뮤니케이션  │
│                                                          │
│  백엔드 개발 (2명)                                        │
│  ├── [시니어 1명] 아키텍처 설계, AI 연동, 핵심 비즈니스 로직    │
│  └── [주니어 1명] CRUD API, 인증, 관리 기능, 테스트          │
│                                                          │
│  프론트엔드 개발 (2명)                                     │
│  ├── [시니어 1명] 컴포넌트 아키텍처, 실시간 UI, 복잡 인터랙션  │
│  └── [주니어 1명] 페이지 구현, 반응형, 차트, 폼             │
│                                                          │
│  모바일 개발 (1명)                                        │
│  └── 모바일 현장 관리 앱, PWA/하이브리드, 오프라인 동기화,    │
│      카메라 연동, 터치 최적화, 현장 점검 UI                  │
│                                                          │
│  디자이너 (1명)                                           │
│  └── UI/UX 설계, 디자인 시스템, 와이어프레임, 프로토타입      │
│       (모바일 전용 UX 포함)                                │
│                                                          │
│  QA / DevOps (1명)                                       │
│  └── 테스트 자동화, CI/CD 구축, 인프라 운영, 모니터링       │
│                                                          │
│                        합계: 8명                          │
└─────────────────────────────────────────────────────────┘
```

### 21.2 역할 및 책임 (R&R) 상세

#### PM / 기획 (1명)

| 책임 영역 | 세부 업무 |
|---------|---------|
| **요구사항 관리** | PRD 작성/갱신, 기능 명세 관리, 우선순위 결정 |
| **프로젝트 관리** | 스프린트 계획, 일일 스탠드업, 이슈 추적 (Jira/Linear) |
| **이해관계자** | 고객사 미팅, 피드백 수집, 데모 시연, 진행 보고 |
| **QA 지원** | 인수 테스트 시나리오 작성, UAT 진행 |
| **출시 관리** | 출시 체크리스트, 마케팅 자료 검수, 가이드 문서 |

| 투입 기간 | 주당 시간 |
|---------|---------|
| 사전기획 (2주) | 40h/주 (풀타임) |
| 개발 (16주) | 30h/주 (관리 집중) |
| QA/출시 (2주) | 40h/주 (풀타임) |

#### 백엔드 시니어 (1명)

| 책임 영역 | 세부 업무 |
|---------|---------|
| **아키텍처** | 시스템 설계, DB 스키마, API 설계, 코드 리뷰 |
| **AI 연동** | Prism PHP 통합, Claude/GPT Vision API, 프롬프트 엔지니어링 |
| **RAG 시스템** | LLPhant 파이프라인, Qdrant 벡터 DB, 하이브리드 검색 |
| **핵심 로직** | FSM 상태 머신, 스마트 배정, 실시간 이벤트 (Reverb) |
| **결제 시스템** | Cashier/토스페이먼츠 연동, 구독 관리, 사용량 미터링 |

| 투입 기간 | 주당 시간 |
|---------|---------|
| 전 기간 (20주) | 40h/주 (풀타임) |

#### 백엔드 주니어 (1명)

| 책임 영역 | 세부 업무 |
|---------|---------|
| **CRUD API** | 하자/프로젝트/시공사/사용자 CRUD, Form Request 검증 |
| **인증/권한** | Sanctum 설정, Spatie Permission RBAC, 미들웨어 |
| **데이터 처리** | 엑셀 Import/Export, PDF 리포트, 통계 집계 쿼리 |
| **알림** | 이메일 발송, 알림톡 연동, 알림 Queue Job |
| **테스트** | Pest 단위/통합 테스트 작성, Factory/Seeder |
| **관리 기능** | 멀티테넌시 스코프, 관리자 콘솔 API, 온보딩 |

| 투입 기간 | 주당 시간 |
|---------|---------|
| 개발 (16주) | 40h/주 (풀타임) |
| QA (2주) | 40h/주 |

#### 프론트엔드 시니어 (1명)

| 책임 영역 | 세부 업무 |
|---------|---------|
| **아키텍처** | 컴포넌트 설계, 상태 관리 전략, Inertia 설정 |
| **핵심 UI** | 하자 등록 위저드, 슬라이드오버 상세, AI 결과 카드 |
| **실시간** | Laravel Echo + Reverb 연동, 실시간 상태 업데이트 |
| **복잡 인터랙션** | 하이브리드 뷰 (테이블/카드), 드래그앤드롭, 이미지 비교 |
| **디자인 시스템** | shadcn-vue 커스터마이징, 공통 컴포넌트 제작 |
| **성능** | Lighthouse 최적화, 코드 스플리팅, 이미지 lazy load |

| 투입 기간 | 주당 시간 |
|---------|---------|
| 전 기간 (20주) | 40h/주 (풀타임) |

#### 프론트엔드 주니어 (1명)

| 책임 영역 | 세부 업무 |
|---------|---------|
| **페이지 구현** | 대시보드, 설정, 리포트, 검색 페이지 마크업 |
| **반응형** | 모바일 카드 뷰, 태블릿 레이아웃, CSS 미디어 쿼리 |
| **차트/테이블** | ApexCharts 대시보드, 데이터 테이블, 페이지네이션 |
| **폼** | 필터 패널, 설정 폼, 엑셀 업로드 UI |
| **정적 페이지** | 랜딩 페이지, 가격표, 이용약관, 도움말 |
| **접근성** | ARIA 레이블, 키보드 내비게이션, 다크모드(선택) |

| 투입 기간 | 주당 시간 |
|---------|---------|
| 개발 (16주) | 40h/주 (풀타임) |
| QA (2주) | 30h/주 |

#### UI/UX 디자이너 (1명)

| 책임 영역 | 세부 업무 |
|---------|---------|
| **UX 설계** | 사용자 플로우, 와이어프레임, 인터랙션 설계 |
| **UI 디자인** | Figma 시안, 디자인 시스템, 컴포넌트 라이브러리 |
| **프로토타입** | 클릭 가능 프로토타입 (주요 플로우 3-5개) |
| **브랜딩** | 로고, 컬러 팔레트, 아이콘, 일러스트 |
| **마케팅** | 랜딩 페이지 디자인, 소개 자료, 스크린샷 |
| **QA 지원** | 디자인 QA (구현 결과와 시안 비교 검수) |

| 투입 기간 | 주당 시간 |
|---------|---------|
| 사전기획 (2주) | 40h/주 (풀타임 - 전체 디자인) |
| Sprint 1-2 (4주) | 30h/주 (디자인+개발 동시) |
| Sprint 3-5 (8주) | 15h/주 (부분 투입, 디자인 QA) |
| 출시 준비 (2주) | 25h/주 (랜딩, 마케팅 자료) |

#### 모바일 개발자 (1명)

| 책임 영역 | 세부 업무 |
|---------|---------|
| **모바일 앱 개발** | PWA/하이브리드 앱, 모바일 전용 UI/UX 구현 |
| **현장 관리 기능** | 현장 점검 앱, 카메라 연동 (하자 촬영), GPS 위치 기록 |
| **오프라인 동기화** | Service Worker, IndexedDB 캐싱, 네트워크 복귀 시 자동 동기화 |
| **터치 최적화** | 44px 터치 타겟, 바텀 내비게이션, 스와이프 제스처 |
| **모바일 알림** | Push 알림 (Web Push API), 배지 업데이트, 진동 피드백 |
| **성능 최적화** | 모바일 번들 최소화, 이미지 압축, 저대역폭 대응 |

| 투입 기간 | 주당 시간 |
|---------|---------|
| Phase 1 디자인 참여 (2주) | 20h/주 |
| Phase 2-3 모바일 개발 (8주) | 40h/주 (풀타임) |
| Phase 4 통합/최적화 (4주) | 40h/주 (풀타임) |
| Phase 5 QA (2주) | 40h/주 (풀타임) |

#### QA / DevOps 엔지니어 (1명)

| 책임 영역 | 세부 업무 |
|---------|---------|
| **인프라** | Docker 환경 구성, 프로덕션 서버 셋업, SSL 인증서 |
| **CI/CD** | GitHub Actions 파이프라인, 자동 배포, 환경별 설정 |
| **모니터링** | 서버 모니터링 (Uptime), APM (응답시간), 에러 추적 (Sentry) |
| **테스트 자동화** | Playwright E2E, 부하 테스트 (Locust), 보안 스캔 |
| **DB 운영** | 백업 자동화, 마이그레이션 관리, 성능 튜닝 |
| **보안** | 취약점 스캔, 접근 제어, 로그 관리, 인시던트 대응 |

| 투입 기간 | 주당 시간 |
|---------|---------|
| 인프라 셋업 (2주) | 40h/주 |
| 개발 지원 (16주) | 20h/주 (부분 투입) |
| QA/출시 (4주) | 40h/주 (풀타임) |

---

## 22. 상세 마일스톤 계획 (24주)

MVP 10주에서 SaaS 프로덕션 수준으로 확장하고, 모바일 현장 관리 앱과 10K+ 규모의 대시보드/분석 엔진을 포함하여 총 24주 계획입니다.

### 22.1 전체 타임라인 개요

```
주차:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
      ├──────┤                                                                   사전기획
      │  ├─────────────────┤                                                     Phase 1: Foundation
      │  │                 ├──────────────┤                                      Phase 2: AI & RAG
      │  │                 │              ├──────────────┤                       Phase 3: Workflow + Dashboard
      │  │                 │     ├──────────────────────────────┤                Phase 3M: Mobile App
      │  │                 │              │              ├──────────────┤        Phase 4: SaaS
      │  │                 │              │              │         ├────────┤    Phase 5: QA & Launch
```

### 22.2 Phase 0: 사전기획 (Week 1-2)

**목표**: 디자인 완성, 개발 환경 준비, API 계약 확정

| 마일스톤 | 담당 | 산출물 |
|---------|------|--------|
| M0.1 UX 플로우 확정 | PM + 디자이너 | 사용자 플로우 다이어그램 (전체 화면 흐름) |
| M0.2 와이어프레임 | 디자이너 | 주요 8개 화면 와이어프레임 (Figma) |
| M0.3 UI 디자인 v1 | 디자이너 | 대시보드, 목록, 등록, 상세 고해상도 시안 |
| M0.4 디자인 시스템 | 디자이너 | 컬러/타이포/아이콘/컴포넌트 라이브러리 (Figma) |
| M0.5 API 스펙 확정 | PM + BE 시니어 | OpenAPI 3.0 YAML (전체 엔드포인트) |
| M0.6 DB 스키마 확정 | BE 시니어 | ERD + 마이그레이션 파일 |
| M0.7 개발 환경 구축 | DevOps | Docker Compose, Git 레포, CI 기본 설정 |
| M0.8 기술 PoC | BE 시니어 | Prism PHP + Claude Vision API 동작 확인 |

### 22.3 Phase 1: Foundation (Week 3-6)

**목표**: 인증, 하자 CRUD, 이미지 업로드, AI 분류, 기본 UI 완성

| 마일스톤 | 담당 | 산출물 | 완료 기준 |
|---------|------|--------|---------|
| **M1.1 인증 시스템** | BE 주니어 + FE 주니어 | Sanctum 인증, RBAC, 로그인 UI | 역할별 로그인/로그아웃 동작 |
| **M1.2 하자 CRUD API** | BE 시니어 | Defect CRUD + API Resources | Pest 테스트 통과, OpenAPI 문서 |
| **M1.3 이미지 업로드** | BE 주니어 | MinIO + Spatie MediaLibrary | 이미지 업로드 → 자동 리사이즈 → URL 반환 |
| **M1.4 하자 목록 UI** | FE 시니어 | DefectTable + DefectFilters + 페이지네이션 | 필터/정렬/검색 동작, 반응형 |
| **M1.5 등록 위저드 UI** | FE 시니어 | 3단계 위저드 (위치→사진→확인) | 사진 업로드 → 폼 제출 동작 |
| **M1.6 Vision AI 연동** | BE 시니어 | Prism + ClassifyDefectJob | 사진 업로드 → Queue → AI 분류 결과 저장 |
| **M1.7 FSM 상태 머신** | BE 시니어 | DefectStateMachine + History | 7단계 전이 + 이력 기록 + 검증 |
| **M1.8 실시간 알림** | BE 시니어 + FE 시니어 | Reverb + Echo 연동 | AI 분류 완료 시 실시간 UI 업데이트 |
| **M1.9 모바일 카드 뷰** | FE 주니어 | DefectCard + 반응형 전환 | 모바일에서 카드 뷰 자동 전환 |

**Phase 1 완료 기준**: 하자 등록 → AI 분류 → 시공사 배정 → 실시간 반영 (E2E)

### 22.4 Phase 2: AI & RAG (Week 7-10)

**목표**: RAG 검색, AI 피드백 루프, 유사 사례 추천 완성

| 마일스톤 | 담당 | 산출물 | 완료 기준 |
|---------|------|--------|---------|
| **M2.1 Qdrant 연동** | BE 시니어 | LLPhant + 벡터 컬렉션 설정 | 벡터 CRUD 동작 |
| **M2.2 임베딩 파이프라인** | BE 시니어 | IndexDefectJob + Artisan 일괄 인덱싱 | 기존 데이터 2만건 인덱싱 완료 |
| **M2.3 하이브리드 검색 API** | BE 시니어 | RagSearchService (Dense + BM25) | 검색 응답 < 3초 |
| **M2.4 AI 요약 답변** | BE 시니어 | RAG → Claude 답변 생성 | 질문 → 관련 사례 + 요약 답변 |
| **M2.5 검색 UI** | FE 시니어 | SearchInput + AiAnswer + SimilarCases | 자연어 검색 → 결과 표시 |
| **M2.6 유사 사례 패널** | FE 주니어 | 하자 상세 내 추천 패널 | 상세 뷰에서 Top 5 사례 표시 |
| **M2.7 AI 피드백 루프** | BE 주니어 + FE 시니어 | 피드백 API + 수정 UI | 사용자 분류 수정 → 피드백 저장 |
| **M2.8 이미지 갤러리** | FE 주니어 | Before/After 비교 뷰 | 이미지 확대, 슬라이드, 비교 |
| **M2.9 히스토리 타임라인** | FE 주니어 | 상태 변경 타임라인 UI | 전체 이력 시각적 표시 |

**Phase 2 완료 기준**: "발코니 도장 박리" 검색 → 유사 5건 + AI 답변, 분류 피드백 동작

### 22.5 Phase 3: Workflow & Dashboard (Week 11-14)

**목표**: 전체 워크플로우 자동화, 대시보드, 리포트 완성

| 마일스톤 | 담당 | 산출물 | 완료 기준 |
|---------|------|--------|---------|
| **M3.1 전체 FSM 완성** | BE 시니어 | 반려/재배정, 일괄 상태 변경 | 전체 상태 전이 경로 테스트 통과 |
| **M3.2 알림 시스템** | BE 주니어 | 이메일 + 알림톡 + 웹 알림 | 상태 변경 시 자동 알림 발송 |
| **M3.3 시공사 전용 뷰** | FE 주니어 | 시공사 대시보드 + 모바일 완료 보고 | 시공사가 모바일로 작업 보고 가능 |
| **M3.4 대시보드** | FE 시니어 + FE 주니어 | KPI 카드, 차트, 성과 테이블 | 실시간 데이터 반영 |
| **M3.5 통계 API** | BE 주니어 | 집계 쿼리, 캐싱 | 대시보드 데이터 1초 이내 응답 |
| **M3.6 엑셀 Import/Export** | BE 주니어 | Laravel Excel 연동 | 일괄 등록 + 에러 리포트, 다운로드 |
| **M3.7 PDF 리포트** | BE 주니어 | DomPDF 기반 리포트 생성 | 일보/시공사별 보고서 PDF |
| **M3.8 디지털 서명** | FE 시니어 | Signature Pad + 검수 확인서 | 검수 시 서명 → PDF 생성 |

**Phase 3 완료 기준**: PENDING→CLOSED 전체 플로우, 대시보드, 리포트 동작

### 22.5-1 Phase 3M: 모바일 현장 관리 앱 (Week 9-18, 병렬)

**목표**: 현장 관리자/점검자 전용 모바일 앱, 카메라 기반 등록, 오프라인 지원

모바일 개발자가 Phase 2 시작 시점부터 병렬로 진행. BE/FE 팀과 API 계약 기반 독립 개발.

| 마일스톤 | 담당 | 산출물 | 완료 기준 |
|---------|------|--------|---------|
| **M3M.1 모바일 UX 설계** | 디자이너 + 모바일 | 모바일 전용 와이어프레임 (5개 탭) | 428px 기준 전체 플로우 확정 |
| **M3M.2 PWA 기반 구축** | 모바일 | Service Worker, 앱 셸, 홈 화면 추가 | 오프라인 기본 셸 동작 |
| **M3M.3 현장 대시보드** | 모바일 | 오늘 업무, 긴급 목록, 미처리 현황 | 10K 데이터 기준 1초 이내 로딩 |
| **M3M.4 카메라 기반 등록** | 모바일 + BE 시니어 | 사진 촬영 → 위치 선택 → AI 분류 (3단계) | 카메라 직접 촬영 → 등록 완료 |
| **M3M.5 내 업무 관리** | 모바일 | 필터 칩, 우선순위 목록, D+ 표시 | 현장 관리자 업무 큐 동작 |
| **M3M.6 검수 워크플로우** | 모바일 | Before/After 비교, 승인/반려 | 모바일에서 검수 완료 프로세스 |
| **M3M.7 오프라인 동기화** | 모바일 | IndexedDB 캐싱, 큐잉, 자동 동기화 | 오프라인 등록 → 온라인 복귀 시 업로드 |
| **M3M.8 푸시 알림** | 모바일 + BE 주니어 | Web Push API, 배지 업데이트 | 긴급 하자 배정 시 즉시 알림 |
| **M3M.9 현장 최적화** | 모바일 + QA | 저대역폭 테스트, 배터리 최적화 | 3G 환경 5초 이내 로딩, 번들 < 500KB |

**Phase 3M 완료 기준**: 현장 관리자가 모바일로 하자 등록 → 업무 확인 → 검수 완료 (오프라인 포함)

### 22.6 Phase 4: SaaS 상품화 (Week 15-20)

**목표**: 구독/결제, 멀티테넌시, 온보딩, 랜딩 페이지, 관리자 콘솔

| 마일스톤 | 담당 | 산출물 | 완료 기준 |
|---------|------|--------|---------|
| **M4.1 멀티테넌시** | BE 시니어 | tenant_id Global Scope + 테넌트 관리 | 테넌트 간 데이터 완전 격리 |
| **M4.2 구독/결제** | BE 시니어 + BE 주니어 | Cashier 또는 토스페이먼츠 연동 | 월/연 구독, 플랜 변경, 해지 |
| **M4.3 플랜별 기능 제한** | BE 주니어 | 미들웨어 + 사용량 미터링 | Free(월 50건), Pro(500건), Enterprise(무제한) |
| **M4.4 온보딩 위저드** | FE 시니어 | 가입 → 프로젝트 설정 → 시공사 → 완료 | 신규 가입 후 5분 내 첫 하자 등록 가능 |
| **M4.5 랜딩 페이지** | FE 주니어 + 디자이너 | 마케팅 랜딩 + 가격표 + FAQ | SEO 최적화, CTA 명확 |
| **M4.6 관리자 콘솔** | BE 주니어 + FE 주니어 | Super Admin 대시보드 | 테넌트/사용량/매출 모니터링 |
| **M4.7 이용약관/정책** | PM + 디자이너 | 이용약관, 개인정보처리방침, 서비스 수준 협약 | 법률 검토 완료 |
| **M4.8 사용자 초대** | BE 주니어 | 이메일 초대 + 역할 지정 | 관리자가 팀원 초대 가능 |
| **M4.9 사용자 가이드** | PM | 도움말 페이지, FAQ, 주요 기능 가이드 | 주요 기능 10개 가이드 |

| **M4.10 모바일 앱 통합** | 모바일 + FE 시니어 | 데스크톱-모바일 데이터 동기화 | 동일 계정으로 데스크톱/모바일 전환 사용 |

**Phase 4 완료 기준**: 신규 회사가 가입 → 결제 → 프로젝트 설정 → 하자 관리 시작 가능 (데스크톱+모바일)

### 22.7 Phase 5: QA & Launch (Week 21-24)

**목표**: 품질 보증, 성능 최적화, 보안 점검, 프로덕션 배포

| 마일스톤 | 담당 | 산출물 | 완료 기준 |
|---------|------|--------|---------|
| **M5.1 E2E 테스트** | QA | Playwright 핵심 15개 시나리오 | 전체 통과 |
| **M5.2 부하 테스트** | QA | Locust 100 동시 사용자 | API P95 < 2초, 에러율 < 1% |
| **M5.3 보안 점검** | QA + BE 시니어 | OWASP 체크리스트, 취약점 스캔 | 크리티컬/하이 이슈 0건 |
| **M5.4 AI 정확도 검증** | BE 시니어 | 라벨링 100건 교차 검증 | 정확도 85%+ |
| **M5.5 성능 최적화** | FE 시니어 + QA | Lighthouse 점검 | LCP < 2.5초, CLS < 0.1 |
| **M5.6 프로덕션 인프라** | QA/DevOps | 서버 구성, 도메인, SSL, CDN | 프로덕션 서버 가동 |
| **M5.7 데이터 이관** | BE 시니어 + QA | 마이그레이션 스크립트 + 검증 | 기존 데이터 이관 완료, 정합성 100% |
| **M5.8 베타 테스트** | PM + 전원 | 실 고객사 1-2곳 베타 운영 | 주요 버그 수정, 피드백 반영 |
| **M5.9 모바일 디바이스 테스트** | 모바일 + QA | iOS Safari, Android Chrome 교차 테스트 | 주요 5개 기기 정상 동작 |
| **M5.10 오프라인 동기화 검증** | 모바일 + QA | 오프라인→온라인 전환 시나리오 테스트 | 데이터 유실 0건 |
| **M5.11 정식 출시** | PM + DevOps | 프로덕션 배포, 모니터링 설정 | 서비스 정상 운영 (데스크톱+모바일) |

**Phase 5 완료 기준**: 외부 고객이 가입하여 데스크톱 및 모바일에서 실제 업무에 사용 가능한 상태

---

## 23. 인력별 투입 시간 상세

### 23.1 주차별 투입 계획 (시간/주)

| 역할 | W1-2 | W3-6 | W7-10 | W11-14 | W15-18 | W19-20 | W21-24 | 합계(h) |
|------|------|------|-------|--------|--------|--------|--------|---------|
| **PM/기획** | 80 | 120 | 120 | 120 | 120 | 80 | 120 | **760** |
| **BE 시니어** | 80 | 160 | 160 | 160 | 160 | 80 | 120 | **920** |
| **BE 주니어** | - | 160 | 160 | 160 | 160 | 80 | 120 | **840** |
| **FE 시니어** | 80 | 160 | 160 | 160 | 160 | 80 | 120 | **920** |
| **FE 주니어** | - | 160 | 160 | 160 | 160 | 60 | 100 | **800** |
| **모바일 개발** | - | - | 40 | 160 | 160 | 160 | 80 | **600** |
| **디자이너** | 80 | 120 | 80 | 80 | 100 | 50 | 60 | **570** |
| **QA/DevOps** | 80 | 80 | 80 | 80 | 80 | 100 | 160 | **660** |
| **주차 합계** | 400 | 960 | 960 | 1,080 | 1,100 | 690 | 880 | **6,070** |

> **변경사항 (v3.0 → v3.1)**: 모바일 개발자 1명 추가, 개발 기간 20주→24주 확장.
> 모바일 현장 관리 앱, 10K+ 규모 대시보드/분석 엔진, AI 인사이트 패널, SLA 관리 확장 반영.

### 23.2 Phase별 투입 시간 요약

| Phase | 기간 | 총 투입 시간 |
|-------|------|------------|
| Phase 0: 사전기획 | 2주 (W1-2) | 400h |
| Phase 1: Foundation | 4주 (W3-6) | 960h |
| Phase 2: AI & RAG | 4주 (W7-10) | 960h |
| Phase 3: Workflow & Dashboard | 4주 (W11-14) | 1,080h |
| Phase 3M: 모바일 앱 (병렬, W9-18) | (10주, 위 Phase와 병렬) | *(모바일 인력은 위 Phase에 포함)* |
| Phase 4: SaaS 상품화 | 6주 (W15-20) | 1,790h |
| Phase 5: QA & Launch | 4주 (W21-24) | 880h |
| **합계** | **24주** | **6,070h** |

### 23.3 역할별 투입 시간 요약

| 역할 | 총 시간 | 주당 평균 | 투입 기간 |
|------|--------|---------|---------|
| PM / 기획 | 760h | 32h | 24주 (풀) |
| BE 시니어 | 920h | 38h | 24주 (풀) |
| BE 주니어 | 840h | 38h | 22주 (W3~W24) |
| FE 시니어 | 920h | 38h | 24주 (풀) |
| FE 주니어 | 800h | 36h | 22주 (W3~W24) |
| 모바일 개발 | 600h | 38h | 16주 (W7~W22) |
| UI/UX 디자이너 | 570h | 24h | 24주 (가변) |
| QA / DevOps | 660h | 28h | 24주 (가변) |
| **전체** | **6,070h** | - | - |

---

## 24. 개발 비용 산정

### 24.1 인건비 산정 기준

```
시간당 단가: ₩30,000 (전 역할 동일 단가 적용)
총 투입 시간: 6,070시간 (v3.0 대비 +1,380시간)
증가 사유: 모바일 개발자 추가 (+600h), 전체 기간 확장 (20주→24주),
          10K+ 스케일 대시보드/분석 엔진/AI 인사이트 확장
```

### 24.2 역할별 인건비

| 역할 | 투입 시간 | 단가 | 소계 |
|------|---------|------|------|
| PM / 기획 | 760h | ₩30,000 | **₩22,800,000** |
| BE 시니어 | 920h | ₩30,000 | **₩27,600,000** |
| BE 주니어 | 840h | ₩30,000 | **₩25,200,000** |
| FE 시니어 | 920h | ₩30,000 | **₩27,600,000** |
| FE 주니어 | 800h | ₩30,000 | **₩24,000,000** |
| 모바일 개발 | 600h | ₩30,000 | **₩18,000,000** |
| UI/UX 디자이너 | 570h | ₩30,000 | **₩17,100,000** |
| QA / DevOps | 660h | ₩30,000 | **₩19,800,000** |
| **인건비 합계** | **6,070h** | | **₩182,100,000** |

### 24.3 인프라 및 외부 서비스 비용 (24주 / 6개월 개발 기간)

| 항목 | 월 비용 | 6개월 합계 | 비고 |
|------|--------|----------|------|
| 클라우드 서버 (AWS/NCP) | ₩350,000 | ₩2,100,000 | 개발/스테이징 + 모바일 테스트 환경 |
| 도메인 + SSL | - | ₩50,000 | 연간 |
| Claude API (Anthropic) | ₩350,000 | ₩2,100,000 | 개발+테스트+베타 (AI 인사이트 포함) |
| OpenAI API (임베딩) | ₩120,000 | ₩720,000 | 2만건 인덱싱 + 검색 |
| 이메일/알림톡/Push | ₩60,000 | ₩360,000 | 개발 기간 + 모바일 푸시 알림 |
| Figma (디자이너) | ₩30,000 | ₩180,000 | Professional 플랜 |
| GitHub/Linear | ₩100,000 | ₩600,000 | 팀 플랜 (8인) |
| Sentry (에러 추적) | ₩50,000 | ₩300,000 | Team 플랜 |
| BrowserStack (모바일 테스트) | ₩50,000 | ₩300,000 | 디바이스 교차 테스트 |
| **인프라 소계** | | **₩6,710,000** | |

### 24.4 기타 비용

| 항목 | 비용 | 비고 |
|------|------|------|
| 법률 자문 (이용약관, 개인정보) | ₩2,000,000 | 1회 |
| 사업자등록/인허가 | ₩500,000 | |
| 모바일 테스트 디바이스 | ₩1,500,000 | iOS + Android 실기기 3-4대 |
| 예비비 (10%) | ₩19,280,000 | 총 비용의 10% 버퍼 |
| **기타 소계** | **₩23,280,000** | |

### 24.5 총 비용 요약

```
┌──────────────────────────────────────────────────────────┐
│              총 개발 비용 산정 (v3.1 개정)                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. 인건비 (8명 × 24주)                                   │
│     6,070시간 × ₩30,000/h            = ₩182,100,000     │
│                                                          │
│  2. 인프라 및 외부 서비스 (6개월)                            │
│     클라우드 + AI API + 도구 + 모바일   =   ₩6,710,000    │
│                                                          │
│  3. 기타 (법률, 사업, 디바이스, 예비비)                      │
│     법률 + 사업 + 디바이스 + 예비비 10% =  ₩23,280,000    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  총 합계                               ₩212,090,000      │
│                                     (약 2억 1,210만원)    │
│                                                          │
│  ※ v3.0 대비 +₩49,400,000 (+30.4%)                      │
│  ※ 증가 요인: 모바일 개발 +₩18M, 기간 확장 +₩23.4M,      │
│    대시보드/분석 고도화 +₩8M                               │
│  ※ 시간당 ₩30,000 동일 단가 기준                          │
│  ※ 인건비가 전체의 85.9%                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 24.6 월별 지출 계획

| 월차 | Phase | 인건비 | 인프라 | 기타 | 월 합계 |
|------|-------|--------|--------|------|--------|
| 1개월 (W1-4) | Phase 0+1 | ₩40,800,000 | ₩1,110,000 | ₩500,000 | **₩42,410,000** |
| 2개월 (W5-8) | Phase 1+2 | ₩28,800,000 | ₩1,110,000 | - | **₩29,910,000** |
| 3개월 (W9-12) | Phase 2+3+3M | ₩30,600,000 | ₩1,110,000 | ₩1,500,000 | **₩33,210,000** |
| 4개월 (W13-16) | Phase 3+3M+4 | ₩32,400,000 | ₩1,110,000 | ₩2,000,000 | **₩35,510,000** |
| 5개월 (W17-20) | Phase 4+5 | ₩28,200,000 | ₩1,110,000 | - | **₩29,310,000** |
| 6개월 (W21-24) | Phase 5 | ₩21,300,000 | ₩1,160,000 | ₩19,280,000 | **₩41,740,000** |
| **합계** | | **₩182,100,000** | **₩6,710,000** | **₩23,280,000** | **₩212,090,000** |

---

## 25. 구독 요금제 설계 (수익 모델)

### 25.1 요금제 구조

| | Free | Pro | Enterprise |
|---|------|-----|-----------|
| **월 요금** | ₩0 | ₩490,000/월 | ₩1,490,000/월 |
| **연 요금 (20% 할인)** | - | ₩4,700,000/년 | ₩14,300,000/년 |
| 프로젝트 수 | 1개 | 5개 | 무제한 |
| 월 하자 등록 | 50건 | 500건 | 무제한 |
| AI 분류 | 50건/월 | 500건/월 | 무제한 |
| RAG 검색 | 20회/월 | 무제한 | 무제한 |
| 사용자 수 | 3명 | 20명 | 무제한 |
| 엑셀 Import/Export | ✓ | ✓ | ✓ |
| PDF 리포트 | - | ✓ | ✓ |
| 커스텀 분류 체계 | - | - | ✓ |
| 전용 지원 | - | 이메일 | 전담 매니저 |
| 데이터 보관 | 6개월 | 2년 | 5년 |
| API 접근 | - | - | ✓ |

### 25.2 손익분기점 분석

```
월 고정 비용 (출시 후 운영):
  서버 인프라:        ₩800,000
  AI API (Claude/OpenAI): ₩1,500,000  (사용량 비례, 평균치)
  도구/SaaS:          ₩300,000
  인력 유지 (3명):     ₩12,000,000  (시니어BE + FE + PM, 시간제)
  ─────────────────────────────
  월 운영 비용:        약 ₩14,600,000

손익분기 (BEP):
  Pro 고객 기준:       ₩14,600,000 ÷ ₩490,000 = 약 30개사
  Enterprise 혼합 시:  Pro 20개사 + Enterprise 3개사 = ₩14,270,000 (근접)

  → Pro 고객 30개사 또는 Pro 20 + Enterprise 3개사에서 BEP 달성
```

### 25.3 투자 회수 기간 (ROI)

```
초기 투자: ₩212,090,000 (개발 비용, v3.1)
월 순이익 (50개사 기준):
  매출: Pro 40 × ₩490,000 + Ent 10 × ₩1,490,000 = ₩34,500,000
  비용: ₩14,600,000
  순이익: ₩19,900,000/월

투자 회수: ₩212,090,000 ÷ ₩19,900,000 ≈ 10.7개월

→ 50개 유료 고객 확보 시 출시 후 약 11개월에 투자금 회수
→ 모바일 앱 포함으로 고객 확보 속도 개선 기대 (현장 즉시 활용 가능)
```

---

## 26. 출시 후 운영 계획

### 26.1 운영 인력 (최소)

| 역할 | 인원 | 업무 | 주당 시간 |
|------|------|------|---------|
| BE/FE 풀스택 | 1명 | 버그 수정, 기능 개선, AI 튜닝 | 40h |
| PM / CS | 1명 | 고객 지원, 피드백 관리, 기획 | 40h |
| DevOps (파트) | 0.5명 | 서버 운영, 모니터링, 보안 | 20h |

### 26.2 월간 운영 사이클

```
Week 1: 고객 피드백 수집 + 버그 수정 (핫픽스)
Week 2: 기능 개선 개발 (스프린트)
Week 3: 개발 + 내부 QA
Week 4: 배포 + 고객 커뮤니케이션 (뉴스레터)
```

### 26.3 분기별 로드맵 (출시 이후)

| 분기 | 주요 기능 |
|------|---------|
| Q1 (출시 후) | 고객 피드백 반영, AI 정확도 개선, 모바일 앱 고도화 (네이티브 전환 검토) |
| Q2 | 입주민 전용 모바일 앱 (하자 신고), 시공사 모바일 앱, 푸시 알림 고도화 |
| Q3 | 예측 분석 (하자 발생 패턴), BI 대시보드 고도화, AI 자동 배정 고도화 |
| Q4 | 외부 ERP 연동 API, 다국어 지원, AR 하자 마킹 (PoC) |

---

**문서 끝**

**다음 단계**: Phase 0 착수 (사전기획)
1. PM: PRD 최종 확정 + 디자이너와 UX 플로우 설계 (모바일 포함)
2. 디자이너: 주요 화면 와이어프레임 + UI 시안 (데스크톱 + 모바일 428px)
3. BE 시니어: API 스펙 작성 + Prism PHP PoC
4. DevOps: Docker Compose + CI/CD 기반 구성
5. 모바일 개발자: PWA 기술 PoC + 오프라인 동기화 아키텍처 검토
