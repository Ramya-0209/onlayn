import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import teddyToy from "../assets/teddyToy.png";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://apis.toyshack.in/Dashboard/categories/categories");
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    (cat.categoryName + " " + cat.Description)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center text-pink-500 mb-10">
        Shop by Category
      </h1>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search categories..."
          className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-gray-500">Loading categories...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => {
              const imageUrl = cat.categoryImage
                ? `https://apis.toyshack.in/storage/categoryimages/${cat.categoryImage}`
                : teddyToy;

              return (
                <div
                  key={cat._id}
                  onClick={() =>
                    navigate(`/toys?category=${encodeURIComponent(cat.categoryName)}`)
                  }
                  className="cursor-pointer rounded-3xl overflow-hidden shadow-lg group transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl bg-white"
                >
                  {/* Large Image Block */}
                  <div className="relative w-full h-48 sm:h-40 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={cat.categoryName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = teddyToy)}
                    />
                    {/* Floating Arrow Button */}
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 w-10 h-10 flex items-center justify-center rounded-full text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaArrowRight size={16} />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-5 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {cat.categoryName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {cat.Description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No categories found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
