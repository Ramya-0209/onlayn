import React from "react";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./testimonials.css";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const testimonials = [
  {
    name: "Aarav’s Mom",
    feedback:
      "Absolutely love the toy quality! My little one plays with the plush bear every day. Great service too!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Reema D.",
    feedback:
      "Fast delivery and beautifully packed. The art set kept my kids busy for hours. Highly recommended!",
    rating: 4,
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&h=200",
  },
  {
    name: "Kiran P.",
    feedback:
      "Loved the building blocks! My nephew is obsessed. Super easy checkout and fast shipping.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Manish",
    feedback:
      "The educational puzzles are fantastic! My daughter is learning while having fun. Will order again.",
    rating: 5,
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=200",
  },
  {
    name: "Rajiv K.",
    feedback:
      "Great variety of toys. The car set I bought was sturdy and safe. Excellent customer support as well.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80",
  },
];

const Testimonials = () => {
  // Utility function to pick a color based on a string
const getColorFromName = (name) => {
  const colors = [
    "bg-pink-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-yellow-300",
    "bg-purple-300",
    "bg-orange-300",
    "bg-teal-300",
    "bg-red-300",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

  return (
    <section className="bg-pink-400 py-16 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative">
        <h2 className="text-4xl font-bold text-white mb-4">
          What Parents Are Saying
        </h2>
        <p className="text-white mb-10">
          Real stories from families who love ToyShack.
        </p>

        {/* Left Arrow */}
        <button
          className="swiper-button-prev-custom"
          aria-label="Previous Slide"
        >
          <IoChevronBack size={24} />
        </button>

        {/* Right Arrow */}
        <button
          className="swiper-button-next-custom"
          aria-label="Next Slide"
        >
          <IoChevronForward size={24} />
        </button>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl p-6 mb-5 shadow-md h-full relative overflow-hidden">
                <span className="absolute top-3 right-4 text-4xl text-rose-300 rotate-[10deg]">❝</span>
                <span className="decoration bottom-2 left-3 sparkle">✧</span>
                <span className="decoration top-10 left-4 sparkle">✦</span>
                <span className="decoration top-35 right-3 sparkle">✦ ✨ ✦</span>

                <div className="flex justify-start text-yellow-400 mb-2">
                  {Array(review.rating)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} />
                    ))}
                </div>

                <p className="text-gray-700 text-sm mb-6">{review.feedback}</p>

                <div className="flex items-center gap-3 mt-auto">
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 shadow-sm"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-pink-200 shadow-sm text-white font-bold text-lg ${getColorFromName(
                        review.name
                      )}`}
                    >
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-gray-800">{review.name}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
