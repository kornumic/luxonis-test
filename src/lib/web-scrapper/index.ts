import { ApartmentInsertModel } from "@/lib/db/schema";
import axios from "axios";

const transform = (rawData: any): ApartmentInsertModel[] => {
  const estates = rawData._embedded.estates;
  return estates.map((estate: any): ApartmentInsertModel => {
    const title = estate.name || "Estate";
    const address = estate.locality || "Address not provided";
    const price_raw = estate.price
      ? estate.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      : "1";
    const price =
      price_raw !== "1"
        ? "Total price: " + price_raw + " CZK"
        : "Information about price at agency";
    const images = estate._links.images;
    const src = images[0].href;

    return {
      title,
      address,
      price,
      src,
    };
  });
};

const scrape = async (quantity: number = 500): Promise<any> => {
  try {
    const response = await axios.get(
      "https://www.sreality.cz/api/en/v2/estates",
      {
        headers: {
          "Content-Type": "application/hal+json",
        },
        params: {
          category_main_cb: 1,
          category_type_cb: 1,
          per_page: quantity,
        },
        timeout: 10000,
      },
    );
    return response.data;
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
    return {};
  }
};

const webScrapper = async (
  quantity: number = 500,
): Promise<ApartmentInsertModel[]> => {
  let transformedApartments: ApartmentInsertModel[] = [];
  try {
    const rawData = await scrape();
    transformedApartments = transform(rawData).slice(0, quantity);
  } catch (error) {
    console.log(error);
    throw new Error("Could not scrape data from sreality.cz");
  }

  return transformedApartments;
};

export default webScrapper;
