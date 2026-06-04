import { supervisor } from "../agents/supervisor";
import { AgentRequest } from "../lib/types";

/**
 * Test script to run the Supervisor Agent locally.
 * Usage: npx tsx src/scripts/runAgent.ts
 */

async function main() {
  console.log("=== AI Native Asset Management Agent System - Test Run ===\n");

  const request: AgentRequest = {
    task: "collect_market_data",
    payload: {
      markets: ["KOSPI"],
      dataTypes: ["price", "investor_flows"],
      priority: "normal",
    },
    context: {
      userId: "test-user-01",
      now: new Date(),
      locale: "ko-KR",
    },
  };

  try {
    const response = await supervisor(request);
    console.log("\n--- Agent Response ---");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Execution failed:", error);
  }
}

/**
 * SAFETY & COMPLIANCE NOTICE:
 * 1. 이 코드는 실제 투자 자문이나 매매를 수행하지 않는 개발용/연구용 뼈대 코드입니다.
 * 2. 실 계좌 API 키를 코드에 하드코딩하지 마십시오.
 * 3. 실제 운영에는 별도의 위험관리, 규제준수 검토, 사람 승인 절차가 반드시 필요합니다.
 */

main().catch(console.error);
