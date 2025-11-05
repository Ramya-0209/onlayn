// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useScroll } from "../../context/ScrollContext";
// import Filters from "../shopPage/FilterBar";
// import ProductGrid from "../shopPage/ProductGrid";
// import { useLocation, useNavigate} from "react-router-dom";
// import { HiOutlineFilter } from "react-icons/hi";
// import API from "../../api";

// const Shop = () => {
//  const [products, setProducts] = useState([]);
//  const [loading, setLoading] = useState(true);
//  const location = useLocation();
//  const navigate = useNavigate();
//  const [bannerProductIds, setBannerProductIds] = useState([]);
//   const [bannerTitle, setBannerTitle] = useState("");
//  const [selectedCategory, setSelectedCategory] = useState("All");
//  const [selectedAge, setSelectedAge] = useState("All");
//  const [selectedPrice, setSelectedPrice] = useState("All");
//  const [searchInput, setSearchInput] = useState("");
//  const [searchQuery, setSearchQuery] = useState("");
//  const [sortOption, setSortOption] = useState("");
//  const { saveScroll, getScroll } = useScroll();
// const { pathname } = useLocation();
//  const [advancedFilters, setAdvancedFilters] = useState({
//   inStockOnly: false,
//   sameDayOnly: false,
//   ratingMin: 0,
//   brands: [],
//   sizes: [],
//   colors: [],
//   labels: [],
//   priceMin: 0,
//   priceMax: Infinity,
//   discountMin: 0,
//  });

//  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
//  const sidebarRef = useRef(null);

// useEffect(() => {
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/Dashboard/products/all-products");
//       const productsArray = Array.isArray(res.data.products) ? res.data.products : [];
//       setProducts(productsArray);
//     } catch (error) {
//       console.error(
//         "Error fetching products:",
//         error.response?.data || error.message
//       );
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchProducts();
// }, []);

//  useEffect(() => {
//   const params = new URLSearchParams(location.search);

//   setSelectedCategory(params.get("category") || "All");
//   setSelectedAge(params.get("age") || "All");
//   setSelectedPrice(params.get("price") || "All");
//   setSearchQuery(params.get("search") || "");
//   setSortOption(params.get("sort") || "");

//   setAdvancedFilters({
//    inStockOnly: params.get("inStock") === "true",
//    sameDayOnly: params.get("sameDay") === "true",
//    ratingMin: params.get("rating") ? Number(params.get("rating")) : 0,
//    brands: params.get("brands") ? params.get("brands").split(",") : [],
//    sizes: params.get("sizes") ? params.get("sizes").split(",") : [],
//    colors: params.get("colors") ? params.get("colors").split(",") : [],
//    labels: params.get("labels") ? params.get("labels").split(",") : [],
//    priceMin: params.get("priceMin") ? Number(params.get("priceMin")) : 0,
//    priceMax: params.get("priceMax") ? Number(params.get("priceMax")) : Infinity,
//    discountMin: params.get("discount") ? Number(params.get("discount")) : 0,
//   });

//   const urlProductIds = params.get("productIds");
//   if (urlProductIds) {
//    setBannerProductIds(
//     urlProductIds.split(",").map((id) => id.trim()).filter(Boolean)
//    );
//   } else {
//    setBannerProductIds([]);
//   }
//   const urlBannerTitle = params.get("bannerTitle");
//   setBannerTitle(urlBannerTitle || "");
//  }, [location.search]);

//  const productsToFilter = useMemo(() => {
//   return products
//    .map((p) => ({
//     ...p,
//     discountedPrice: p.discount
//      ? Number(p.price) * (1 - Number(p.discount) / 100)
//      : Number(p.price),
//    }))
//    .filter((product) =>
//     bannerProductIds.length > 0
//      ? bannerProductIds.includes(product._id?.toString())
//      : true
//    );
//  }, [products, bannerProductIds]);

//  useEffect(() => {
//   if (isMobileFilterOpen) document.body.classList.add("overflow-hidden");
//   else document.body.classList.remove("overflow-hidden");
//  }, [isMobileFilterOpen]);

//  useEffect(() => {
//   const handleClickOutside = (e) => {
//    if (isMobileFilterOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
//     setIsMobileFilterOpen(false);
//    }
//   };
//   document.addEventListener("mousedown", handleClickOutside);
//   return () => document.removeEventListener("mousedown", handleClickOutside);
//  }, [isMobileFilterOpen]);

//  useEffect(() => {
//   const handler = setTimeout(() => {
//    setSearchQuery(searchInput);
//   }, 300);
//   return () => clearTimeout(handler);
//  }, [searchInput]);

//  const { brandList, colorList, labelList, sizeList } = useMemo(() => {
//   const brands = new Set();
//   const colors = new Set();
//   const labels = new Set();
//   const sizes = new Set();
//   for (const p of productsToFilter) {
//    if (p?.brand) brands.add(p.brand);
//    if (Array.isArray(p?.variants)) {
//     p.variants.forEach((v) => {
//      if (v?.color) colors.add(String(v.color).trim());
//      if (v?.size) sizes.add(String(v.size).trim());
//     });
//    }
//    if (p?.label) labels.add(p.label);
//    if (Array.isArray(p?.labels)) p.labels.forEach((l) => l && labels.add(l));
//   }
//   return {
//    brandList: Array.from(brands),
//    colorList: Array.from(colors),
//    labelList: Array.from(labels),
//    sizeList: Array.from(sizes),
//   };
//  }, [productsToFilter]);

