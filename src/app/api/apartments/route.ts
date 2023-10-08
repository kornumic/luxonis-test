import { NextRequest, NextResponse } from "next/server";
import { ApartmentData } from "@/components/ApartmentItem";
import webScrapper from "@/util/webScrapper";

let apartments: ApartmentData[] = [
  {
    id: 1,
    title: "Apartment 1",
    address: "Address 1",
    price: "Price 1",
    src: "https://d18-a.sdn.cz/d_18/c_img_QI_Jh/4ZEBMXA.jpeg?fl=res,400,300,3|shr,,20|jpg,90",
  },
  {
    id: 2,
    title: "Apartment 2",
    address: "Address 2",
    price: "Price 2",
    src: "https://d18-a.sdn.cz/d_18/c_img_QI_Jh/4ZEBMXA.jpeg?fl=res,400,300,3|shr,,20|jpg,90",
  },
];

export const GET = async (req: NextRequest, res: NextResponse) => {
  if (apartments.length !== 500) {
    await webScrapper(500).then((items) => {
      apartments = items.map((item) => {
        const apartment: ApartmentData = {
          ...item,
          id: +Math.random().toString(),
        };
        return apartment;
      });
    });
  }

  try {
    // const apartments = await ApartmentModel.findAll();
    // const page = req.query.page || "1";
    // const perPage = req.query.perPage || "20";
    // const offset = (+page - 1) * +perPage;
    // const selectedApartments = apartments.slice(offset, +perPage);

    console.log("Sending apartments...");
    return NextResponse.json(apartments);
  } catch (err) {}
};
