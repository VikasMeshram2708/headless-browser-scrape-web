/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Listing } from "@/app/page";
import { useComparisonStore } from "@/app/store";
import { refineUrl } from "@/lib/refineImageUrl";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Comparing = () => {
  const lists = useComparisonStore((state) => state.comparisonList);
  const filterFn = useComparisonStore((state) => state.filterPropertyList);
  const removeProperty = useComparisonStore((state) => state.removePropertyFromComparison);
  const [properties, setProperties] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lists.length === 0) return;

    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await Promise.all(lists.map((id) => filterFn(id)));
        setProperties(result.filter((item): item is Listing => item !== null)); // Type-safe filtering
      } catch (err) {
        setError("Failed to fetch property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [lists, filterFn]);

  return (
    <div className="min-h-screen w-full px-4 py-8">
      <h1 className="text-3xl font-semibold text-center">Comparing Properties</h1>

      {loading && <p className="mt-4 text-xl text-gray-500 text-center">Loading...</p>}
      {error && <p className="mt-4 text-xl text-red-500 text-center">{error}</p>}

      {properties.length > 0 ? (
        <div className="mt-8 overflow-x-auto container mx-auto px-6 py-2">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 border">Feature</th>
                {properties.map((property) => (
                  <th key={property.id} className="p-4 border text-center relative">
                    <Image
                      src={refineUrl(property.imageUrl)}
                      alt={property.title}
                      width={100}
                      height={100}
                      className="mx-auto rounded-md"
                      priority
                    />
                    <p className="font-semibold">{property.title}</p>
                    <button
                      onClick={() => removeProperty(property.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border">Price 💰</td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 border text-center font-semibold">
                    {property.price}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border">Rating ⭐</td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 border text-center">
                    {property.rating}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border">Date Listed 📅</td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 border text-center">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border">View Listing 🔗</td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 border text-center">
                    <a
                      href={property.listingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-lg text-gray-500 text-center mt-4">No properties to compare.</p>
      )}
    </div>
  );
};

export default Comparing;