//  const filteredProducts = useMemo(() => {
//   const {
//    inStockOnly,
//    sameDayOnly,
//    ratingMin,
//    brands,
//    sizes,
//    colors,
//    labels,
//    priceMin,
//    priceMax,
//    discountMin,
//   } = advancedFilters;

//   const parseAgeRange = (ageValue) => {
//     if (!ageValue) return { min: 0, max: Infinity };

//     // Convert everything to string (since backend sends quoted age)
//     let str = String(ageValue).toLowerCase().trim();

//     // Clean common words or spaces
//     str = str.replace(/["']+/g, ""); // remove quotes
//     str = str.replace(/years?|yrs?/g, "").replace(/\s+/g, "");

//     if (str.includes("+")) {
//       return { min: parseInt(str) || 0, max: Infinity };
//     }
//     if (str.includes("-")) {
//       const [min, max] = str.split("-").map((n) => parseInt(n) || 0);
//       return { min, max };
//     }

//     const num = parseInt(str) || 0;
//     return { min: num, max: num };
//   };

//   return productsToFilter
//    .filter((product) => {
//     const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;

//     let ageMatch = true;
//     if (selectedAge !== "All") {
//     const { min: filterMin, max: filterMax } = parseAgeRange(selectedAge);
//     const { min: prodMin, max: prodMax } = parseAgeRange(product.age);
//     ageMatch = prodMax >= filterMin && prodMin <= filterMax;
//     }

//     const numericPrice = Number(product.discountedPrice || product.price || 0);
//     const priceBucketMatch = selectedPrice === "All" ||
//     (selectedPrice === "Under 500" && numericPrice < 500) ||
//     (selectedPrice === "500-1000" && numericPrice >= 500 && numericPrice <= 1000) ||
//     (selectedPrice === "Above 1000" && numericPrice > 1000);
//     const rangeMatch = numericPrice >= priceMin && numericPrice <= priceMax;

//       // 🌟 FIX START: Unified Search Logic (Product Name OR Meta Keyword)
//       const query = (searchQuery || "").toLowerCase();
//       let finalSearchMatch = true;

//       if (query.length > 0) {
//           // 1. Check Product Name
//           const productNameMatch = (product.productName || "").toLowerCase().includes(query);

//           // 2. Check Meta Keywords
//           let metaKeywordMatch = false;

//           if (product.metaKeyword) {
//               if (Array.isArray(product.metaKeyword)) {
//                   metaKeywordMatch = product.metaKeyword.some(k =>
//                       String(k).toLowerCase().includes(query)
//                   );
//               } else {
//                   // Handle single string metaKeyword
//                   metaKeywordMatch = String(product.metaKeyword).toLowerCase().includes(query);
//               }
//           }

//           // A product matches if the query is in the productName OR a metaKeyword
//           finalSearchMatch = productNameMatch || metaKeywordMatch;
//       }
//       // 🌟 FIX END

//     const rating = Number(product.rating || 0);
//     const ratingMatch = rating >= (ratingMin || 0);

//     const inStockMatch = inStockOnly ? Number(product.stock) > 0 : true;
//     const sameDayEligible = product?.label?.toLowerCase()?.includes("same day") || (Array.isArray(product?.labels) && product.labels.some((l) => String(l).toLowerCase().includes("same day")));
//     const sameDayMatch = sameDayOnly ? !!sameDayEligible : true;

//     const brandMatch = brands.length ? brands.includes(product.brand) : true;
//     const sizeMatch = sizes.length ? sizes.includes(String(product.size).trim()) : true;
//     const colorMatch = colors.length ? colors.includes(String(product.color).trim()) : true;
//     const labelMatch = labels.length ? labels.includes(product.label) || (Array.isArray(product.labels) && product.labels.some((l) => labels.includes(l))) : true;

//     const discountMatch = Number(product.discount || 0) >= (discountMin || 0);

//     // Use the new finalSearchMatch instead of the old separate searchMatch and metaKeywordMatch
//     return categoryMatch && ageMatch && priceBucketMatch && rangeMatch && finalSearchMatch && ratingMatch && inStockMatch && sameDayMatch && brandMatch && sizeMatch && colorMatch && labelMatch && discountMatch;
//    })
//    .sort((a, b) => {
//     const priceA = Number(a.discountedPrice || a.price || 0);
//     const priceB = Number(b.discountedPrice || b.price || 0);
//     if (sortOption === "Price: Low to High") return priceA - priceB;
//     if (sortOption === "Price: High to Low") return priceB - priceA;
//     return 0;
//    });
//   }, [
//    productsToFilter,
//    selectedCategory,
//    selectedAge,
//    selectedPrice,
//    searchQuery,
//    sortOption,
//    advancedFilters,
//   ]);

// useEffect(() => {
//   if (!loading && products.length > 0) {
//       const scrollY = getScroll(pathname);
//       if (scrollY > 0) {
//           setTimeout(() => {
//               window.scrollTo(0, scrollY);
//           }, 0);
//       }
//   }
// }, [loading, pathname, products.length]);

//  const activeChips = useMemo(() => {
//   const chips = [];
//   if (bannerProductIds.length > 0) {
//    chips.push({
//     label: bannerTitle || "Banner Products",
//     clear: () => setBannerProductIds([]),
//    });
//   }
//   if (selectedCategory !== "All")
//    chips.push({
//     label: `Category: ${selectedCategory}`,
//     clear: () => setSelectedCategory("All"),
//    });
//   if (selectedAge !== "All")
//    chips.push({
//     label: `Age: ${selectedAge}`,
//     clear: () => setSelectedAge("All"),
//    });
//   if (selectedPrice !== "All")
//    chips.push({
//     label: `Price: ${selectedPrice}`,
//     clear: () => setSelectedPrice("All"),
//    });
//   if (searchQuery)
//    chips.push({
//     label: `Search: “${searchQuery}”`,
//     clear: () => setSearchQuery(""),
//    });

