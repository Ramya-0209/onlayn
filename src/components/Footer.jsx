import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../assets/logo3.png";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-pink-100 text-gray-800 pt-10 pb-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">

        {/* Logo + Description */}
        <div className="flex flex-col items-center sm:items-start">
          <Link to="/" aria-label="Home">
            <img
              src={logo}
              alt="ToyShack Logo"
              className="h-20"
            />
          </Link>

          <p className="text-sm mt-4 max-w-[240px]">
          Trusted by parents and loved by kids, our toys are designed to be safe, affordable, and full of joy — making playtime more meaningful at every stage of childhood.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center sm:items-start">
          <h4 className="text-lg font-semibold text-[#014aaf] mb-3">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-pink-600 transition">Home</Link></li>
            <li><Link to="/toys" className="hover:text-pink-600 transition">Toys</Link></li>
            <li><Link to="/categories" className="hover:text-pink-600 transition">Categories</Link></li>
            <li><Link to="/about" className="hover:text-pink-600 transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-pink-600 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center sm:items-start">
          <h4 className="text-lg font-semibold text-[#014aaf] mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <HiOutlineMail className="text-pink-600" />
              <a
                href="mailto:hello.toyshack@gmail.com"
                className="hover:text-pink-600 transition"
              >
                hello.toyshack@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <HiOutlinePhone className="text-pink-600" />
              <a
                href="tel:+918121301888"
                className="hover:text-pink-600 transition"
              >
                +91 8121301888
              </a>
            </li>
            <li className="flex items-center gap-2">
              <HiOutlinePhone className="text-pink-600" />
              <a
                href="tel:+918121304888"
                className="hover:text-pink-600 transition"
              >
                +91 8121304888
              </a>
            </li>
          </ul>
          <div className="flex gap-4 mt-4 text-lg justify-center sm:justify-start">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="transition hover:opacity-80" style={{ color: "#1877F2" }}>
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition hover:opacity-80" style={{ color: "#E4405F" }}>
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="transition hover:opacity-80" style={{ color: "black" }}>
              <FaXTwitter />
            </a>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col items-center sm:items-start">
          <h4 className="text-lg font-semibold text-[#014aaf] mb-3">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/privacy-policy" className="hover:text-pink-600 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-pink-600 transition">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="hover:text-pink-600 transition">Exchange Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-600 mt-8">
        © {new Date().getFullYear()} ToyShack. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
