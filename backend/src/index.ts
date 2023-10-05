import webScrapper from "./webScrapper/webScrapper";

webScrapper(500).then((items) => console.log(items.length));