//   const af = advancedFilters;
//   if (af.inStockOnly)
//    chips.push({
//     label: "In Stock",
//     clear: () => setAdvancedFilters((prev) => ({ ...prev, inStockOnly: false })),
//    });
//   if (af.sameDayOnly)
//    chips.push({
//     label: "Same Day",
//     clear: () => setAdvancedFilters((prev) => ({ ...prev, sameDayOnly: false })),
//    });
//   if (af.ratingMin > 0)
//    chips.push({
//     label: `${af.ratingMin}★ & up`,
//     clear: () => setAdvancedFilters((prev) => ({ ...prev, ratingMin: 0 })),
//    });
//   if (af.brands.length)
//    chips.push({
//     label: `Brands (${af.brands.length})`,
//     clear: () => setAdvancedFilters((prev) => ({ ...prev, brands: [] })),
//    });
//   if (af.sizes.length)
//    chips.push({
//     label: `Sizes (${af.sizes.length})`,
//     clear: () => setAdvancedFilters((prev) => ({ ...prev, sizes: [] })),
//    });
//   if (af.colors.length)
//    chips.push({
//     label: `Colors (${af.colors.length})`,
//     clear: () => setAdvancedFilters((prev) => ({ ...prev, colors: [] })),
//    });
//   if (af.labels.length)
//    chips.push({
//     label: `Labels (${af.labels.length})`,
//     clear: () => setAdvancedFilters((prev) => ({ ...prev, labels: [] })),
//    });
//   if (af.priceMin !== 0 || af.priceMax !== Infinity)
//    chips.push({
//     label: `₹${af.priceMin}–₹${af.priceMax}`,
//     clear: () =>
//      setAdvancedFilters((prev) => ({
//       ...prev,
//       priceMin: 0,
//       priceMax: Infinity,
//      })),
//    });
//   if (af.discountMin > 0)
//    chips.push({
//     label: `${af.discountMin}%+ off`,
//     clear: () => setAdvancedFilters((prev) => ({ ...prev, discountMin: 0 })),
//    });

//   return chips;
//  }, [
//   selectedCategory,
//   selectedAge,
//   selectedPrice,
//   searchQuery,
//   advancedFilters,
//   bannerProductIds,
//  ]);

//  const hasActiveFilters = activeChips.length > 0;

//  const clearAll = () => {
//   setSelectedCategory("All");
//   setSelectedAge("All");
//   setSelectedPrice("All");
//   setSearchQuery("");
//   setSearchInput("");
//   setSortOption("");
//   setBannerProductIds([]);
//   setAdvancedFilters({
//    inStockOnly: false,
//    sameDayOnly: false,
//    ratingMin: 0,
//    brands: [],
//    sizes: [],
//    colors: [],
//    labels: [],
//    priceMin: 0,
//    priceMax: Infinity,
//    discountMin: 0,
//   });
//  };

//  useEffect(() => {
//   const params = new URLSearchParams();

//   if (selectedCategory !== "All") params.set("category", selectedCategory);
//   if (selectedAge !== "All") params.set("age", selectedAge);
//   if (selectedPrice !== "All") params.set("price", selectedPrice);
//   if (searchQuery) params.set("search", searchQuery);
//   if (sortOption) params.set("sort", sortOption);

//   if (advancedFilters.inStockOnly) params.set("inStock", "true");
//   if (advancedFilters.sameDayOnly) params.set("sameDay", "true");
//   if (advancedFilters.ratingMin > 0) params.set("rating", advancedFilters.ratingMin);
//   if (advancedFilters.brands.length) params.set("brands", advancedFilters.brands.join(","));
//   if (advancedFilters.sizes.length) params.set("sizes", advancedFilters.sizes.join(","));
//   if (advancedFilters.colors.length) params.set("colors", advancedFilters.colors.join(","));
//   if (advancedFilters.labels.length) params.set("labels", advancedFilters.labels.join(","));
//   if (advancedFilters.priceMin !== 0) params.set("priceMin", advancedFilters.priceMin);
//   if (advancedFilters.priceMax !== Infinity) params.set("priceMax", advancedFilters.priceMax);
//   if (advancedFilters.discountMin > 0) params.set("discount", advancedFilters.discountMin);

//   if (bannerProductIds.length) params.set("productIds", bannerProductIds.join(","));
//   if (bannerTitle) params.set("bannerTitle", bannerTitle);

//   navigate({ search: params.toString() }, { replace: true });
// }, [
//   selectedCategory,
//   selectedAge,
//   selectedPrice,
//   searchQuery,
//   sortOption,
//   advancedFilters,
//   bannerProductIds,
//   bannerTitle,
//   navigate
// ]);

//  return (
//   <div className="max-w-7xl mx-auto px-4 py-10">
//     <h1 className="text-4xl font-extrabold text-center text-pink-500 mb-10">
//       Shop All Toys
//     </h1>
//     <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white py-3 px-4 border-t border-gray-200">
//       <button
//         onClick={() => setIsMobileFilterOpen(true)}
//         className="w-full flex items-center text-lg justify-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-full shadow-sm hover:bg-pink-600 transition"
//       >
//         <HiOutlineFilter className="w-6 h-6" />
//         Filters
//       </button>
//     </div>

