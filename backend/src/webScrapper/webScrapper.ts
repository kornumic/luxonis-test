import puppeteer, { Browser, Page } from "puppeteer";

let browser: Browser | null;

export type Item = {
  title: string;
  address: string;
  price: string;
  src: string;
};

const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
    });
  }
  return browser;
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
  }
};

/**
 * Scrapes data from loaded page. Waits for selector to appear.
 * @param page
 */
const scrapeData = async (page: Page) => {
  await page.waitForSelector("div.property.ng-scope a img", {
    timeout: 10000,
  });

  return await page.evaluate(() => {
    const listItems = Array.from(
      document.querySelectorAll("div.property.ng-scope"),
    );

    const sources: Item[] = listItems.map((listItem): Item => {
      const img = listItem.querySelector("a img");
      const title = listItem.querySelector("h2");
      const address = listItem.querySelector(".locality.ng-binding");
      const price = listItem.querySelector(".norm-price.ng-binding");

      return {
        title: title?.innerText.toString() || "",
        address: address?.textContent?.toString() || "",
        price: price?.textContent?.toString() || "",
        src: img?.getAttribute("src")?.toString() || "",
      };
    });
    return sources;
  });
};

const webScrapper = async (
  quantity: number = 500,
  baseUrl: string = "https://www.sreality.cz/en/search/for-sale/apartments?page=",
  pageSize: number = 20,
) => {
  console.log("Initializing web scrapper ...");

  const browser = await getBrowser();
  const page = await browser.newPage();
  const maxPage = quantity / pageSize;
  const all: Item[] = [];

  console.log("Scraping data from sreality.cz ...");
  try {
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
    console.log("Could not scrape data from sreality.cz");
  } finally {
    await closeBrowser();
  }
  return all;
};

export default webScrapper;
