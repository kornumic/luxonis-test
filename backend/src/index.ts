import webScrapper from "./webScrapper/webScrapper";
import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.use("/", (req, res, next) => {
  res.send("Hello World!");
});

webScrapper(500).then((items) => console.log(items.length));
