import { NextResponse } from "next/server";
import { stateStore } from "@/lib/stateStore";

export async function GET() {
  const logs = stateStore.getLogs();
  const status = stateStore.getLatestStatus();
  
  return NextResponse.json({
    logs,
    status,
  });
}
