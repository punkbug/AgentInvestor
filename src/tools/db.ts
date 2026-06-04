export interface MarketBar {
  symbol: string;
  tradeDate: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover: number; // 거래대금
}

export interface InvestorFlowRow {
  symbol: string;
  tradeDate: string;
  foreign_net_buy_shares: number;
  foreign_net_buy_value: number;
  institutional_net_buy_shares: number;
  institutional_net_buy_value: number;
  retail_net_buy_shares: number;
  retail_net_buy_value: number;
}

/**
 * Database interface for market data.
 * Currently implemented as stubs.
 */

export async function saveDailyBars(bars: MarketBar[]): Promise<void> {
  // TODO: Implement Supabase/PG upsert logic
  console.log(`[DB] Saving ${bars.length} daily bars...`);
}

export async function saveInvestorFlows(flows: InvestorFlowRow[]): Promise<void> {
  // TODO: Implement Supabase/PG upsert logic
  console.log(`[DB] Saving ${flows.length} investor flows...`);
}

export async function fetchLatestBars(params: { symbol?: string; limit?: number }): Promise<MarketBar[]> {
  // TODO: Implement DB fetch logic
  console.log(`[DB] Fetching latest bars for ${params.symbol || "all"}...`);
  return [];
}
