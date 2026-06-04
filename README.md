# AgentInvestor: AI Native Asset Management Agent System

본 프로젝트는 한국 주식 시장(KOSPI/KOSDAQ)을 타겟으로 하는 **AI 네이티브 자산운용 에이전트 시스템**의 백엔드 코어입니다. Multi-Agent 아키텍처를 통해 데이터 수집부터 전략 실행까지의 과정을 모듈화하고 자동화하는 것을 목표로 합니다.

---

## 🏗 System Architecture

시스템은 **Supervisor-Worker** 패턴을 따르며, 각 에이전트는 독립적인 책임과 인터페이스를 가집니다.

### Agents
- **Supervisor Agent**: 전체 워크플로 라우팅 및 에이전트 간 오케스트레이션 수행.
- **Market Data Agent**: 시세, 수급(외국인/기관), 종목 마스터 데이터 수집 및 품질 검사(QA).
- **News Agent**: 뉴스 및 공시 분석, 센티먼트 추출 및 주요 이벤트 식별.
- **Screening Agent**: 퀀트/AI 모델을 기반으로 유니버스 필터링 및 종목 점수화.
- **Portfolio Agent**: 포트폴리오 최적화(MVO, Risk Parity 등) 및 리밸런싱 제안.
- **Execution Agent**: 주문 생성, 시뮬레이션 및 거래 로그 기록.

### Core Tech Stack
- **Language**: TypeScript (Strict Mode)
- **Runtime**: Node.js / Next.js
- **LLM**: Google Gemini 1.5 Pro / Flash
- **Tools**: Function Calling (Tool Use) 패턴을 통한 외부 API 및 DB 연동

---

## 📂 Project Structure

```text
src/
├── agents/             # 에이전트별 독립 로직 (Supervisor 및 Worker)
├── lib/                # 공통 라이브러리 (Gemini Client, 전역 타입)
├── tools/              # 외부 인프라 연동 도구 (DB, Market APIs, Logger)
├── scripts/            # 로컬 실행 및 테스트용 유틸리티 스크립트
└── config/             # 환경 설정 및 상수 관리 (예정)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x 이상
- Google AI (Gemini) API Key

### Environment Variables
`.env` 파일을 생성하고 다음 설정을 추가하십시오.
```env
GOOGLE_API_KEY=your_api_key_here
LOG_LEVEL=info # debug, info, warn, error
```

### Run Test Script
기본적인 에이전트 워크플로를 테스트합니다.
```bash
# npx tsx를 사용하여 즉시 실행
npx tsx src/scripts/runAgent.ts
```

---

## 🛠 Development Roadmap (Gohdoh-hwa)

1. **Phase 1: Skeleton & Interface (Done)**
   - 에이전트별 기본 시그니처 및 데이터 규격 확립.
   - Market Data Agent의 데이터 품질 검증(QA) 로직 기초 구현.

2. **Phase 2: Intelligent Reasoning (Next)**
   - News Agent에 Gemini Pro를 연결하여 정성적 데이터 분석 강화.
   - LangGraph 또는 유사 라이브러리를 도입하여 순차적/반복적 에이전트 워크플로 구현.

3. **Phase 3: Real-world Integration**
   - 한국투자증권(KIS) 또는 LS증권 API 연동을 통한 실시간 시세 및 주문 구현.
   - PostgreSQL/Supabase를 통한 시계열 데이터(OHLCV) 영속화.

4. **Phase 4: Optimization & Risk Management**
   - 백테스팅 엔진 엔진 통합.
   - 실거래 승인을 위한 Human-in-the-loop 검증 단계 강화.

---

## ⚖️ Safety & Compliance

- **금융 위험 고지**: 본 코드는 실제 투자 자문을 제공하지 않으며, 투자 결과에 대한 책임은 사용자에게 있습니다.
- **보안**: API Key, 계좌 비밀번호 등 민감 정보는 절대로 소스 코드에 하드코딩하지 마십시오. `.env` 또는 Secrets Manager를 사용하십시오.
- **제약 사항**: 실 운영 환경 투입 전 반드시 리스크 관리 모듈과 규제 준수(Compliance) 검토를 거쳐야 합니다.

---

## 📜 Coding Conventions

- **Official Terminology**: `net_buy_value`, `turnover` 등 금융권 공식 용어를 사용하며, 비공식 약어(fbr, ibr 등) 사용을 금지합니다.
- **Strict Typing**: 모든 인터페이스는 `src/lib/types.ts`에 정의된 규격을 따르며, `any` 타입 사용을 최소화합니다.
