import { NextRequest, NextResponse } from "next/server";
import { ApartmentData } from "@/components/ApartmentItem";
import webScrapper from "@/lib/web-scrapper";
import { getInitStatus } from "@/lib/db/schema";

export let apartments: ApartmentData[] = [];

export const GET = async (request: NextRequest, res: NextResponse) => {
  const quantity = 500;
  const initializationStatus = await getInitStatus();
  if (initializationStatus === "initializing") {
    const items = await webScrapper(quantity);
    apartments = items.map((item) => {
      const apartment: ApartmentData = {
        ...item,
        id: +Math.random().toString(),
      };
      return apartment;
    });
  }

  try {
    const page = +(request.nextUrl.searchParams.get("page") || "1");
    const perPage = +(request.nextUrl.searchParams.get("perPage") || "20");
    const offset = (page - 1) * perPage;
    const selectedApartments = apartments.slice(offset, offset + perPage);

    return NextResponse.json(selectedApartments, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
