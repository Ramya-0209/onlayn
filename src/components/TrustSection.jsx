import React from "react";
import {
  FaShippingFast,
  FaMoneyBillWave,
  FaBoxOpen,
  FaExchangeAlt,
  FaClock,
} from "react-icons/fa";

const TrustSection = () => {
  const features = [
    { icon: FaShippingFast, title: "Free Shipping", desc: "Enjoy fast and free delivery right to your doorstep" },
    { icon: FaBoxOpen,      title: "Open Box Delivery", desc: "Inspect your item before accepting" },
    { icon: FaExchangeAlt,  title: "Easy Exchange", desc: "Exchange your item instantly with no hassle" },
    { icon: FaMoneyBillWave,title: "Cash on Delivery", desc: "Pay after your product arrives" },
    { icon: FaClock,        title: "Same Day Delivery", desc: "Available in select cities" },
  ];  

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Blue heading */}
        <h3 className="text-3xl md:text-4xl font-extrabold text-[#014aaf] text-center mb-14">
          Why Shop With Us?
        </h3>

        {/* Equal-size, professional cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
          {features.map(({ icon: Icon, title, desc }, idx) => (
            <div
              key={idx}
              className="
                h-48 sm:h-56 md:h-45
                bg-white
                border border-gray-200
                rounded-xl
                shadow-sm hover:shadow-md
                transition-transform duration-200 hover:-translate-y-0.5
                px-5 py-6
                flex flex-col items-center text-center
              "
            >
              {/* Icon */}
              <div className="w-16 h-16 md:w-14 md:h-14 rounded-full bg-gray-50 border border-gray-200 grid place-items-center mb-4">
                <Icon className="text-4xl md:text-3xl text-pink-400" />
              </div>

              {/* Title */}
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                {title}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-5">
                {desc}
              </p>

              {/* Filler pushes content to top for consistent spacing if needed */}
              <div className="mt-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
