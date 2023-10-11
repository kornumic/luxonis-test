import { NextRequest, NextResponse } from "next/server";
import { getApartments, initialize } from "@/lib/db";

export const GET = async (request: NextRequest, res: NextResponse) => {
  try {
    await initialize();

    const page = +(request.nextUrl.searchParams.get("page") || "1");
    const perPage = +(request.nextUrl.searchParams.get("perPage") || "20");
    const offset = (page - 1) * perPage;
    const selectedApartments = await getApartments(offset, perPage);

    return NextResponse.json(selectedApartments, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
