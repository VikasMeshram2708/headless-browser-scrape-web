import express, { Request, Response } from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 5000;

interface Product {
  title: string;
  price: string;
  rating: string;
  imageUrl: string;
  productLink: string;
}

app.get("/", async (req: Request, res: Response) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    
    // Configure page settings
    await page.setDefaultNavigationTimeout(60000);
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

    // Navigate to Amazon
    await page.goto("https://www.amazon.in/s?k=laptop&i=computers", {
      waitUntil: "networkidle2",
    });

    // Wait for critical elements
    await page.waitForSelector(".s-main-slot .puis-card-container");

    // Extract product data
    const products = await page.evaluate((): Product[] => {
      const productCards = Array.from(
        document.querySelectorAll(".puis-card-container")
      );

      return productCards.map((card) => {
        const extractText = (selector: string) => 
          card.querySelector(selector)?.textContent?.trim() ?? "N/A";

        const title = extractText(".a-size-medium.a-color-base.a-text-normal");
        const price = extractText(".a-price .a-offscreen");
        const rating = extractText(".a-icon-star-small .a-icon-alt");
        
        const imageElement = card.querySelector<HTMLImageElement>("img.s-image");
        const linkElement = card.querySelector<HTMLAnchorElement>("a.a-link-normal.s-no-outline");

        return {
          title,
          price,
          rating,
          imageUrl: imageElement?.src || "No image available",
          productLink: linkElement?.href 
            ? `https://www.amazon.in${new URL(linkElement.href).pathname}`
            : "No link available",
        };
      });
    });

    res.header("Content-Type", "application/json");
    res.json({ products });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ 
      error: "Failed to retrieve products",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});