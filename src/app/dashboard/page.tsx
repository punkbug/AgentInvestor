"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/agent-logs");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Agent Dashboard...</div>;

  const agents = [
    "Supervisor",
    "MarketDataAgent",
    "NewsAgent",
    "ScreeningAgent",
    "PortfolioAgent",
    "ExecutionAgent",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">AI Native Asset Management Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
      </header>

      {/* Agent Status Grid */}
      <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {agents.map((name) => {
          const info = data?.status?.[name];
          const statusColor = info?.status === "ok" ? "bg-green-500" : info?.status === "needs_human" ? "bg-yellow-500" : info?.status === "error" ? "bg-red-500" : "bg-gray-300";
          
          return (
            <div key={name} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className={`h-3 w-3 rounded-full ${statusColor}`} />
                <span className="text-xs font-medium text-gray-400">AGENT</span>
              </div>
              <h3 className="mb-1 font-bold text-gray-800">{name}</h3>
              <p className="text-xs text-gray-500">{info?.lastTask || "Idle"}</p>
              {info?.lastActive && (
                <p className="mt-3 text-[10px] text-gray-400">
                  {new Date(info.lastActive).toLocaleTimeString()}
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* Execution Logs */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-gray-800">Execution History & Reasoning</h2>
        <div className="space-y-4">
          {data?.logs?.map((log: any) => (
            <div key={log.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-indigo-600">[{log.agentName}]</span>
                  <span className="text-sm font-medium text-gray-700">{log.task}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  <span className={`rounded px-2 py-0.5 font-bold uppercase ${log.response.status === "ok" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {log.response.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Reasoning & Decision Basis</h4>
                  <p className="rounded-lg bg-indigo-50 p-4 text-sm leading-relaxed text-indigo-900">
                    {log.response.reasoning || "No reasoning provided."}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Payload</h4>
                    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-[11px] text-gray-300">
                      {JSON.stringify(log.request.payload, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Result Summary</h4>
                    <pre className="overflow-x-auto rounded-lg bg-gray-800 p-4 text-[11px] text-gray-400">
                      {JSON.stringify(log.response.result || log.response.error, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!data?.logs || data.logs.length === 0) && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-20 text-center text-gray-400">
              No execution logs found. Run the agent system to see data.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
