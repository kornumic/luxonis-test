import puppeteer, { Browser, Page } from "puppeteer";
import { ApartmentInsertModel } from "@/lib/db/schema";

let browser: Browser | null;

const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
    });
    console.log("Browser initialized.");
  }
  return browser;
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    console.log("Browser closed.");
  }
};

/**
 * Scrapes data from loaded page. Waits for selector to appear.
 * @param page
 */
const scrapeData = async (page: Page): Promise<ApartmentInsertModel[]> => {
  if (!page) throw new Error("Page is null.");

  await page.waitForSelector("div.property.ng-scope a img", {
    timeout: 10000,
  });

  return await page.evaluate(() => {
    const listItems = Array.from(
      document.querySelectorAll("div.property.ng-scope"),
    );

    const sources: ApartmentInsertModel[] = listItems.map(
      (listItem): ApartmentInsertModel => {
        const src = listItem.querySelector("a img");
        const title = listItem.querySelector("h2");
        const address = listItem.querySelector(".locality.ng-binding");
        const price = listItem.querySelector(".norm-price.ng-binding");

        return {
          title: title?.innerText.toString() || "",
          address: address?.textContent?.toString() || "",
          price: price?.textContent?.toString() || "",
          src: src?.getAttribute("src")?.toString() || "",
        };
      },
    );
    return sources;
  });
};

/**
 * Scrapes data from https://sreality.cz. Returns array of scraped items.
 * @param quantity - number of items to scrape, default 500
 */
const webScrapper = async (
  quantity: number = 500,
): Promise<ApartmentInsertModel[]> => {
  if (quantity < 1) {
    throw new Error("Invalid quantity parameter.");
  }

  const all: ApartmentInsertModel[] = [];

  try {
    console.log("Initializing web scrapper...");

    const baseUrl: string =
      "https://www.sreality.cz/en/search/for-sale/apartments?page=";
    const browser = await getBrowser();
    const page = await browser.newPage();
    const maxPage = Math.ceil(quantity / 20);

    console.log("Scraping data from sreality.cz...");

    for (let currentPage = 1; currentPage <= maxPage; currentPage++) {
      const url = baseUrl + currentPage;
      await page.goto(url, {
        waitUntil: "domcontentloaded",
      });
      const data = await scrapeData(page);
      all.push(...data);
    }
    console.log("Successfully scraped " + all.length + " items.");
  } catch (err) {
    throw new Error("An error occurred while scraping data.");
  } finally {
    await closeBrowser();
  }

  if (all.length < quantity) {
    throw new Error("Not enough data scraped (scraped " + all.length + ").");
  }
  return all.length > quantity ? all.slice(0, quantity) : all;
};

export default webScrapper;
