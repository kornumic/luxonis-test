import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const GET = async (request: NextRequest, res: NextResponse) => {
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
};
