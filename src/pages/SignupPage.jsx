import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{10}$/;
    const postalCodeRegex = /^[1-9][0-9]{5}$/;

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!firstName.trim()) newErrors.firstName = "First name is required";
      if (!lastName.trim()) newErrors.lastName = "Last name is required";
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Invalid email address";
      }      
      if (!phoneRegex.test(phone)) newErrors.phone = "Enter valid 10-digit phone number";
      if (!postalCodeRegex.test(postalCode)) newErrors.postalCode = "Enter valid 6-digit postal code";

      if (!passwordRegex.test(password)) {
        newErrors.password =
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (e.g., @ $ ! % * ? &)"
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

    return newErrors;
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch("https://apis.toyshack.in/Dashboard/Customers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          mobileNumber: phone,
          pinCode: postalCode,
          password,
        }),
      });

      if (response.ok) {
        toast.success("Account created successfully!");        // Reset fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPostalCode("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const data = await response.json();
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", err);    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-pink-500 mb-10">Create an Account</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Your last name"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Your postal code"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
              {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-10 right-4 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-10 right-4 text-gray-500"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-full font-semibold hover:bg-pink-600 transition cursor-pointer"
          >
            Sign Up
          </button>

          <p className="text-center text-sm mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-500 font-medium cursor-pointer">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
