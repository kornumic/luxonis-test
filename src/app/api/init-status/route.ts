import { NextRequest, NextResponse } from "next/server";
import { apartments } from "@/app/api/apartments/route";
import { getInitStatus } from "@/lib/db/schema";

export type InitStatus = "uninitialized" | "initializing" | "ready";

export const GET = async (request: NextRequest, res: NextResponse) => {
  const initializationStatus = await getInitStatus();
  return NextResponse.json(initializationStatus, { status: 200 });
};
