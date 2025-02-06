import express, { Request, Response } from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 5000;

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
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to Airbnb
    await page.goto("https://www.airbnb.co.in/", {
      waitUntil: "networkidle2",
    });

    // Wait for critical elements
    await page.waitForSelector("[itemprop='itemListElement']");

    // Extract listing data
    const listings = await page.evaluate(() => {
      const listedProperty = Array.from(
        document.querySelectorAll("[itemprop='itemListElement']")
      );

      return listedProperty.map((card) => {
        const extractText = (selector: string) =>
          card.querySelector(selector)?.textContent?.trim() ?? "N/A";

        const title = extractText("[data-testid='listing-card-title']");
        const priceText = extractText("[data-testid='price-availability-row']");
        const ratingText = extractText(".t1a9j9y7");

        // Extract the numerical price using a regular expression
        const priceMatch = priceText.match(/(\d[\d,]*)/);
        const price = priceMatch ? priceMatch[0].replace(/,/g, '') : "N/A";

        // Extract the numerical rating using a regular expression
        const ratingMatch = ratingText.match(/(\d+\.\d+)/);
        const rating = ratingMatch ? ratingMatch[0] : "N/A";

        const imageElement = card.querySelector<HTMLImageElement>("img");
        const linkElement = card.querySelector<HTMLAnchorElement>("a");

        return {
          title,
          price,
          rating,
          imageUrl: imageElement?.src || "No image available",
          listingLink: linkElement?.href || "No link available",
        };
      });
    });

    res.header("Content-Type", "application/json");
    
    res.json({ listings });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({
      error: "Failed to retrieve listings",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});