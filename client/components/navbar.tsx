import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header className="p-4 border-b shadow shadow-foreground sticky top-0 z-40 bg-background w-full">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        <h2 className="text-xl md:text-2xl lg:text-4xl font-bold">
          <Link href="/">Airbnb Scraped</Link>
        </h2>
        <ul>
          <li>
            <Link href="/comparing">Comparison</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
