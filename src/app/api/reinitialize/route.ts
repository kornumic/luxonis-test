import { NextRequest, NextResponse } from "next/server";
import { deleteApartments, getApartmentCount } from "@/lib/db";
import { InitStatus } from "@/app/page";

export const POST = async (request: NextRequest, res: NextResponse) => {
  await deleteApartments();

  return NextResponse.json({ status: 204 });
};

export const dynamic = 'force-dynamic';