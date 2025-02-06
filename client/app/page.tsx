import PropertyCard from "@/components/listings/property-card";
import { Suspense } from "react";

export type Listing = {
  title: string;
  price: string;
  rating: string;
  imageUrl: string;
  listingLink: string;
};

export const revalidate = 60;

export default async function Home() {
  const res = await fetch(
    `http://localhost:5000/listings?take=${10}&skip=${10}`
  );
  const propertyData: {
    meta: { total: number; totalListed: number; data: Listing[] };
  } = await res.json();
  // const data: { listings: Listing[] } = await res.json();

  // console.log("pd", propertyData.listings);

  if (!propertyData.meta.data) {
    return (
      <main className="min-h-screen w-full">
        <h1 className="text-center text-xl font-bold">No listed properties</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto">
        {/* <pre>{JSON.stringify(propertyData.meta.data, null, 2)}</pre> */}
        <div className="py-10">
          <Suspense fallback={<p>Processing...</p>}>
            <PropertyCard listings={propertyData.meta.data} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
