import { NextRequest, NextResponse } from "next/server";
import { getApartmentCount } from "@/lib/db";
import { InitStatus } from "@/app/page";

export const GET = async (request: NextRequest, res: NextResponse) => {
  const count = await getApartmentCount();
  const state: InitStatus = count < 500 ? "initializing" : "initialized";

  return NextResponse.json(state, { status: 200 });
};

export const dynamic = 'force-dynamic';