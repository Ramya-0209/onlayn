import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { toast } from "sonner";
import API from "../api"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const validate = () => {
    const errs = {};
  
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email";
    }
  
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!passwordRegex.test(newPassword)) {
      errs.newPassword =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (e.g., @ $ ! % * ? &)";
    }
  
    if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
  
    return errs;
  };  

  const handleReset = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) return;
  
    const toastId = toast.loading("Resetting password...");
  
    try {
      const response = await API.post(
        "/Dashboard/Customers/forgot-password",
        { email, newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = response.data;
  
      if (response.status === 200) {
        toast.success("New password created successfully!", { id: toastId });
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(data.message || "Reset failed", { id: toastId });
        setError(data.message || "Reset failed");
      }
    } catch (err) {
      console.error("Reset error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
  
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    }
  };  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4 py-12">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-pink-500 mb-6 text-center flex items-center justify-center gap-2">
          <FaLock className="text-pink-500" />
          Reset Your Password
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute top-10 right-4 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full p-3 border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-10 right-4 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-semibold transition cursor-pointer"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-pink-500 font-medium cursor-pointer"
          >
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
