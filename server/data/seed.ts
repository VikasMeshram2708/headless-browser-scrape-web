import prisma from "../lib/prisma";

type Listing = {
  title: string;
  price: string;
  rating: string;
  imageUrl: string;
  listingLink: string;
};

async function seed() {
  try {
    const res = await fetch("http://localhost:5000");

    if (!res.ok) {
      throw new Error(`Failed to fetch listings: ${res.statusText}`);
    }

    const listingsData: { listings: Listing[] } = await res.json();

    if (listingsData && listingsData.listings) {
      await prisma.property.createMany({
        data: listingsData.listings,
      });
      console.log("Seed completed successfully!");
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();