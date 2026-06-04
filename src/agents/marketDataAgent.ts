import { AgentRequest, AgentResponse, AgentStatus } from "../lib/types";
import { logger } from "../tools/logging";
import * as marketApis from "../tools/marketApis";
import * as db from "../tools/db";

export interface MarketDataPayload {
  markets: ("KOSPI" | "KOSDAQ")[];
  dateRange?: { start: string; end: string };
  dataTypes: ("price" | "investor_flows" | "instrument_master")[];
  sessionType?: "REGULAR" | "PRE_MARKET" | "AFTER_HOURS" | "END_OF_DAY";
  priority?: "low" | "normal" | "high";
}

/**
 * Market Data Agent
 * Responsible for collecting, normalizing, and quality-checking market data.
 */
export async function marketDataAgent(req: AgentRequest): Promise<AgentResponse> {
  const prefix = "[MarketDataAgent]";
  logger.logInfo(prefix, `Processing task: ${req.task}`);

  if (req.task !== "collect_market_data") {
    return {
      status: "error",
      error: `Unsupported task: ${req.task}`,
    };
  }

  const payload = req.payload as MarketDataPayload;

  // 1. Validation
  if (!payload.markets || !Array.isArray(payload.markets)) {
    return { status: "error", error: "Missing or invalid 'markets' in payload." };
  }
  if (!payload.dataTypes || !Array.isArray(payload.dataTypes)) {
    return { status: "error", error: "Missing or invalid 'dataTypes' in payload." };
  }

  const qualityIssues: string[] = [];
  const results: any = {
    processedMarkets: [],
    savedRecords: 0,
  };

  try {
    const tradeDate = payload.dateRange?.end || req.context.now.toISOString().split("T")[0];

    for (const market of payload.markets) {
      logger.logInfo(prefix, `Collecting data for ${market} on ${tradeDate}`);

      if (payload.dataTypes.includes("instrument_master")) {
        const master = await marketApis.fetchInstrumentMaster(market);
        // Process and save...
      }

      if (payload.dataTypes.includes("price")) {
        const bars = await marketApis.fetchDailyBars({ market, tradeDate });
        
        // Quality Check
        const validBars = bars.filter((bar) => {
          if (bar.open <= 0 || bar.high <= 0 || bar.low <= 0 || bar.close <= 0) {
            qualityIssues.push(`Invalid price for ${bar.symbol}: ${bar.open}/${bar.high}/${bar.low}/${bar.close}`);
            return false;
          }
          if (bar.high < bar.low || bar.high < bar.open || bar.high < bar.close || bar.low > bar.open || bar.low > bar.close) {
            qualityIssues.push(`Inconsistent OHLC for ${bar.symbol}`);
            return false;
          }
          return true;
        });

        await db.saveDailyBars(validBars);
        results.savedRecords += validBars.length;
      }

      if (payload.dataTypes.includes("investor_flows")) {
        const flows = await marketApis.fetchInvestorFlows({ market, tradeDate });
        // Simple quality check for flows if needed
        await db.saveInvestorFlows(flows);
        results.savedRecords += flows.length;
      }

      results.processedMarkets.push(market);
    }

    const status: AgentStatus = qualityIssues.length > 0 ? "needs_human" : "ok";

    return {
      status,
      result: results,
      meta: {
        qualityIssues: qualityIssues.length > 0 ? qualityIssues : undefined,
        tradeDate,
      },
    };
  } catch (err: any) {
    logger.logError(prefix, "Error during market data collection", err);
    return {
      status: "error",
      error: err.message,
    };
  }
}
