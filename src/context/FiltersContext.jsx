import { createContext, useContext, useState } from "react";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    selectedCategory: "All",
    selectedAge: "All",
    selectedPrice: "All",
    searchQuery: "",
    sortOption: "",
    advancedFilters: {
      inStockOnly: false,
      sameDayOnly: false,
      ratingMin: 0,
      brands: [],
      sizes: [],
      colors: [],
      labels: [],
      priceMin: 0,
      priceMax: Infinity,
      discountMin: 0,
    },
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