//     <div className="flex flex-col lg:flex-row gap-6">
//       <div className="lg:w-1/4 w-full hidden lg:block">
//       <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-custom">
//         <Filters
//         selectedCategory={selectedCategory}
//         setSelectedCategory={setSelectedCategory}
//         selectedAge={selectedAge}
//         setSelectedAge={setSelectedAge}
//         selectedPrice={selectedPrice}
//         setSelectedPrice={setSelectedPrice}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         sortOption={sortOption}
//         setSortOption={setSortOption}
//         brands={brandList}
//         colors={colorList}
//         labels={labelList}
//         sizes={sizeList}
//         advancedFilters={advancedFilters}
//         onAdvancedChange={setAdvancedFilters}
//         />
//       </div>
//       </div>

//       <div className="lg:w-3/4 w-full">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//         <div className="text-sm text-gray-600">
//         Showing{" "}
//         <span className="font-semibold">{filteredProducts.length}</span>{" "}
//         products
//         </div>
//         {hasActiveFilters && (
//         <div className="flex flex-wrap gap-2">
//           {activeChips.map((chip, idx) => (
//           <button
//             key={idx}
//             className="bg-pink-50 text-pink-700 px-3 py-1 text-sm rounded-full border border-pink-200 hover:bg-pink-100 transition-all duration-200 cursor-pointer"
//           >
//             {chip.label} <span onClick={chip.clear} className="ml-1 font-bold">×</span>
//           </button>
//           ))}
//           <button
//           onClick={clearAll}
//           className="bg-pink-500 font-medium text-white px-3 py-1 rounded-full hover:bg-pink-600 cursor-pointer transition-all duration-200 text-sm"
//           >
//           Clear All
//           </button>
//         </div>
//         )}
//       </div>
//       {loading ? (
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//         {Array.from({ length: 21 }).map((_, idx) => (
//           <div
//           key={idx}
//           className="animate-pulse bg-gray-200 h-64 rounded-lg"
//           />
//         ))}
//         </div>
//       ) : filteredProducts.length === 0 ? (
//         <div className="text-center p-10 bg-gray-50 rounded-lg shadow-inner flex flex-col items-center gap-3">
//         <img
//           src="https://craftzone.in/assets/img/no-product.png"
//           alt="No products"
//           className="w-80 mx-auto"
//         />
//         </div>
//       ) : (
//         <ProductGrid
//           products={filteredProducts}
//           bannerProductIds={bannerProductIds}
//           bannerTitle={bannerTitle}
//         />
//       )}
//       </div>
//     </div>
//     {isMobileFilterOpen && (
//       <div className="fixed inset-0 z-50 flex">
//       <div
//         className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
//         onClick={() => setIsMobileFilterOpen(false)}
//       ></div>
//       <div
//         ref={sidebarRef}
//         className="relative w-3/4 max-w-xs bg-white shadow-xl p-6 overflow-y-auto transition-transform transform translate-x-0"
//       >
//         <button
//         onClick={() => setIsMobileFilterOpen(false)}
//         className="absolute top-0 right-4 text-gray-500 font-bold text-2xl"
//         >
//         ×
//         </button>
//         <Filters
//         selectedCategory={selectedCategory}
//         setSelectedCategory={setSelectedCategory}
//         selectedAge={selectedAge}
//         setSelectedAge={setSelectedAge}
//         selectedPrice={selectedPrice}
//         setSelectedPrice={setSelectedPrice}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         sortOption={sortOption}
//         setSortOption={setSortOption}
//         brands={brandList}
//         colors={colorList}
//         labels={labelList}
//         sizes={sizeList}
//         advancedFilters={advancedFilters}
//         onAdvancedChange={setAdvancedFilters}
//         />
//       </div>
//       </div>
//     )}
//     </div>
//   );
//   };

// export default Shop;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useScroll } from "../../context/ScrollContext";
import Filters from "../shopPage/FilterBar";
import ProductGrid from "../shopPage/ProductGrid";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { HiOutlineFilter } from "react-icons/hi";
// 🆕 Import the new icon
import { FaArrowUp } from "react-icons/fa";
import API from "../../api";

const deepCopyAdvancedFilters = (filters) => ({
  inStockOnly: filters.inStockOnly,
  sameDayOnly: filters.sameDayOnly,
  ratingMin: filters.ratingMin,
  brands: [...filters.brands],
  sizes: [...filters.sizes],
  colors: [...filters.colors],
  labels: [...filters.labels],
  priceMin: filters.priceMin,
  priceMax: filters.priceMax,
  discountMin: filters.discountMin,
});

