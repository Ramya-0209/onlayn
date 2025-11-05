import React from "react";
import {
 FaPhoneAlt,
 FaFacebookF,
 FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "sonner";
import API from "../api";

const ContactBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { resetCartState } = useCart();
  const { clearWishlistState } = useWishlist();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await API.post("/Dashboard/Customers/logout");

      ["token", "firstName", "lastName", "mobileNumber", "email"].forEach(key =>
        localStorage.removeItem(key)
      );

      logout();
      resetCartState();
      clearWishlistState();

      toast.success("Logged out successfully!", { id: toastId });

      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);

      ["token", "firstName", "lastName", "mobileNumber", "email"].forEach(key =>
        localStorage.removeItem(key)
      );
      logout();
      resetCartState();
      clearWishlistState();

      toast.error("Logout failed, but you have been logged out locally.", { id: toastId });
      setTimeout(() => navigate("/"), 800);
    }
  };

 return (
  <div className="bg-pink-100 text-md text-black px-4 sm:px-16 py-4 shadow-sm">
   <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
    {/* Left: Contact Info */}
    <div className="flex flex-wrap items-center gap-4 text-[#014aaf] font-medium">
     <a
      href="tel:+918121301888"
      className="flex items-center gap-1 hover:text-[#fb67c2] transition"
      aria-label="Phone number"
     >
      <FaPhoneAlt />
      <span>+91 8121301888</span>
     </a>
     <a
      href="mailto:hello.toyshack@gmail.com"
      className="flex items-center gap-1 hover:text-[#fb67c2] transition"
      aria-label="Email"
     >
      <MdEmail />
      <span>hello.toyshack@gmail.com</span>
     </a>
    </div>

    {/* Right: Auth and Socials */}
    <div className="flex flex-wrap items-center gap-4 text-[#014aaf] font-medium">
    {user ? (
      <>
       <span className="text-pink-600 flex items-center gap-2">
        Welcome, <span className="font-semibold">{user.name || user.firstName}</span>
       </span>
       <button
        onClick={handleLogout}
        className="flex items-center gap-1 hover:text-[#fb67c2] transition focus:outline-none cursor-pointer"
       >
        <FaSignOutAlt />
        Logout
       </button>
      </>
     ) : (
      <div className="flex items-center gap-2">
       <Link
        to="/login"
        className="flex items-center gap-1 hover:text-[#fb67c2] transition"
        aria-label="Login"
       >
        {/* <FaUser /> */}
        Login
       </Link>
       <span>|</span>
       <Link
        to="/signup"
        className="flex items-center gap-1 hover:text-[#fb67c2] transition"
        aria-label="Signup"
       >
        {/* <FaUser /> */}
        Sign Up
       </Link>
      </div>
     )}

     <div className="flex items-center gap-3 text-lg font-bold">
      {/* Facebook */}
      <a
       href="https://facebook.com"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Facebook"
       className="transition"
       style={{ color: "#1877F2" }} // Facebook blue
      >
       <FaFacebookF />
      </a>

      <a
       href="https://instagram.com"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Instagram"
       className="transition hover:opacity-80"
      >
       <FaInstagram style={{ color: "#E4405F" }}/>
      </a>

      {/* Twitter/X */}
      <a
       href="https://twitter.com"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Twitter"
       className="transition"
       style={{ color: "black" }} // Classic Twitter blue
      >
       <FaXTwitter />
      </a>
     </div>
    </div>
   </div>
  </div>
 );
};

export default ContactBar;
