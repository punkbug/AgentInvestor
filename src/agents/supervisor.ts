import { AgentRequest, AgentResponse } from "../lib/types";
import { logger } from "../tools/logging";
import { marketDataAgent } from "./marketDataAgent";
import { newsAgent } from "./newsAgent";
import { screeningAgent } from "./screeningAgent";
import { portfolioAgent } from "./portfolioAgent";
import { executionAgent } from "./executionAgent";

/**
 * Supervisor Agent
 * Routes requests to the appropriate sub-agents and orchestrates workflows.
 */
export async function supervisor(req: AgentRequest): Promise<AgentResponse> {
  const prefix = "[Supervisor]";
  logger.logInfo(prefix, `Routing task: ${req.task}`);

  try {
    switch (req.task) {
      case "collect_market_data":
        return await marketDataAgent(req);
      
      case "analyze_news":
        return await newsAgent(req);
      
      case "screen_universe":
        return await screeningAgent(req);
      
      case "build_portfolio":
        return await portfolioAgent(req);
      
      case "execute_orders":
        return await executionAgent(req);

      default:
        logger.logWarn(prefix, `Unknown task received: ${req.task}`);
        return {
          status: "error",
          error: `Unknown task: ${req.task}`,
        };
    }
  } catch (err: any) {
    logger.logError(prefix, `Critical error in supervisor while handling ${req.task}`, err);
    return {
      status: "error",
      error: `Internal Supervisor Error: ${err.message}`,
    };
  }
}
