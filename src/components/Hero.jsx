import React from "react";
import { FaStar, FaBolt, FaBoxOpen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Plush Toys",
      price: "From ₹599",
      emoji: "🧸",
      bg: "bg-gradient-to-br from-pink-200 to-pink-300",
      category: "Plush Toys",
    },
    {
      title: "Remote Cars",
      price: "From ₹799",
      emoji: "🚗",
      bg: "bg-gradient-to-br from-purple-200 to-purple-300",
      category: "Remote Cars",
    },    
    {
      title: "Board Games",
      price: "From ₹1099",
      emoji: "🎲",
      bg: "bg-gradient-to-br from-teal-200 to-teal-300",
      category: "Board Games",
    },
    {
      title: "Art Supplies",
      price: "From ₹349",
      emoji: "🎨",
      bg: "bg-gradient-to-br from-yellow-200 to-orange-300",
      category: "Art Supplies",
    },
  ];  

  const handleCardClick = (category) => {
    navigate(`/toys?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="bg-gradient-to-br from-pink-100 via-purple-50 to-teal-100 py-16 md:py-20 lg:py-28 px-6 sm:px-10 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
  
        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
  
          {/* Ratings */}
          <div className="flex justify-center lg:justify-start items-center gap-2 text-sm text-gray-600 mb-4">
            <div className="flex text-yellow-400 text-base">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
            </div>
            <span className="font-medium">Loved and trusted by many families</span>
          </div>
  
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            Big Joy for{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Small Hands.
            </span>
            <br />
            Unboxing Their Happiness
          </h1>
  
          {/* Paragraph */}
          <p className="text-gray-700 mb-8 text-lg sm:text-xl leading-relaxed max-w-sm sm:max-w-md mx-auto lg:mx-0">
            Explore playful toys that inspire creativity, spark imagination, and bring joyful
            moments to your little one’s everyday adventures.
          </p>
  
          {/* Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-full text-sm sm:text-base font-medium">
              <FaBolt className="text-yellow-500 text-2xl" /> SAME DAY DELIVERY
            </span>
  
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-3 rounded-full text-sm sm:text-base font-medium">
              <FaBoxOpen className="text-blue-500 text-2xl" /> OPEN BOX DELIVERY
            </span>
          </div>
  
          {/* Buttons */}
          <div className="flex gap-4 justify-center lg:justify-start items-center">
            <Link
              to="/toys"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm sm:text-base font-bold px-7 py-4 rounded-full hover:scale-105 transition duration-200 shadow"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
  
            <Link
              to="/categories"
              className="inline-flex items-center border-2 border-pink-500 text-pink-600 font-bold px-7 py-4 text-sm sm:text-base rounded-full hover:bg-pink-500 hover:text-white transition duration-200"
            >
              View Categories
            </Link>
          </div>
        </div>
  
        {/* RIGHT SECTION: Cards */}
        <div className="w-full sm:w-lg lg:w-1/2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(card.category)}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl hover:-translate-y-3 transform transition duration-300 cursor-pointer"
            >
              <div
                className={`h-24 sm:h-28 rounded-xl flex items-center justify-center text-3xl sm:text-4xl ${card.bg}`}
              >
                {card.emoji}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 text-sm sm:text-base">{card.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{card.price}</p>
            </div>
          ))}
        </div>
  
      </div>
    </section>
  );
  
};

export default Hero;
