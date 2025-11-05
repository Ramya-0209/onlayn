import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

const PromoBanner = () => {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("https://apis.toyshack.in/Dashboard/banners/banners");
        const data = await res.json();
        setBanners(Array.isArray(data) ? data : data.banners || []);
      } catch (error) {
        console.error("Failed to load banners:", error);
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  const handleBannerClick = (banner) => {
    if (banner.products && banner.products.length > 0) {
      const productIds = banner.products.map((p) => p.productId).join(",");
      navigate(
        `/toys?productIds=${encodeURIComponent(productIds)}&bannerTitle=${encodeURIComponent(
          banner.bannerTitle || "Banner"
        )}`
      );
    } else {
      navigate("/toys");
    }
  };

  return (
    <div className="w-full">
      {banners.length > 0 && (
        <Swiper
          key={banners.length} 
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop={true}
        >
          {banners.map((banner, index) => {
            const imageUrl = banner.bannerImage
              ? `https://apis.toyshack.in/storage/bannerimages/${banner.bannerImage}`
              : "https://i.pinimg.com/1200x/40/22/15/4022156685fc28a27d02794608417dc8.jpg";

            return (
              <SwiperSlide key={banner._id || index}>
                <img
                  src={imageUrl}
                  alt={banner.bannerTitle || "Promo Banner"}
                  loading="lazy"
                  className="w-full h-[200px] md:h-[300px] lg:h-[400px] xl:h-[600px] object-cover cursor-pointer"
                  onClick={() => handleBannerClick(banner)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://i.pinimg.com/736x/8a/76/bd/8a76bd8b25a031cb2a2be47a25c972ac.jpg";
                  }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default PromoBanner;
