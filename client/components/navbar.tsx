import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header className="p-4 border-b shadow-lg max-w-7xl sticky top-0 z-40 bg-background mx-auto w-full">
      <h2 className="text-xl md:text-2xl lg:text-4xl font-bold">
        <Link href="/">Amazon Scraped</Link>
      </h2>
    </header>
  );
}
