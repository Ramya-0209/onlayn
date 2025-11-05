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
      title: "Cute Dresses",
      price: "From ₹899",
      emoji: "👗",
      bg: "bg-gradient-to-br from-purple-200 to-purple-300",
      category: "Cute Dresses",
    },
    {
      title: "Premium Diapers",
      price: "From ₹1099",
      emoji: "👶",
      bg: "bg-gradient-to-br from-teal-200 to-teal-300",
      category: "Premium Diapers",
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
    <section className="bg-gradient-to-br from-pink-100 via-purple-50 to-teal-100 py-18 lg:py-28 px-10 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* LEFT SECTION */}
        <div className="max-w-xl text-center lg:text-left">
          <div className="flex justify-center lg:justify-start items-center gap-2 text-sm text-gray-600 mb-4">
            <div className="flex text-yellow-400 text-base">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
            </div>
            <span className="font-medium">Trusted by 10k+ families</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Everything Your <br />
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Little One
            </span>{" "}
            Needs
          </h1>

          <p className="text-gray-700 mb-8 text-xl leading-relaxed">
            Discover premium quality toys, comfortable diapers, and adorable
            dresses that bring joy to every moment of childhood.
          </p>

          <div className="flex justify-center lg:justify-start items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-0 sm:gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm sm:text-lg lg:text-sm xl:text-lg font-medium">
              <FaBolt className="text-yellow-500 text-xl" /> SAME DAY DELIVERY
            </span>

            <span className="inline-flex items-center gap-0 sm:gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm sm:text-lg  lg:text-sm xl:text-lg font-medium">
              <FaBoxOpen className="text-blue-500 text-xl" /> OPEN BOX DELIVERY
            </span>
          </div>

          <div className="flex gap-4 justify-center lg:justify-start items-center">
            <Link
              to="/toys"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm sm:text-base font-bold px-7 py-4 rounded-full hover:scale-105 transition duration-200 shadow"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/categories"
              className="inline-flex items-center border-2 border-pink-500 text-pink-600 font-bold px-7 py-4 text-sm sm:text-base rounded-full hover:bg-pink-500 hover:text-white active:bg-pink-600 transition duration-200"
            >
              View Categories
            </Link>
          </div>
        </div>

        {/* RIGHT SECTION: Cards */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(card.category)}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl hover:-translate-y-3 transform transition duration-300 cursor-pointer"
            >
              <div
                className={`h-28 rounded-xl flex items-center justify-center text-4xl ${card.bg}`}
              >
                {card.emoji}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
