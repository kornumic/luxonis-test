import puppeteer, { Browser } from "puppeteer";

let browser: Browser | null;

export type Item = {
  title: string | undefined;
  address: string | undefined;
  price: string | undefined;
  src: string | undefined;
};

export const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
  }
  return browser;
};

export const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
  }
};

export const webScrapper = async (
  baseUrl: string = "https://www.sreality.cz/en/search/for-sale/apartments?page=",
  quantity: number = 500,
  pageSize: number = 20,
) => {
  // const parseElement = (element: Element) => {
  //   const text = element.querySelector("h2")?.innerText;
  //
  //   return { text, author: "Sreality" };
  // };

  const browser = await getBrowser();

  const page = await browser.newPage();
  const maxPage = quantity / pageSize;

  const all: Item[] = [];
  try {
    for (let currentPage = 1; currentPage <= maxPage; currentPage++) {
      const url = baseUrl + currentPage;
      console.log(url);
      await page.goto(url + currentPage, {
        waitUntil: "domcontentloaded",
      });
      console.log("Page loaded");

      await page.waitForSelector("div.property.ng-scope a img", {
        timeout: 10000,
      });

      // Get page data
      const data = await page.evaluate(() => {
        const listItems = Array.from(
          document.querySelectorAll("div.property.ng-scope"),
        );

        const sources: Item[] = listItems.map((listItem) => {
          const img = Array.from(listItem.querySelectorAll("a img"));
          const title = Array.from(listItem.querySelectorAll("h2"));
          const address = Array.from(
            listItem.querySelectorAll(".locality.ng-binding"),
          );
          const price = Array.from(
            listItem.querySelectorAll(".norm-price.ng-binding"),
          );

          const item: Item = {
            title: title[0].innerText.toString(),
            address: address[0].textContent?.toString(),
            price: price[0].textContent?.toString(),
            src: img[0].getAttribute("src")?.toString(),
          };
          return item;
        });
        return [sources];
      });

      all.push(...data[0]);
    }
    console.log(all);
    await closeBrowser();
    console.log("Scrapping is done");
  } catch (err) {
    console.log(err);
    await browser.close();
    console.log(all);
    console.log(all.length);
  }
};
