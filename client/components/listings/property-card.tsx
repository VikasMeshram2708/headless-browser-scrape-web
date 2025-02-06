"use client";

import React, { useState } from "react";
import { Listing } from "@/app/page";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical, Link } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComparisonStore } from "@/app/store";
import { refineUrl } from "@/lib/refineImageUrl";

type PropertyCardProps = {
  listings: Listing[];
};

function refinePrice(value: string) {
  const price = parseFloat(value).toFixed(2);

  if (isNaN(+price)) {
    return "Invalid price";
  }

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(+price);

  return formattedPrice;
}

export default function PropertyCard({ listings }: PropertyCardProps) {
  const [filter, setFilter] = useState<string>("");

  // Compare Fn
  const compareFn = useComparisonStore(
    (state) => state.addPropertyToComparison
  );

  // Sort the listings based on the selected filter
  const sortedListings = [...listings].sort((a, b) => {
    if (filter === "low-to-high") {
      return parseFloat(a.price) - parseFloat(b.price);
    } else if (filter === "high-to-low") {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    return 0; // Default: no sorting
  });

  return (
    <div className="container mx-auto px-6 py-2">
      <section className="py-5 flex justify-between items-center">
        <h1 className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold">
          Latest Drops
        </h1>
        <Select onValueChange={(value) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low-to-high">Low to High</SelectItem>
            <SelectItem value="high-to-low">High to Low</SelectItem>
          </SelectContent>
        </Select>
      </section>

      {/* Property Cards */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedListings &&
          sortedListings.map((item, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-lg capitalize line-clamp-1">
                    {item.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          compareFn(item.id);
                          alert("Added to comparison list");
                        }}
                      >
                        Add to compare list
                      </DropdownMenuItem>
                      <DropdownMenuItem>User Sentiment</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative">
                  <Image
                    src={refineUrl(item.imageUrl) || ""}
                    alt={item.title}
                    priority
                    sizes="100vw"
                    fill
                    className="hover:scale-105 transition duration-300"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button className="rounded-lg">
                  {refinePrice(item.price)}
                </Button>
                <Button variant={"outline"} asChild>
                  <a href={item.listingLink} target="_blank">
                    <Link />
                    Direct Link
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </ul>
    </div>
  );
}
