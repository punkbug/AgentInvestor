import { AgentRequest, AgentResponse } from "./types";

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  agentName: string;
  task: string;
  request: AgentRequest;
  response: AgentResponse;
}

class StateStore {
  private logs: ExecutionLog[] = [];
  private maxLogs = 100;

  addLog(agentName: string, request: AgentRequest, response: AgentResponse) {
    const log: ExecutionLog = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date(),
      agentName,
      task: request.task,
      request,
      response,
    };
    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  getLogs() {
    return this.logs;
  }

  getLatestStatus() {
    const statusMap: Record<string, any> = {};
    [...this.logs].reverse().forEach((log) => {
      statusMap[log.agentName] = {
        status: log.response.status,
        lastActive: log.timestamp,
        lastTask: log.task,
      };
    });
    return statusMap;
  }
}

export const stateStore = new StateStore();
