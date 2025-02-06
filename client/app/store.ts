import { create } from "zustand";
import { persist } from "zustand/middleware";

type Listing = {
  id: string;
  title: string;
  rating: string;
  price: string;
  imageUrl: string;
  listingLink: string;
  createdAt: string;
  updatedAt: string;
};

type ComparisonStore = {
  comparisonCount: number;
  comparisonList: string[];
  addPropertyToComparison: (propertyId: string) => void;
  clearComparisonList: () => void;
  filterPropertyList: (propertyId: string) => Promise<Listing | null>;
  removePropertyFromComparison: (propertyId: string) => void;
};

export const useComparisonStore = create(
  persist<ComparisonStore>(
    (set) => ({
      comparisonCount: 0,
      comparisonList: [],
      addPropertyToComparison: (propertyId: string) => {
        set((state) => {
          // Prevent adding duplicate property
          if (state.comparisonList.includes(propertyId)) {
            return state; // No update if already in the list
          }
          return {
            comparisonList: [...state.comparisonList, propertyId], // Add as an array item, not as a string
            comparisonCount: state.comparisonCount + 1,
          };
        });
      },
      filterPropertyList: async (propertyId: string) => {
        try {
          const res = await fetch("http://localhost:5000/listings");
          if (!res.ok) throw new Error("Failed to fetch listings");

          const propertyData: {
            meta: { total: number; totalListed: number; data: Listing[] };
          } = await res.json();

          const filtered = propertyData.meta.data.find(
            (item) => item.id === propertyId
          );

          console.log("Filtered Property:", filtered);

          return filtered || null;
        } catch (error) {
          console.error("Error fetching listings:", error);
          return null;
        }
      },
      removePropertyFromComparison: (propertyId) => {
        try {
          const filtered = set((state) => ({
            comparisonList: state.comparisonList.filter(
              (id) => id !== propertyId
            ),
          }));
          return filtered;
        } catch (error) {
          console.error("Error fetching listings:", error);
          return null;
        }
      },
      clearComparisonList: () =>
        set({ comparisonList: [], comparisonCount: 0 }),
    }),
    {
      name: "comparison-storage", // Key used in localStorage
    }
  )
);
