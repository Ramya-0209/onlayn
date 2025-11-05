import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import API from "../api";

const tabs = ["Best Sellers", "New Arrivals", "Featured"];
const PRODUCTS_PER_TAB = 6;

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState("Best Sellers");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/Dashboard/products/all-products");
        const fetched = Array.isArray(res.data) ? res.data : res.data.products;
        setAllProducts(Array.isArray(fetched) ? fetched : []);
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  const categorizedProducts = useMemo(() => {
    const usedIds = new Set();
    const result = {};
    const shuffled = shuffleArray(allProducts);

    tabs.forEach((tab) => {
      const available = shuffled.filter(p => !usedIds.has(p._id));
      const selected = available.slice(0, PRODUCTS_PER_TAB);
      selected.forEach(p => usedIds.add(p._id));
      result[tab] = selected;
    });

    return result;
  }, [allProducts]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <section className="bg-gradient-to-br from-pink-100 via-purple-50 to-teal-50 py-20 px-3 md:px-10">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#014aaf] mb-4">
          Discover Our Toys
        </h2>
        <p className="text-black text-lg mb-10 max-w-2xl mx-auto">
          Pick the perfect toy for your little ones – fun, safe, and colorful!
        </p>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 flex-wrap mb-14">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-6 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? "bg-pink-500 shadow-md scale-105 text-white"
                  : "bg-white text-pink-600 border border-pink-300 hover:bg-pink-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <p className="text-lg text-gray-500 animate-pulse">Loading toys...</p>
        ) : (
          <div className="grid gap-4 sm:gap-5 px-1 grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 max-w-5xl mx-auto">
            {(categorizedProducts[activeTab] || []).map((product) => (
              <div key={product._id} className="w-full max-w-xs mx-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="mt-14">
          <Link
            to="/toys"
            className="inline-block bg-[#014aaf] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;






