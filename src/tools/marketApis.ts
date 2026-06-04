import { MarketBar, InvestorFlowRow } from "./db";

export interface FetchDailyBarsParams {
  market: "KOSPI" | "KOSDAQ";
  tradeDate: string; // "YYYY-MM-DD"
}

export interface FetchInvestorFlowsParams {
  market: "KOSPI" | "KOSDAQ";
  tradeDate: string;
}

/**
 * Fetch daily price bars from external API.
 */
export async function fetchDailyBars(params: FetchDailyBarsParams): Promise<MarketBar[]> {
  // TODO: KRX/KIS API 연동
  console.log(`[MarketAPI] Fetching daily bars for ${params.market} on ${params.tradeDate}...`);
  return []; // Mock return
}

/**
 * Fetch investor net purchases (flows) from external API.
 */
export async function fetchInvestorFlows(params: FetchInvestorFlowsParams): Promise<InvestorFlowRow[]> {
  // TODO: KRX/KIS API 연동
  console.log(`[MarketAPI] Fetching investor flows for ${params.market} on ${params.tradeDate}...`);
  return []; // Mock return
}

/**
 * Fetch instrument master data (symbols, names, etc.)
 */
export async function fetchInstrumentMaster(market: "KOSPI" | "KOSDAQ"): Promise<any[]> {
  // TODO: KRX/KIS API 연동
  console.log(`[MarketAPI] Fetching instrument master for ${market}...`);
  return [];
}
