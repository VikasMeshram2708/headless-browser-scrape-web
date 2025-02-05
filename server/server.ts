import express, { Request, Response } from "express";
import puppeteer from "puppeteer";

const app = express();

app.get("/", async (req: Request, res: Response) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(60000);
    await page.goto(
      "https://www.amazon.in/s?k=laptop&i=computers",
      { waitUntil: "domcontentloaded" }
    );

    await page.waitForSelector(".s-main-slot");

    // Extract product details
    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".s-main-slot .s-result-item"));

      return items.map((item) => {
        const titleElement = item.querySelector(".s-title-instructions-style h2 span") as HTMLElement;
        const priceElement = item.querySelector(".a-price .a-offscreen") as HTMLElement;
        const ratingElement = item.querySelector(".a-icon-star-small span") as HTMLElement;
        const imageElement = item.querySelector("img") as HTMLImageElement;
        const productLinkElement = item.querySelector(".s-title-instructions-style a") as HTMLAnchorElement;

        return {
          title: titleElement ? titleElement.innerText.trim() : "No Title",
          price: priceElement ? priceElement.innerText.trim() : "No Price",
          rating: ratingElement ? ratingElement.innerText.trim() : "No Rating",
          imageUrl: imageElement ? imageElement.src : "No Image",
          productLink: productLinkElement ? "https://www.amazon.in" + productLinkElement.getAttribute("href") : "No Link",
        };
      });
    });

    await browser.close();
    res.json({ products });
  } catch (error) {
    console.error("Error scraping data:", error);
    res.status(500).json({ error: "Failed to scrape product data" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