// Helper function to check if advanced filters are equal
const areAdvancedFiltersEqual = (filters1, filters2) => {
  if (!filters1 || !filters2) return false;
  return (
    filters1.inStockOnly === filters2.inStockOnly &&
    filters1.sameDayOnly === filters2.sameDayOnly &&
    filters1.ratingMin === filters2.ratingMin &&
    filters1.priceMin === filters2.priceMin &&
    filters1.priceMax === filters2.priceMax &&
    filters1.discountMin === filters2.discountMin &&
    filters1.brands.length === filters2.brands.length &&
    filters1.brands.every((val, i) => val === filters2.brands[i]) &&
    filters1.sizes.length === filters2.sizes.length &&
    filters1.sizes.every((val, i) => val === filters2.sizes[i]) &&
    filters1.colors.length === filters2.colors.length &&
    filters1.colors.every((val, i) => val === filters2.colors[i]) &&
    filters1.labels.length === filters2.labels.length &&
    filters1.labels.every((val, i) => val === filters2.labels[i])
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [bannerProductIds, setBannerProductIds] = useState([]);
  const [bannerTitle, setBannerTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAge, setSelectedAge] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const { saveScroll, getScroll } = useScroll();
  const { pathname } = useLocation();
  const [advancedFilters, setAdvancedFilters] = useState({
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
  });

  // 🆕 Scroll to Top State
  const [isVisible, setIsVisible] = useState(false);

  // 🆕 Add a ref to store the previous filters
  const previousFiltersRef = useRef({
    selectedCategory: "All",
    selectedAge: "All",
    selectedPrice: "All",
    searchQuery: "",
    sortOption: "",
    advancedFilters: deepCopyAdvancedFilters(advancedFilters),
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const sidebarRef = useRef(null);

  // 🌟 NEW MOBILE STATE: Hold filter changes before user hits "Apply"
  const [mobileCategory, setMobileCategory] = useState(selectedCategory);
  const [mobileAge, setMobileAge] = useState(selectedAge);
  const [mobilePrice, setMobilePrice] = useState(selectedPrice);
  const [mobileSort, setMobileSort] = useState(sortOption);
  const [mobileAdvancedFilters, setMobileAdvancedFilters] = useState(
    deepCopyAdvancedFilters(advancedFilters)
  );

  useEffect(() => {
    setMobileCategory(selectedCategory);
    setMobileAge(selectedAge);
    setMobilePrice(selectedPrice);
    setMobileSort(sortOption);
    setMobileAdvancedFilters(deepCopyAdvancedFilters(advancedFilters));
  }, [
    selectedCategory,
    selectedAge,
    selectedPrice,
    sortOption,
    advancedFilters,
  ]);

  const applyMobileFilters = () => {
    setSelectedCategory(mobileCategory);
    setSelectedAge(mobileAge);
    setSelectedPrice(mobilePrice);
    setSortOption(mobileSort);
    setAdvancedFilters(mobileAdvancedFilters);
    setIsMobileFilterOpen(false);
  };

  const clearAll = () => {
    setSelectedCategory("All");
    setSelectedAge("All");
    setSelectedPrice("All");
    setSearchQuery("");
    setSearchInput("");
    setSortOption("");
    setBannerProductIds([]);
    const clearedFilters = {
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
    };
    setAdvancedFilters(clearedFilters);

    setMobileCategory("All");
    setMobileAge("All");
    setMobilePrice("All");
    setMobileSort("");
    setMobileAdvancedFilters(clearedFilters);

    setIsMobileFilterOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get("/Dashboard/products/all-products");
        const productsArray = Array.isArray(res.data.products)
          ? res.data.products
          : [];
        setProducts(productsArray);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error.response?.data || error.message
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSelectedCategory(params.get("category") || "All");
    setSelectedAge(params.get("age") || "All");
    setSelectedPrice(params.get("price") || "All");
    setSearchQuery(params.get("search") || "");
    setSortOption(params.get("sort") || "");

    const newAdvancedFilters = {
      inStockOnly: params.get("inStock") === "true",
      sameDayOnly: params.get("sameDay") === "true",
      ratingMin: params.get("rating") ? Number(params.get("rating")) : 0,
      brands: params.get("brands") ? params.get("brands").split(",") : [],
      sizes: params.get("sizes") ? params.get("sizes").split(",") : [],
      colors: params.get("colors") ? params.get("colors").split(",") : [],
      labels: params.get("labels") ? params.get("labels").split(",") : [],
      priceMin: params.get("priceMin") ? Number(params.get("priceMin")) : 0,
      priceMax: params.get("priceMax")
        ? Number(params.get("priceMax"))
        : Infinity,
      discountMin: params.get("discount") ? Number(params.get("discount")) : 0,
    };

    setAdvancedFilters(newAdvancedFilters);

    // Also initialize mobile state here from URL on first load
    setMobileCategory(params.get("category") || "All");
    setMobileAge(params.get("age") || "All");
    setMobilePrice(params.get("price") || "All");
    setMobileSort(params.get("sort") || "");
    setMobileAdvancedFilters(deepCopyAdvancedFilters(newAdvancedFilters));

    const urlProductIds = params.get("productIds");
    if (urlProductIds) {
      setBannerProductIds(
        urlProductIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      );
    } else {
      setBannerProductIds([]);
    }
    const urlBannerTitle = params.get("bannerTitle");
    setBannerTitle(urlBannerTitle || "");

    // 🆕 Initialize the previousFiltersRef after parsing initial URL params
    previousFiltersRef.current = {
      selectedCategory: params.get("category") || "All",
      selectedAge: params.get("age") || "All",
      selectedPrice: params.get("price") || "All",
      searchQuery: params.get("search") || "",
      sortOption: params.get("sort") || "",
      advancedFilters: newAdvancedFilters,
    };
  }, [location.search]);

  const productsToFilter = useMemo(() => {
    return products
      .map((p) => ({
        ...p,
        discountedPrice: p.discount
          ? Number(p.price) * (1 - Number(p.discount) / 100)
          : Number(p.price),
      }))
      .filter((product) =>
        bannerProductIds.length > 0
          ? bannerProductIds.includes(product._id?.toString())
          : true
      );
  }, [products, bannerProductIds]);

  useEffect(() => {
    if (isMobileFilterOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [isMobileFilterOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only close if it's the backdrop click, not a drag inside the sidebar itself
      if (
        isMobileFilterOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        e.target.classList.contains("fixed")
      ) {
        setIsMobileFilterOpen(false);
      }
    };
    // Use a temporary scroll lock on mobile when open (already handled by overflow-hidden)
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileFilterOpen]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { brandList, colorList, labelList, sizeList } = useMemo(() => {
    const brands = new Set();
    const colors = new Set();
    const labels = new Set();
    const sizes = new Set();
    for (const p of productsToFilter) {
      if (p?.brand) brands.add(p.brand);
      if (Array.isArray(p?.variants)) {
        p.variants.forEach((v) => {
          if (v?.color) colors.add(String(v.color).trim());
          if (v?.size) sizes.add(String(v.size).trim());
        });
      }
      if (p?.label) labels.add(p.label);
      if (Array.isArray(p?.labels)) p.labels.forEach((l) => l && labels.add(l));
    }
    return {
      brandList: Array.from(brands),
      colorList: Array.from(colors),
      labelList: Array.from(labels),
      sizeList: Array.from(sizes),
    };
  }, [productsToFilter]);

  const filteredProducts = useMemo(() => {
    const {
      inStockOnly,
      sameDayOnly,
      ratingMin,
      brands,
      sizes,
      colors,
      labels,
      priceMin,
      priceMax,
      discountMin,
    } = advancedFilters;

    const parseAgeRange = (ageValue) => {
      if (!ageValue) return { min: 0, max: Infinity };

      // Convert everything to string (since backend sends quoted age)
      let str = String(ageValue).toLowerCase().trim();

      // Clean common words or spaces
      str = str.replace(/["']+/g, ""); // remove quotes
      str = str.replace(/years?|yrs?/g, "").replace(/\s+/g, "");

      if (str.includes("+")) {
        return { min: parseInt(str) || 0, max: Infinity };
      }
      if (str.includes("-")) {
        const [min, max] = str.split("-").map((n) => parseInt(n) || 0);
        return { min, max };
      }

      const num = parseInt(str) || 0;
      return { min: num, max: num };
    };

    return productsToFilter
      .filter((product) => {
        const categoryMatch =
          selectedCategory === "All" || product.category === selectedCategory;

        let ageMatch = true;
        if (selectedAge !== "All") {
          const { min: filterMin, max: filterMax } = parseAgeRange(selectedAge);
          const { min: prodMin, max: prodMax } = parseAgeRange(product.age);
          ageMatch = prodMax >= filterMin && prodMin <= filterMax;
        }

        const numericPrice = Number(
          product.discountedPrice || product.price || 0
        );
        const priceBucketMatch =
          selectedPrice === "All" ||
          (selectedPrice === "Under 500" && numericPrice < 500) ||
          (selectedPrice === "500-1000" &&
            numericPrice >= 500 &&
            numericPrice <= 1000) ||
          (selectedPrice === "Above 1000" && numericPrice > 1000);
        const rangeMatch = numericPrice >= priceMin && numericPrice <= priceMax;

        // 🌟 FIX START: Unified Search Logic (Product Name OR Meta Keyword)
        const query = (searchQuery || "").toLowerCase();
        let finalSearchMatch = true;

        if (query.length > 0) {
          // 1. Check Product Name
          const productNameMatch = (product.productName || "")
            .toLowerCase()
            .includes(query);

          // 2. Check Meta Keywords
          let metaKeywordMatch = false;

          if (product.metaKeyword) {
            if (Array.isArray(product.metaKeyword)) {
              metaKeywordMatch = product.metaKeyword.some((k) =>
                String(k).toLowerCase().includes(query)
              );
            } else {
              // Handle single string metaKeyword
              metaKeywordMatch = String(product.metaKeyword)
                .toLowerCase()
                .includes(query);
            }
          }

          // A product matches if the query is in the productName OR a metaKeyword
          finalSearchMatch = productNameMatch || metaKeywordMatch;
        }
        // 🌟 FIX END

        const rating = Number(product.rating || 0);
        const ratingMatch = rating >= (ratingMin || 0);

        const inStockMatch = inStockOnly ? Number(product.stock) > 0 : true;
        const sameDayEligible =
          product?.label?.toLowerCase()?.includes("same day") ||
          (Array.isArray(product?.labels) &&
            product.labels.some((l) =>
              String(l).toLowerCase().includes("same day")
            ));
        const sameDayMatch = sameDayOnly ? !!sameDayEligible : true;

        const brandMatch = brands.length
          ? brands.includes(product.brand)
          : true;
        const sizeMatch = sizes.length
          ? sizes.includes(String(product.size).trim())
          : true;
        const colorMatch = colors.length
          ? colors.includes(String(product.color).trim())
          : true;
        const labelMatch = labels.length
          ? labels.includes(product.label) ||
            (Array.isArray(product.labels) &&
              product.labels.some((l) => labels.includes(l)))
          : true;

        const discountMatch =
          Number(product.discount || 0) >= (discountMin || 0);

        // Use the new finalSearchMatch instead of the old separate searchMatch and metaKeywordMatch
        return (
          categoryMatch &&
          ageMatch &&
          priceBucketMatch &&
          rangeMatch &&
          finalSearchMatch &&
          ratingMatch &&
          inStockMatch &&
          sameDayMatch &&
          brandMatch &&
          sizeMatch &&
          colorMatch &&
          labelMatch &&
          discountMatch
        );
      })
      .sort((a, b) => {
        const priceA = Number(a.discountedPrice || a.price || 0);
        const priceB = Number(b.discountedPrice || b.price || 0);
        if (sortOption === "Price: Low to High") return priceA - priceB;
        if (sortOption === "Price: High to Low") return priceB - priceA;
        return 0;
      });
  }, [
    productsToFilter,
    selectedCategory,
    selectedAge,
    selectedPrice,
    searchQuery,
    sortOption,
    advancedFilters,
  ]);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const scrollY = getScroll(pathname);
      if (scrollY > 0) {
        setTimeout(() => {
          window.scrollTo(0, scrollY);
        }, 0);
      }
    }
  }, [loading, pathname, products.length]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (bannerProductIds.length > 0) {
      chips.push({
        label: bannerTitle || "Banner Products",
        clear: () => setBannerProductIds([]),
      });
    }
    if (selectedCategory !== "All")
      chips.push({
        label: `Category: ${selectedCategory}`,
        clear: () => setSelectedCategory("All"),
      });
    if (selectedAge !== "All")
      chips.push({
        label: `Age: ${selectedAge}`,
        clear: () => setSelectedAge("All"),
      });
    if (selectedPrice !== "All")
      chips.push({
        label: `Price: ${selectedPrice}`,
        clear: () => setSelectedPrice("All"),
      });
    if (searchQuery)
      chips.push({
        label: `Search: “${searchQuery}”`,
        clear: () => setSearchQuery(""),
      });

    const af = advancedFilters;
    if (af.inStockOnly)
      chips.push({
        label: "In Stock",
        clear: () =>
          setAdvancedFilters((prev) => ({ ...prev, inStockOnly: false })),
      });
    if (af.sameDayOnly)
      chips.push({
        label: "Same Day",
        clear: () =>
          setAdvancedFilters((prev) => ({ ...prev, sameDayOnly: false })),
      });
    if (af.ratingMin > 0)
      chips.push({
        label: `${af.ratingMin}★ & up`,
        clear: () => setAdvancedFilters((prev) => ({ ...prev, ratingMin: 0 })),
      });
    if (af.brands.length)
      chips.push({
        label: `Brands (${af.brands.length})`,
        clear: () => setAdvancedFilters((prev) => ({ ...prev, brands: [] })),
      });
    if (af.sizes.length)
      chips.push({
        label: `Sizes (${af.sizes.length})`,
        clear: () => setAdvancedFilters((prev) => ({ ...prev, sizes: [] })),
      });
    if (af.colors.length)
      chips.push({
        label: `Colors (${af.colors.length})`,
        clear: () => setAdvancedFilters((prev) => ({ ...prev, colors: [] })),
      });
    if (af.labels.length)
      chips.push({
        label: `Labels (${af.labels.length})`,
        clear: () => setAdvancedFilters((prev) => ({ ...prev, labels: [] })),
      });
    if (af.priceMin !== 0 || af.priceMax !== Infinity)
      chips.push({
        label: `₹${af.priceMin}–₹${af.priceMax}`,
        clear: () =>
          setAdvancedFilters((prev) => ({
            ...prev,
            priceMin: 0,
            priceMax: Infinity,
          })),
      });
    if (af.discountMin > 0)
      chips.push({
        label: `${af.discountMin}%+ off`,
        clear: () =>
          setAdvancedFilters((prev) => ({ ...prev, discountMin: 0 })),
      });

    return chips;
  }, [
    selectedCategory,
    selectedAge,
    selectedPrice,
    searchQuery,
    advancedFilters,
    bannerProductIds,
  ]);

  const hasActiveFilters = activeChips.length > 0;

  // 🎯 SCROLL TO TOP LOGIC ADDED HERE
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedAge !== "All") params.set("age", selectedAge);
    if (selectedPrice !== "All") params.set("price", selectedPrice);
    if (searchQuery) params.set("search", searchQuery);
    if (sortOption) params.set("sort", sortOption);

    if (advancedFilters.inStockOnly) params.set("inStock", "true");
    if (advancedFilters.sameDayOnly) params.set("sameDay", "true");
    if (advancedFilters.ratingMin > 0)
      params.set("rating", advancedFilters.ratingMin);
    if (advancedFilters.brands.length)
      params.set("brands", advancedFilters.brands.join(","));
    if (advancedFilters.sizes.length)
      params.set("sizes", advancedFilters.sizes.join(","));
    if (advancedFilters.colors.length)
      params.set("colors", advancedFilters.colors.join(","));
    if (advancedFilters.labels.length)
      params.set("labels", advancedFilters.labels.join(","));
    if (advancedFilters.priceMin !== 0)
      params.set("priceMin", advancedFilters.priceMin);
    if (advancedFilters.priceMax !== Infinity)
      params.set("priceMax", advancedFilters.priceMax);
    if (advancedFilters.discountMin > 0)
      params.set("discount", advancedFilters.discountMin);

    if (bannerProductIds.length)
      params.set("productIds", bannerProductIds.join(","));
    if (bannerTitle) params.set("bannerTitle", bannerTitle);

    // 1. Check if filters have genuinely changed
    const prevFilters = previousFiltersRef.current;

    const filtersChanged =
      prevFilters.selectedCategory !== selectedCategory ||
      prevFilters.selectedAge !== selectedAge ||
      prevFilters.selectedPrice !== selectedPrice ||
      prevFilters.searchQuery !== searchQuery ||
      prevFilters.sortOption !== sortOption ||
      !areAdvancedFiltersEqual(prevFilters.advancedFilters, advancedFilters);

    // 2. Perform the scroll only if a filter has changed
    if (filtersChanged) {
      // window.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo(0, 0);
    }

    // 3. Update the previous filters ref for the next render
    previousFiltersRef.current = {
      selectedCategory,
      selectedAge,
      selectedPrice,
      searchQuery,
      sortOption,
      advancedFilters: deepCopyAdvancedFilters(advancedFilters),
    };

    // 4. Update the URL
    navigate({ search: params.toString() }, { replace: true });
  }, [
    selectedCategory,
    selectedAge,
    selectedPrice,
    searchQuery,
    sortOption,
    advancedFilters,
    bannerProductIds, // Included here for URL update only
    bannerTitle, // Included here for URL update only
    navigate,
  ]);

  // --- NEW SCROLL TO TOP LOGIC START ---

  // Function to handle scrolling to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // For smooth scrolling animation
    });
  };

  // Effect to control visibility based on scroll position
  useEffect(() => {
    // Define the threshold (e.g., 400px down)
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // --- NEW SCROLL TO TOP LOGIC END ---

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* <h1 className="text-4xl font-extrabold text-center text-pink-500 mb-10">
        Shop All Toys
      </h1> */}

      
      
      {/* Mobile Filter Button: Fixed at the bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white py-3 px-4 border-t border-gray-200">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full flex items-center text-lg justify-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-full shadow-sm hover:bg-pink-600 transition"
        >
          <HiOutlineFilter className="w-6 h-6" />
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Filter Bar (Existing Design) */}
        <div className="lg:w-1/4 w-full hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-custom">
            <Filters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedAge={selectedAge}
              setSelectedAge={setSelectedAge}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              searchQuery={searchInput} // Use searchInput for immediate feedback in the filter bar
              setSearchQuery={setSearchInput} // Update searchInput immediately
              sortOption={sortOption}
              setSortOption={setSortOption}
              brands={brandList}
              colors={colorList}
              labels={labelList}
              sizes={sizeList}
              advancedFilters={advancedFilters}
              onAdvancedChange={setAdvancedFilters}
            />
          </div>
        </div>

        <div className="lg:w-3/4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredProducts.length}</span>{" "}
              products
            </div>
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {activeChips.map((chip, idx) => (
                  <button
                    key={idx}
                    className="bg-pink-50 text-pink-700 px-3 py-1 text-sm rounded-full border border-pink-200 hover:bg-pink-100 transition-all duration-200 cursor-pointer"
                  >
                    {chip.label}{" "}
                    <span onClick={chip.clear} className="ml-1 font-bold">
                      ×
                    </span>
                  </button>
                ))}
                <button
                  onClick={clearAll}
                  className="bg-pink-500 font-medium text-white px-3 py-1 rounded-full hover:bg-pink-600 cursor-pointer transition-all duration-200 text-sm"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: filteredProducts.length || 5000 }).map(
                (_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse bg-gray-200 h-64 rounded-lg"
                  />
                )
              )}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg shadow-inner flex flex-col items-center gap-3">
              <img
                src="https://craftzone.in/assets/img/no-product.png"
                alt="No products"
                className="w-80 mx-auto"
              />
            </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              bannerProductIds={bannerProductIds}
              bannerTitle={bannerTitle}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Sidebar/Modal (Existing Structure with NEW Logic) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          ></div>
          <div
            ref={sidebarRef}
            // Tailwind class change: added 'flex flex-col' to make the content and footer stack
            className="relative w-3/4 max-w-xs bg-white shadow-xl flex flex-col transition-transform transform translate-x-0"
          >
            {/* Header/Close Button */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Filter Products</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-gray-500 font-bold text-2xl"
              >
                ×
              </button>
            </div>

            {/* Filters Content Area - must be scrollable */}
            <div className="flex-grow p-4 overflow-y-auto scrollbar-custom">
              {/* The Filters component now uses the temporary mobile state */}
              <Filters
                selectedCategory={mobileCategory}
                setSelectedCategory={setMobileCategory}
                selectedAge={mobileAge}
                setSelectedAge={setMobileAge}
                selectedPrice={mobilePrice}
                setSelectedPrice={setMobilePrice}
                searchQuery={searchInput} // search is generally instant, but here it's fine to keep as is, or use the temporary search state if you want it applied only on 'Apply'
                setSearchQuery={setSearchInput} // Search updates the main searchInput state immediately
                sortOption={mobileSort}
                setSortOption={setMobileSort}
                brands={brandList}
                colors={colorList}
                labels={labelList}
                sizes={sizeList}
                advancedFilters={mobileAdvancedFilters}
                onAdvancedChange={setMobileAdvancedFilters}
              />
            </div>

            {/* Footer with Apply/Clear buttons */}
            <div className="p-4 border-t bg-white flex justify-between gap-3 sticky bottom-0">
              <button
                onClick={clearAll}
                className="w-1/3 text-sm px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                Clear
              </button>
              <button
                onClick={applyMobileFilters}
                className="w-2/3 text-sm px-4 py-2 bg-pink-500 text-white rounded-lg shadow-sm hover:bg-pink-600 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SCROLL TO TOP BUTTON (NEW JSX) --- */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 lg:bottom-5 right-4 lg:right-5 xl:right-10 z-50 p-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 transform hover:scale-105"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-4 h-4" />
        </button>
      )}
      {/* The bottom-24 is used to position the button above the mobile filter button. */}
    </div>
  );
};

export default Shop;
