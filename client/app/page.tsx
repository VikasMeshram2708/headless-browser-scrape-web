import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Link } from "lucide-react";
import Image from "next/image";

type Property = {
  title: string;
  price: string;
  rating: string;
  imageUrl: string;
  productLink: string;
};

export default async function Home() {
  const res = await fetch("http://localhost:5000", {
    cache: "force-cache",
  });
  const data: Promise<{ products: Property[] }> = await res.json();
  const products = (await data).products;

  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto">
        {/* <pre>{JSON.stringify(data)}</pre> */}
        <ul className="grid grid-cols-2 mg:grid-col-3 lg:grid-cols-4 gap-4">
          {products &&
            products.map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize line-clamp-1">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative">
                    <Image
                      src={item.imageUrl || ""}
                      alt={item.title}
                      priority
                      sizes="100vw"
                      layout="fill"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Button>
                    <DollarSign />
                    {item.price}
                  </Button>
                  <Button variant={"outline"}>
                    <Link />
                    Direct Link
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </ul>
      </div>
    </main>
  );
}
