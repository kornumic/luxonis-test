import { NextRequest, NextResponse } from "next/server";
import { apartments } from "@/app/api/apartments/route";

export type InitStatus = "uninitialized" | "initializing" | "ready";

export const getInitStatus = async () => {
  return apartments.length !== 500 ? "initializing" : "ready";
};

export const GET = async (request: NextRequest, res: NextResponse) => {
  const initializationStatus = await getInitStatus();
  return NextResponse.json(initializationStatus, { status: 200 });
};
