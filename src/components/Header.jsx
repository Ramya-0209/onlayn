import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHeart,
  FaUserCircle,
  FaSignOutAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import API from "../api";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { cartCount, resetCartState } = useCart();
  const { clearWishlistState } = useWishlist();
  const location = useLocation();
  const { user, logout } = useAuth();
  const profileRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();

  const [pincode, setPincode] = useState("");
  const [isPincodeValid, setIsPincodeValid] = useState(null);
  const [showPincodeInput, setShowPincodeInput] = useState(false);
  const [deliveryPincodes, setDeliveryPincodes] = useState([]);
  const pincodeRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchPincodes = async () => {
      try {
        const response = await axios.get(
          "https://apis.toyshack.in/Dashboard/deliverypincode/all-delivery-pincodes"
        );
        const validPincodes = response.data.map((item) => item.pincode);
        setDeliveryPincodes(validPincodes);
      } catch (error) {
        console.error("Error fetching delivery pincodes:", error);
      }
    };

    fetchPincodes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (pincodeRef.current && !pincodeRef.current.contains(event.target)) {
        setShowPincodeInput(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShowProfileMenu(false);
        setShowPincodeInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await API.post("/Dashboard/Customers/logout");

      ["token", "firstName", "lastName", "mobileNumber", "email"].forEach(
        (key) => localStorage.removeItem(key)
      );

      logout();
      resetCartState();
      clearWishlistState();

      setShowProfileMenu(false);

      toast.success("Logged out successfully!", { id: toastId });

      setTimeout(() => {
        navigate("/");
        window.location.reload(); 
      }, 800);
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);

      ["token", "firstName", "lastName", "mobileNumber", "email"].forEach(
        (key) => localStorage.removeItem(key)
      );
      logout();
      resetCartState();
      clearWishlistState();
      setShowProfileMenu(false);

      toast.warning("Logout failed, but you have been logged out locally.", {
        id: toastId,
      });

      setTimeout(() => {
        navigate("/");
        window.location.reload(); 
      }, 800);
    }
  };

  const handlePincodeCheck = () => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      toast.warning("Please enter a valid 6-digit pincode.");
      setIsPincodeValid(false);
      return;
    }

    const isValid = deliveryPincodes.includes(pincode);
    setIsPincodeValid(isValid);

    if (isValid) {
      toast.success("Delivery is available for this pincode!");
    } else {
      toast.error(
        "Delivery to this pincode isn’t available yet — we’ll be reaching you soon!"
      );
    }
  };

  const iconNavLinkClasses = (isActive) =>
    `relative text-xl p-2 rounded-full transition duration-200 ${
      isActive
        ? "text-[#fb67c2]"
        : "text-[#014aaf] hover:text-[#eb4bb0] hover:bg-[#fce3f5]"
    }`;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/toys", label: "Toys" },
    { to: "/categories", label: "Categories" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isHardRefreshLinkActive = (to) => location.pathname === to;

  return (
    <header className="bg-white border-b border-[#e7e7e7] shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between py-3 px-3 md:px-6 lg:px-14">
        <a href="/" aria-label="Home">
          <img
            src={logo}
            alt="ToyShack Logo"
            className="h-11 lg:h-16 xl:h-22"
          />
        </a>
        <nav className="hidden md:flex gap-10 md:gap-5 lg:gap-6 xl:gap-10 text-xs md:text-xs lg:text-base xl:text-lg font-semibold text-black">
          {navLinks.map(({ to, label }) => (
            // FIX: Replaced NavLink with standard <a> tag to force a full page refresh
            <a
              key={to}
              href={to}
              className={
                isHardRefreshLinkActive(to)
                  ? "text-[#fb67c2] font-semibold border-b-2 border-[#fb67c2] pb-1 transition"
                  : "text-[#014aaf] hover:text-[#eb4bb0] transition pb-1"
              }
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1 lg:gap-4 relative" ref={searchRef}>
          {/* Pincode Check Feature */}
          <div className="relative" ref={pincodeRef}>
            <div
              onClick={() => {
                setShowPincodeInput(!showPincodeInput);
                setPincode(""); 
                setIsPincodeValid(null); 
              }}
              className="flex items-center relative cursor-pointer"
            >
              {/* Pincode Icon Button */}
              <button
                className="relative p-2 rounded-full transition duration-200 cursor-pointer text-[#014aaf] hover:text-[#eb4bb0] hover:bg-[#fce3f5]"
                aria-label="Check Delivery Pincode"
              >
                <FaMapMarkerAlt className="text-xl md:text-lg lg:text-2xl" />
              </button>

              {/* Responsive Red Message */}
              <span
                className="
                  text-[10px] sm:text-xs lg:text-md
                  font-semibold text-red-700 bg-red-100
                  px-1 sm:px-3 md:px-2
                  py-0.5 sm:py-1
                  rounded-md md:rounded-full
                  border border-red-700
                  animate-pulse
                  whitespace-nowrap
                "
              >
                Verify your pincode
              </span>
            </div>

            {showPincodeInput && (
              <div
                className="absolute -left-30 sm:-left-20 lg:left-0 right-20 top-full mt-2 w-72 bg-white rounded-lg shadow-xl z-50 border border-[#fcd6ec] p-4 flex flex-col gap-2 animate-fadeIn"
              >
                <h4 className="text-sm font-semibold text-gray-700">
                  Verify Your Pincode
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setPincode(value);
                    }}
                    placeholder="Enter 6-digit Pincode"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fb67c2]"
                    maxLength="6"
                  />
                  <button
                    onClick={handlePincodeCheck}
                    disabled={pincode.length !== 6} 
                    className={`px-4 py-2 text-sm font-bold text-white rounded-md transition cursor-pointer ${
                      pincode.length === 6
                        ? "bg-[#014aaf] hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Check
                  </button>
                </div>

                {isPincodeValid !== null && (
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      isPincodeValid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPincodeValid
                      ? "Delivery is available to your area ✅"
                      : "Delivery to this pincode isn’t available yet, but we’ll be reaching you soon! 😊"}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            aria-label="Wishlist"
            className={({ isActive }) => iconNavLinkClasses(isActive)}
          >
            <FaHeart className="text-xl md:text-lg lg:text-2xl" />
          </NavLink>
          {/* Cart */}
          <NavLink
            to="/cart"
            aria-label="Cart"
            className={({ isActive }) => iconNavLinkClasses(isActive)}
          >
            <FaShoppingCart className="text-xl md:text-lg lg:text-2xl" />
            {cartCount > 0 && (
              <span className="absolute top-0 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
            )}
          </NavLink>
          {/* User Profile */}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className={`relative text-xl p-2 rounded-full transition duration-200 cursor-pointer ${
                  showProfileMenu
                    ? "text-[#fb67c2]"
                    : "text-[#014aaf] hover:text-[#eb4bb0] hover:bg-[#fce3f5]"
                }`}
                aria-label="Profile"
              >
                <FaUserCircle className="text-xl md:text-lg lg:text-2xl" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg z-50 border border-[#fcd6ec] overflow-hidden">
                  <div className="py-2">
                    <NavLink
                      to="/account"
                      onClick={() => setShowProfileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-2 text-sm transition cursor-pointer ${
                          isActive
                            ? "text-[#fb67c2] font-semibold border-l-4 border-[#fb67c2] bg-[#fce3f5]"
                            : "text-gray-700 hover:bg-[#fce3f5]"
                        }`
                      }
                    >
                      <FaUserCircle className="text-2xl md:text-lg text-[#014aaf]" />
                      My Account
                    </NavLink>
                  </div>
                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-5 py-2 text-sm text-red-600 hover:bg-[#ffecec] transition cursor-pointer"
                    >
                      <FaSignOutAlt className="text-red-500" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#014aaf] text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-5 pt-2 flex flex-col gap-3 font-medium text-black transition-all duration-300 rounded-b-2xl shadow-sm items-center">
          {navLinks.map(({ to, label }) => (
            <a
              key={to}
              href={to}
              className={
                isHardRefreshLinkActive(to)
                  ? "text-[#fb67c2] font-semibold border-b-2 border-[#fb67c2] pb-1 transition"
                  : "text-[#014aaf] hover:text-[#eb4bb0] transition pb-1"
              }
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;