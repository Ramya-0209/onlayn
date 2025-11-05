import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ScrollableDropdown from "./ScrollableDropdown";
import ScrollableMultiSelect from "./ScrollableMultiSelect";
import axios from "axios";

const Section = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {children}
  </div>
);

const Pill = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-sm border transition
      ${active ? "bg-pink-100 text-pink-800 border-pink-300 font-semibold"
               : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}`}
  >
    {children}
  </button>
);

const RadioRow = ({ options, value, onChange, name = "radio" }) => (
  <div className="grid gap-2 text-sm">
    {options.map((opt) => (
      <label
        key={opt.value}
        className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border
          ${value === opt.value ? "border-pink-300 bg-pink-50" : "border-gray-200"}`}
      >
        <input
          type="radio"
          name={name}
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
        />
        <span className="text-gray-700">{opt.label}</span>
      </label>
    ))}
  </div>
);

const FilterBar = ({
  selectedCategory, setSelectedCategory,
  selectedAge, setSelectedAge,
  selectedPrice, setSelectedPrice,
  searchQuery, setSearchQuery,
  sortOption, setSortOption,
  labels = [],
  advancedFilters,
  onAdvancedChange,
}) => {
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(null);

  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState(null);

  const sizeOptions = ["S", "M", "L", "XL", "One Size"];

  // ------------------ Load Categories ------------------
  useEffect(() => {
    setCatLoading(true);
    axios
      .get("https://apis.toyshack.in/Dashboard/categories/categories")
      .then((res) => {
        const list = res.data.categories?.map((c) => c.categoryName).filter(Boolean) || [];
        setCategories(list);
        setCatLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCatError("Failed to load categories");
        setCatLoading(false);
      });
  }, []);

  // ------------------ Load Brands ------------------
  useEffect(() => {
    setBrandsLoading(true);
    axios
      .get("https://apis.toyshack.in/Dashboard/brands/brands")
      .then((res) => {
        const list = res.data.brands?.map((b) => b.brandName).filter(Boolean) || [];
        setBrands(list);
        setBrandsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setBrandsError("Failed to load brands");
        setBrandsLoading(false);
      });
  }, []);

  const clearAll = () => {
    setSelectedCategory("All");
    setSelectedAge("All");
    setSelectedPrice("All");
    setSearchQuery("");
    setSortOption("");
    onAdvancedChange({
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
  };

  const activeChips = useMemo(() => {
    const chips = [];
    const push = (label, clear) => chips.push({ label, clear });

    if (searchQuery) push(`Search: "${searchQuery}"`, () => setSearchQuery(""));
    if (selectedCategory !== "All") push(selectedCategory, () => setSelectedCategory("All"));
    if (selectedAge !== "All") push(`Age: ${selectedAge}`, () => setSelectedAge("All"));
    if (selectedPrice !== "All") push(selectedPrice, () => setSelectedPrice("All"));
    if (advancedFilters.inStockOnly)
      push("In Stock", () => onAdvancedChange({ ...advancedFilters, inStockOnly: false }));
    if (advancedFilters.sameDayOnly)
      push("Same Day", () => onAdvancedChange({ ...advancedFilters, sameDayOnly: false }));
    if (advancedFilters.ratingMin)
      push(`${advancedFilters.ratingMin}★ & up`, () =>
        onAdvancedChange({ ...advancedFilters, ratingMin: 0 })
      );
    if (advancedFilters.brands.length)
      push(`Brands (${advancedFilters.brands.length})`, () =>
        onAdvancedChange({ ...advancedFilters, brands: [] })
      );
    if (advancedFilters.sizes.length)
      push(`Sizes (${advancedFilters.sizes.length})`, () =>
        onAdvancedChange({ ...advancedFilters, sizes: [] })
      );
    if (advancedFilters.colors.length)
      push(`Colors (${advancedFilters.colors.length})`, () =>
        onAdvancedChange({ ...advancedFilters, colors: [] })
      );
    if (advancedFilters.labels.length)
      push(`Labels (${advancedFilters.labels.length})`, () =>
        onAdvancedChange({ ...advancedFilters, labels: [] })
      );
    if (advancedFilters.priceMin !== 0 || advancedFilters.priceMax !== Infinity)
      push(`₹${advancedFilters.priceMin}–₹${advancedFilters.priceMax}`, () =>
        onAdvancedChange({ ...advancedFilters, priceMin: 0, priceMax: Infinity })
      );
    if (advancedFilters.discountMin)
      push(`${advancedFilters.discountMin}%+ off`, () =>
        onAdvancedChange({ ...advancedFilters, discountMin: 0 })
      );

    return chips;
  }, [searchQuery, selectedCategory, selectedAge, selectedPrice, advancedFilters, onAdvancedChange]);

  const catOptions = useMemo(() => ["All", ...Array.from(new Set(categories)).sort()], [categories]);
  const brandOptions = useMemo(() => Array.from(new Set(brands)).sort(), [brands]);

  return (
    <aside className="bg-white border border-gray-200 shadow-xl p-5 space-y-6 sticky top-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#014aaf]">Filters</h2>
        <button
          onClick={clearAll}
          className="text-sm text-pink-600 hover:text-pink-700 font-medium cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((c, i) => (
            <button
              key={i}
              className="px-2.5 py-1 rounded-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 cursor-pointer"
            >
              {c.label} <span onClick={c.clear} className="ml-1">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search toys..."
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      <Section label="Category">
        <ScrollableDropdown
          options={catOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          maxHeightClass="max-h-56"
          placeholder={
            catLoading
              ? "Loading categories..."
              : catError
              ? "Couldn't load categories"
              : "Select category"
          }
          disabled={catLoading}
        />
        {catError && <p className="mt-1 text-xs text-red-600">{catError}</p>}
      </Section>

      <Section label="Age Group">
        <select
          value={selectedAge}
          onChange={(e) => setSelectedAge(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
        >
          {["All", "0-2", "3-5", "6-8", "9+"].map((a) => (
            <option key={a} value={a} className="cursor-pointer">
              {a === "All" ? "All Ages" : `${a} years`.replace("9+ years", "9+ years")}
            </option>
          ))}
        </select>
      </Section>

      <Section label="Price Range">
        <select
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="All">All Prices</option>
          <option value="Under 500">Under ₹500</option>
          <option value="500-1000">₹500 – ₹1000</option>
          <option value="Above 1000">Above ₹1000</option>
        </select>
      </Section>

      {brandOptions.length > 0 && (
        <Section label="Brand">
          {brandsLoading ? (
            <p className="text-sm text-gray-500">Loading brands...</p>
          ) : brandsError ? (
            <p className="text-sm text-red-600">{brandsError}</p>
          ) : (
            <ScrollableMultiSelect
              options={brandOptions}
              values={advancedFilters.brands}
              onChange={(vals) => onAdvancedChange({ ...advancedFilters, brands: vals })}
              placeholder="Select brands"
              maxHeightClass="max-h-64"
              searchable
            />
          )}
        </Section>
      )}

      {!!sizeOptions.length && (
        <Section label="Size">
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => {
                  const newSizes = advancedFilters.sizes.includes(size)
                    ? advancedFilters.sizes.filter((s) => s !== size)
                    : [...advancedFilters.sizes, size];
                  onAdvancedChange({ ...advancedFilters, sizes: newSizes });
                }}
                className={`px-3 py-1 rounded-full border font-semibold cursor-pointer text-xs ${
                  advancedFilters.sizes.includes(size)
                    ? "bg-[#014aaf] text-white border-[#014aaf]"
                    : "text-gray-700 border-gray-300 hover:border-gray-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </Section>
      )}

      {!!labels.length && (
        <Section label="Labels">
          <div className="flex flex-wrap gap-2">
            {labels.map((l) => (
              <Pill
                key={l}
                active={advancedFilters.labels.includes(l)}
                onClick={() => {
                  const newLabels = advancedFilters.labels.includes(l)
                    ? advancedFilters.labels.filter((x) => x !== l)
                    : [...advancedFilters.labels, l];
                  onAdvancedChange({ ...advancedFilters, labels: newLabels });
                }}
              >
                {l}
              </Pill>
            ))}
          </div>
        </Section>
      )}

      <Section label="Minimum Discount">
        <input
          type="range"
          min={0}
          max={80}
          value={advancedFilters.discountMin}
          onChange={(e) =>
            onAdvancedChange({ ...advancedFilters, discountMin: Number(e.target.value) })
          }
          className="w-full cursor-pointer"
        />
        <div className="text-xs text-gray-600">{advancedFilters.discountMin}% or more</div>
      </Section>

      <Section label="Sort By">
        <RadioRow
          value={sortOption}
          onChange={setSortOption}
          name="sortOption"
          options={[
            { value: "", label: "Default" },
            { value: "Price: Low to High", label: "Price: Low to High" },
            { value: "Price: High to Low", label: "Price: High to Low" },
          ]}
        />
      </Section>
    </aside>
  );
};

export default FilterBar;
