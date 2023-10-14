import { NextRequest, NextResponse } from "next/server";
import { deleteApartments } from "@/lib/db";

export const POST = async (request: NextRequest, res: NextResponse) => {
  await deleteApartments();

  return NextResponse.json({ status: 204 });
};

export const dynamic = "force-dynamic";
