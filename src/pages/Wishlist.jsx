import React, { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrash, FaLock } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";

const Wishlist = () => {
  const { wishlist = [], clearWishlist, removeFromWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClearWishlist = () => setShowConfirmModal(true);
  const confirmClearWishlist = () => {
    clearWishlist();
    setShowConfirmModal(false);
  };
  const cancelClearWishlist = () => setShowConfirmModal(false);

  return (
    <section className="py-12 px-4">
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-center text-pink-500 tracking-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Wishlist
      </motion.h1>

      {/* 🔒 If Not Logged In */}
      {!isLoggedIn ? (
        <motion.div
          className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <FaLock className="w-20 h-20 mb-6 text-gray-400 animate-pulse" />
          <h2 className="text-3xl font-extrabold text-gray-800 mb-5">Please log in</h2>
          <p className="text-lg text-gray-500 mb-8">
            Your wishlist is waiting! Log in to start saving your favorites.
          </p>
          <Link
            to="/login"
            className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105"
          >
            Log In
          </Link>
        </motion.div>
      ) : wishlist.length === 0 ? (
        // 🟡 Empty Wishlist
        <motion.div
          className="text-center p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/825/825586.png"
            alt="Empty Wishlist"
            className="mx-auto w-44 h-44 mb-8 opacity-90 drop-shadow-md"
          />
          <p className="text-4xl font-extrabold text-gray-800 mb-4">
            Your wishlist is empty
          </p>
          <p className="text-lg text-gray-500 mb-10">
            Add your favorite toys and find them here!
          </p>
          <Link
            to="/toys"
            className="bg-pink-600 hover:bg-pink-700 text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105"
          >
            Browse Toys
          </Link>
        </motion.div>
      ) : (
        // 🟢 Wishlist Items
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <p className="text-xl font-medium text-gray-600 tracking-wide">
              Your wishlist
              <span className="font-bold text-gray-900 ml-2">
                ({wishlist.length} {wishlist.length === 1 ? "item" : "items"})
              </span>
            </p>
            <button
              onClick={handleClearWishlist}
              className="flex items-center rounded-full bg-pink-500 gap-2 text-white hover:bg-pink-600 font-medium transition-colors px-5 py-2 cursor-pointer"
            >
              Clear Wishlist
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {[...wishlist].reverse().map((item, index) =>
              item.productId ? (
                <motion.div
                  key={item._id || index}
                  className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={item.productId} />
                  {/* Fixed delete icon */}
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-3 left-3 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-md text-white cursor-pointer hover:scale-110 hover:shadow-xl transition-transform duration-200"
                    title="Remove from wishlist"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* ⚠️ Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h3 className="text-2xl font-bold text-pink-500 mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to clear your entire wishlist? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelClearWishlist}
                className="px-6 py-2 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearWishlist}
                className="px-6 py-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition cursor-pointer"
              >
                Clear Wishlist
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Wishlist;
