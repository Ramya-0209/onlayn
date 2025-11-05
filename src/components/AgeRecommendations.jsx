import React from "react";
import { Link } from "react-router-dom";
import img0to2 from "../assets/images/0-2yrs.png";
import img3to5 from "../assets/images/3-5yrs.png";
import img6to8 from "../assets/images/6-8yrs.png";
import img9plus from "../assets/images/9+yrs.png";

const ageGroups = [
  {
    label: "0 - 2",
    value: "0-2",
    image: img0to2,
    blob: "bg-gradient-to-br from-blue-100 to-blue-200", 
  },
  {
    label: "3 - 5",
    value: "3-5",
    image: img3to5,
    blob: "bg-gradient-to-br from-lime-100 to-lime-200", 
  },
  {
    label: "6 - 8",
    value: "6-8",
    image: img6to8,
    blob: "bg-gradient-to-br from-pink-100 to-pink-200", 
  },
  {
    label: "9 +",
    value: "9+",
    image: img9plus,
    blob: "bg-gradient-to-br from-teal-100 to-teal-200", 
  },
];

const AgeRecommendations = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-10 text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-[#014aaf] mb-4">Shop by Age</h2>
        <p className="text-gray-600 mb-14 text-lg">
          Find the perfect toys for every stage of your child's growth.
        </p>

        <div className="flex flex-wrap justify-center gap-16">
          {ageGroups.map((group) => (
            <Link
              key={group.value}
              to={`/toys?age=${group.value}`}
              className="flex flex-col items-center max-w-[540px] group"
            >
              {/* Blob and Image */}
              <div
                className={`relative w-38 h-38 md:w-62 md:h-62 lg:w-46 lg:h-46 xl:w-62 xl:h-62 rounded-full ${group.blob} flex items-center justify-center`}
                style={{ borderRadius: "60% 40% 30% 70% / 50% 60% 40% 50%" }}
              >
                <img
                  src={group.image}
                  alt={group.label}
                  className="w-28 h-28 sm:w-48 sm:h-48 lg:w-32 lg:h-32 xl:w-36 xl:h-36 object-cover rounded-full z-10"
                />
              </div>

              {/* Age Text */}
              <p className="mt-4 text-xl font-bold text-black">
                {group.label} <span className="font-medium">Years</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgeRecommendations;
