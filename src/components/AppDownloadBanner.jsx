import React, { useState, useEffect } from "react";

const AppDownloadBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState("other");

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) setPlatform("android");
    else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) setPlatform("ios");
    else setPlatform("other");
  }, []);

  useEffect(() => {
    const hiddenUntil = localStorage.getItem("appBannerHiddenUntil");
    const alreadyShown = localStorage.getItem("appBannerAlreadyShown");

    if (hiddenUntil && new Date(hiddenUntil) > new Date()) return;

    if (alreadyShown === "true") {
      setIsVisible(true);
      return;
    }

    let timer = setTimeout(() => {
      setIsVisible(true);
      localStorage.setItem("appBannerAlreadyShown", "true");
    }, 120000); 

    const handleUserActivity = () => {
      if (!isVisible) {
        setIsVisible(true);
        localStorage.setItem("appBannerAlreadyShown", "true");
        clearTimeout(timer);
      }
    };

    window.addEventListener("scroll", handleUserActivity, { once: true });
    window.addEventListener("mousemove", handleUserActivity, { once: true });
    window.addEventListener("keydown", handleUserActivity, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    localStorage.setItem("appBannerHiddenUntil", tomorrow.toISOString());
    localStorage.removeItem("appBannerAlreadyShown");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[75%] sm:w-auto">
      <div className="flex sm:flex-row items-center gap-2 p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 max-w-xl mx-auto relative">
        <span className="text-sm font-semibold tracking-wide text-center sm:text-left md:text-center lg:text-base">
          ✨ Download our app
        </span>

        <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
          {platform === "android" && (
            <a
              href="https://play.google.com/store/apps/details?id=com.onlayn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 bg-white rounded-full shadow-lg transition-all duration-300 hover:bg-gray-100"
            >
              Play Store
            </a>
          )}
          {platform === "ios" && (
            <a
              href="https://apps.apple.com/app/id1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 bg-white rounded-full shadow-lg transition-all duration-300 hover:bg-gray-100"
            >
              App Store
            </a>
          )}
          {platform === "other" && (
            <>
              <a
                href="https://play.google.com/store/apps/details?id=com.onlayn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 bg-white rounded-full shadow-lg transition-all duration-300 hover:bg-gray-100"
              >
                Play Store
              </a>
              <a
                href="https://apps.apple.com/app/id1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 bg-white rounded-full shadow-lg transition-all duration-300 hover:bg-gray-100"
              >
                App Store
              </a>
            </>
          )}
        </div>

        <button
          onClick={handleClose}
          aria-label="Close banner"
          className="absolute top-5 sm:top-8 right-4 sm:static p-1 text-white transition-transform duration-300 rounded-full hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AppDownloadBanner;





