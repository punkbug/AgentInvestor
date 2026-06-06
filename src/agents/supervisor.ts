import { AgentRequest, AgentResponse } from "../lib/types";
import { logger } from "../tools/logging";
import { stateStore } from "../lib/stateStore";
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

  let response: AgentResponse;

  try {
    switch (req.task) {
      case "collect_market_data":
        response = await marketDataAgent(req);
        break;
      
      case "analyze_news":
        response = await newsAgent(req);
        break;
      
      case "screen_universe":
        response = await screeningAgent(req);
        break;
      
      case "build_portfolio":
        response = await portfolioAgent(req);
        break;
      
      case "execute_orders":
        response = await executionAgent(req);
        break;

      default:
        logger.logWarn(prefix, `Unknown task received: ${req.task}`);
        response = {
          status: "error",
          error: `Unknown task: ${req.task}`,
        };
    }
  } catch (err: any) {
    logger.logError(prefix, `Critical error in supervisor while handling ${req.task}`, err);
    response = {
      status: "error",
      error: `Internal Supervisor Error: ${err.message}`,
    };
  }

  // Record reasoning for Supervisor
  response.reasoning = response.reasoning || `Routing decision: Task '${req.task}' has been assigned to the corresponding agent. Status: ${response.status}`;
  stateStore.addLog("Supervisor", req, response);
  
  return response;
}
