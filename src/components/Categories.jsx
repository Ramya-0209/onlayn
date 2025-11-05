import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/autoplay"; 
import { Autoplay } from "swiper/modules";
import "swiper/css";
import teddyToy from "../assets/teddyToy.png";
import { Link } from "react-router-dom";
import API from "../api";

const Categories = () => {
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await API.get("/Dashboard/categories/categories");
  
        const result = res.data;
  
        if (Array.isArray(result)) {
          setFetchedCategories(result);
        } else if (result && Array.isArray(result.categories)) {
          setFetchedCategories(result.categories);
        } else if (result && typeof result === "object") {
          setFetchedCategories([result]);
        } else {
          console.error("Unexpected response format:", result);
          setFetchedCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        setFetchedCategories([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading categories...</p>;
  }

  const gradients = [
    "from-pink-100 to-pink-300",
    "from-blue-100 to-blue-300",
    "from-purple-100 to-purple-300",
    "from-amber-100 to-amber-300",
    "from-green-100 to-green-300",
  ];

  const renderCategoryCard = (category, index) => {
    const bg = gradients[index % gradients.length];

    return (
      <Link
        to={`/toys?category=${encodeURIComponent(category.categoryName)}`}
        key={category._id}
      >
        <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-2 p-6 pt-20 overflow-hidden group mb-8 mt-10 h-[280px] flex flex-col justify-between">
          {/* Background Gradient */}
          <div
            className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${bg} rounded-t-3xl`}
          ></div>

          {/* Image */}
          <div className="flex justify-center -mt-6">
            <img
              src={
                category.categoryImage
                  ? `https://apis.toyshack.in/storage/categoryimages/${category.categoryImage}`
                  : teddyToy
              }
              alt={category.categoryName}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-4 border-white shadow-md bg-white z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = teddyToy;
              }}
            />
          </div>

          {/* Text */}
          <div className="text-center mt-2 px-2">
            <h3 className="text-lg font-semibold text-[#014aaf] mb-1">
              {category.categoryName}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {category.Description || "Discover amazing toys & playsets!"}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  const categoriesToShow = fetchedCategories.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-extrabold mb-2 sm:mb-6 text-center text-[#014aaf] tracking-tight">
        Explore Categories
      </h2>

      {categoriesToShow.length > 0 ? (
        <>
          {/* Mobile / Tablet: Swiper */}
          <div className="block lg:hidden">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
              }}
              autoplay={{
                delay: 2000, 
                disableOnInteraction: false, 
              }}
              loop={true} 
            >
              {categoriesToShow.map((category, index) => (
                <SwiperSlide key={category._id}>
                  {renderCategoryCard(category, index)}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-8">
            {categoriesToShow.map((category, index) =>
              renderCategoryCard(category, index)
            )}
          </div>

          {/* View All Button */}
          <div className="mt-5 text-center">
            <Link
              to="/categories"
              className="inline-block bg-[#014aaf] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              View All Categories
            </Link>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No categories found.</p>
      )}
    </div>
  );
};

export default Categories;
