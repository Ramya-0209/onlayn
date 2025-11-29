import React from "react";
import Testimonials from "../components/Testimonials";
import { ShieldCheck, BookOpen, Leaf, Truck } from "lucide-react";
import { motion } from "framer-motion";
import aboutimg from "../assets/images/about-img.png";

const About = () => {
  const highlights = [
    {
      icon: <ShieldCheck className="text-pink-500 w-6 h-6" />,
      bg: "bg-pink-100",
      title: "100% Safe Materials",
      desc: "Certified, non-toxic, and child-safe toys designed for peace of mind.",
    },
    {
      icon: <BookOpen className="text-yellow-500 w-6 h-6" />,
      bg: "bg-yellow-100",
      title: "Learning Through Play",
      desc: "Toys that encourage creativity, critical thinking, and curiosity.",
    },
    {
      icon: <Leaf className="text-blue-500 w-6 h-6" />,
      bg: "bg-blue-100",
      title: "Eco-Friendly Choices",
      desc: "We care for the planet with sustainable toys and recyclable packaging.",
    },
    {
      icon: <Truck className="text-green-500 w-6 h-6" />,
      bg: "bg-green-100",
      title: "Fast & Reliable Delivery",
      desc: "Timely and secure delivery across India so every gift arrives with joy.",
    },
  ];
  return (
    <section className="bg-white py-16 min-h-screen">
      {/* Intro Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Text Section */}
          <div className="lg:col-span-6 text-justify">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
              Welcome to{" "}
              <span className="font-extrabold text-[#e93772]">Onl</span>
              <span className="font-extrabold text-[#13426b]">ayn</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-5">
              Onlayn is where fun meets learning! We are a passionate team of
              parents and educators dedicated to curating the safest, most
              delightful toys that inspire creativity, critical thinking, and
              Shackful memories.
            </p>
            <p className="text-gray-600 text-base sm:text-lg mb-5">
              From plush companions for infants to exciting educational kits for
              curious minds, every product is handpicked with care and purpose. We
              believe toys should nurture imagination and bring smiles to every
              child's face.
            </p>
            <p className="text-gray-600 text-base sm:text-lg">
              At onlayn, we value safety, sustainability, and spark. Our goal is
              to make childhood magical and memorable — one toy at a time.
            </p>
          </div>

          {/* Image Section */}
          <div className="lg:col-span-6 flex justify-center mt-8 lg:mt-0">
            <div className="relative w-full max-w-md sm:max-w-lg">
              <img
                src={aboutimg}
                alt="Happy kids with toys"
                className="shadow-xl w-full rounded-lg object-cover"
              />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-pink-100 border border-pink-300 text-pink-700 font-semibold px-2 sm:px-4 py-2 rounded-full shadow-lg text-sm sm:text-base">
               Trusted by many families❤️
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section - Full Width */}
      <Testimonials />

      {/* Highlights Section */}
      <div className="px-4 sm:px-6 lg:px-8 mt-24">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-12">
            Why Parents Love{" "}
            <span className="text-[#e93772]">On</span>
            <span className="text-[#13426b]">layn</span>
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4 sm:gap-6 p-4 rounded-xl bg-white hover:shadow-lg transition"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${item.bg} flex items-center justify-center shadow-md`}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
  
};

export default About;
