import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; 
import logo from "../assets/logo.png"; 
import API from "../api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email && !password) {
      toast.error("Please enter both email and password");
      return;
    }
  
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
  
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await API.post("/Dashboard/Customers/login", { email, password });
  
      const data = response.data;
  
      // Removed: localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.customer));
      localStorage.setItem("id", data.customer._id);
      localStorage.setItem("mobileNumber", data.customer.mobileNumber);
      localStorage.setItem("email", data.customer.email);
      localStorage.setItem("firstName", data.customer.firstName);
      localStorage.setItem("lastName", data.customer.lastName);
  
      const customerName = `${data.customer.firstName || ""} ${data.customer.lastName || ""}`.trim();
      localStorage.setItem("customerName", customerName);
  
      login(data.customer); 
      toast.success("Logged in successfully!");
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-pink-50 px-4 py-12">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <Link to="/" aria-label="Home">
            <img src={logo} alt="ToyShack Logo" className="h-20" />
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-center text-[#e93772] mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-10 right-4 text-gray-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-sm text-pink-500 cursor-pointer">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-full font-semibold transition text-white cursor-pointer ${
              loading ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-pink-500 font-medium cursor-pointer">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
