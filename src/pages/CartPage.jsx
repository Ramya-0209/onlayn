import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaLock} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const total = cartItems.reduce((sum, item) => {
    const price = item.discountedPrice ?? 0;
    const qty = item.quantity ?? 0;
    return sum + price * qty;
  }, 0);

  const handleClearCart = () => setShowConfirmModal(true);
  const confirmClearCart = () => {
    clearCart();
    setShowConfirmModal(false);
  };
  const cancelClearCart = () => setShowConfirmModal(false);

  const handleProceedToCheckout = () => {
    for (let item of cartItems) {
      const stock = item.stock ?? item.productId?.stock ?? Infinity;

      if (item.quantity > stock) {
        toast.error(
          <div>
            <p>
              <b>{item.productId?.productName || "Product"}</b>
            </p>
            <p>Only {stock} left in stock.</p>
            <p>Please update your cart to proceed.</p>
          </div>,
          { duration: 4000 }
        );
        return;
      }
    }
    navigate("/checkout");
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(val) || 0);  

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-center text-pink-500 tracking-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Cart
      </motion.h1>

      {/* Not Logged In & Empty Cart */}
      {!isLoggedIn || cartItems.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
        {/* Conditional content */}
        {!isLoggedIn ? (
          <>
            <FaLock className="w-20 h-20 mb-6 text-gray-400 animate-pulse" />
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Please log in</h2>
            <p className="text-lg text-gray-500 mb-8">
              Your cart is waiting! Log in to start adding items.
            </p>
            <Link
              to="/login"
              className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105"
            >
              Log In
            </Link>
          </>
        ) : (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
              alt="Empty Cart"
              className="w-56 h-56 mb-8 opacity-90 drop-shadow-md"
            />
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/toys"
              className="bg-pink-600 hover:bg-pink-700 text-white px-10 py-3 rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-105"
            >
              Shop Now
            </Link>
          </>
        )}
      </motion.div>
      ) : (
        // Cart Layout
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-18">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {[...cartItems].reverse().map((item) => {
              const price = Number(item.discountedPrice ?? 0);
              const quantity = Number(item.quantity ?? 0);
              const stock = item.stock ?? item.productId?.stock ?? Infinity;

              return (
                <motion.div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center bg-white rounded-3xl shadow-lg p-6 transition-transform hover:scale-[1.01]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={`/product/${item.productId?._id}`}
                    state={{ productData: item.productId }}
                    className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
                  >
                    <img
                      src={
                        item.productId?.images?.[0]
                          ? `https://apis.toyshack.in/storage/productimages/${item.productId.images[0]}`
                          : "https://via.placeholder.com/150"
                      }
                      alt={item.productId?.productName || "Product"}
                      className="w-28 h-28 object-cover rounded-2xl border border-gray-100 shadow-sm"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {item.productId?.productName || "Product Name"}
                      </h3>
                      {item.size && (
                        <p className="text-gray-700 font-medium text-sm">Size: {item.size}</p>
                      )}
                      <p className="text-pink-600 font-bold mt-1">
                        ₹{Math.round(price).toLocaleString("en-IN")}
                        {item.discount > 0 && (
                          <span className="ml-2 text-xs line-through text-gray-400">
                            ₹{Math.round(item.mainPrice ?? item.productId?.price).toLocaleString("en-IN")}
                          </span>
                        )}
                      </p>
                      <p className="text-gray-700 font-medium text-sm mt-1">
                        Subtotal: ₹{Math.round(price * quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0 sm:ml-auto">
                    <div className="flex items-center rounded-full overflow-hidden border border-gray-300 bg-gray-100">
                      {/* Decrease */}
                      <button
                        onClick={() =>
                          quantity === 1
                            ? removeFromCart(item._id) // will show "Removing item..." → "Item removed!"
                            : updateQuantity(item._id, quantity - 1, quantity) // ✅ pass oldQuantity
                        }
                        className="w-10 h-10 flex items-center justify-center font-bold text-blue-600 hover:bg-blue-200 transition cursor-pointer"
                      >
                        −
                      </button>

                      {/* Current quantity */}
                      <span className="w-12 text-center font-semibold text-gray-800">
                        {quantity}
                      </span>

                      {/* Increase */}
                      <button
                        onClick={() =>
                          quantity < stock
                            ? updateQuantity(item._id, quantity + 1, quantity) // ✅ pass oldQuantity
                            : toast.error(`Cannot add more than ${stock} items in stock`, {
                                id: `cart-stock-${item._id}`,
                              })
                        }
                        className="w-10 h-10 flex items-center justify-center font-bold text-blue-600 hover:bg-blue-200 transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item._id)} // will show toast
                      className="text-red-500 hover:text-red-700 text-2xl p-2 rounded-full transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-24 h-fit">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Items ({cartItems.length})</span>
                  <span>₹{Math.round(total).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex text-base justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex justify-between font-bold text-xl text-gray-900">
                  <span>Total</span>
                  <span>₹{Math.round(total).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-full font-semibold shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={handleClearCart}
                className="mt-3 w-full text-sm bg-red-100 text-red-600 hover:bg-red-200 px-4 py-3 rounded-full font-semibold transition cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h3 className="text-2xl font-bold text-pink-500 mb-4">Confirm Action</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to clear your entire cart? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelClearCart}
                className="px-6 py-2 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearCart}
                className="px-6 py-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
