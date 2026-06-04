/**
 * Agent Context containing metadata for the execution environment.
 */
export interface AgentContext {
  userId?: string;
  now: Date;
  locale?: string; // e.g., "ko-KR"
}

/**
 * Basic request structure for any agent.
 */
export interface AgentRequest {
  task: string;
  payload: any;
  context: AgentContext;
}

/**
 * Generic request structure for better type safety.
 */
export interface AgentRequestWith<TPayload> extends AgentRequest {
  payload: TPayload;
}

/**
 * Status of the agent execution.
 */
export type AgentStatus = "ok" | "error" | "needs_human";

/**
 * Basic response structure from any agent.
 */
export interface AgentResponse {
  status: AgentStatus;
  result?: any;
  error?: string;
  meta?: Record<string, any>;
}

/**
 * Generic response structure for better type safety.
 */
export interface AgentResponseWith<TResult> extends AgentResponse {
  result?: TResult;
}
