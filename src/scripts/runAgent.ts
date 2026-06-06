import { supervisor } from "../agents/supervisor";
import { AgentRequest } from "../lib/types";

/**
 * Test script to run a full sequence of Agents locally.
 * Usage: npx tsx src/scripts/runAgent.ts
 */

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("=== AI Native Asset Management Agent System - Full Sequence Run ===\n");

  const context = {
    userId: "test-user-01",
    now: new Date(),
    locale: "ko-KR",
  };

  const tasks: AgentRequest[] = [
    {
      task: "collect_market_data",
      payload: { markets: ["KOSPI"], dataTypes: ["price", "investor_flows"] },
      context
    },
    {
      task: "analyze_news",
      payload: { symbols: ["005930"], lookbackDays: 1 },
      context
    },
    {
      task: "screen_universe",
      payload: { criteria: "value_growth_mix" },
      context
    },
    {
      task: "build_portfolio",
      payload: { riskTolerance: "medium" },
      context
    },
    {
      task: "execute_orders",
      payload: { simulation: true },
      context
    }
  ];

  for (const request of tasks) {
    console.log(`\n>>> Executing Task: ${request.task}`);
    try {
      const response = await supervisor(request);
      console.log(`Status: ${response.status}`);
      console.log(`Reasoning: ${response.reasoning}`);
      await sleep(1000); // Wait a bit between tasks for dashboard visualization
    } catch (error) {
      console.error(`Execution failed for ${request.task}:`, error);
    }
  }

  console.log("\n=== Sequence Completed. Check the Dashboard for details. ===");
}

main().catch(console.error);
