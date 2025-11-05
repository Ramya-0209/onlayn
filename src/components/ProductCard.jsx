import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useScroll } from "../context/ScrollContext";
import teddyToy from "../assets/teddyToy.png";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = useLocation();
  const { user, isLoggedIn } = useAuth();
  const { wishlist, addToWishlist } = useWishlist();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { saveScroll } = useScroll();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const {
    _id,
    productName = "Unnamed Product",
    finalPrice,
    price = 0,
    images = [],
    image,
    label,
    stock = 0,
    discount = 0,
    age = "All",
    unit = "piece",
    size = "One Size",
    material = "Unknown",
    color = "Unknown",
    category = "General",
    brand = "NoBrand",
    description = "",
    reviews = [],
  } = product || {};
  
  const effectivePrice = finalPrice ?? price ?? 0; // Use finalPrice if available, else price, else 0  

  const safeId = _id || `temp-${productName}-${Math.random()}`;
  const effectiveStock = Number(stock);
  const effectiveDiscount = Number(discount);

  function buildImageUrl(imgName) {
    if (!imgName) return teddyToy;
    if (imgName.startsWith("http://") || imgName.startsWith("https://"))
      return imgName;
    return `https://apis.toyshack.in/storage/productimages/${imgName}`;
  }

  const imageUrl = images[0] ? buildImageUrl(images[0]) : buildImageUrl(image);
  const originalPrice = Number(finalPrice || price);
  const discountedPrice = originalPrice - (originalPrice * effectiveDiscount) / 100;

  useEffect(() => {
    const found = wishlist.some((item) => item.productId?._id === _id);
    setIsInWishlist(found);
  }, [wishlist, _id]);

  const requireAuth = () => {
    if (!user || !isLoggedIn) {
      toast.warning("You need to login to continue", { duration: 1500 });
      setTimeout(() => navigate("/login", { state: { from: location } }), 800);
      return false;
    }
    return true;
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;

    try {
      if (isInWishlist) {
        toast.info("Product is already in your wishlist", { duration: 1500 });
        return;
      }

      const payload = {
        ...product,
        _id: safeId,
        images: images.length ? images : [teddyToy],
      };
      await addToWishlist(payload);
      setIsInWishlist(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add to wishlist",
        { id: `wishlist-${safeId}` }
      );
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;

    if (effectiveStock === 0) {
      toast.error("Out of stock! Cannot add to cart.", {
        id: `cart-stock-${safeId}`,
      });
      return;
    }

    const cartItem = cartItems.find((item) => item.productId?._id === _id);
    const currentQuantity = cartItem?.quantity || 0;

    if (currentQuantity >= effectiveStock) {
      toast.error(`Cannot add more than ${effectiveStock} items to cart`, {
        id: `cart-stock-${safeId}`,
      });
      return;
    }

    try {
      await addToCart(product, 1);
    } catch (error) {
      toast.error(error.message || "Something went wrong", {
        id: `cart-error-${safeId}`,
      });
    }
  };

  const handleCardClick = () => {
    saveScroll(pathname, window.scrollY);
    navigate(`/product/${safeId}${location.search}`, {
      state: { productData: product },
    });
  };

  const cartItem = cartItems.find((item) => item.productId?._id === _id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleIncrease = async (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;

    if (currentQuantity >= effectiveStock) {
      toast.error(`Max stock limit (${effectiveStock}) reached`, {
        id: `cart-limit-${safeId}`,
      });
      return;
    }

    try {
      await updateQuantity(cartItem._id, currentQuantity + 1, currentQuantity); 
    } catch (error) {
      toast.error(error.message || "Failed to update cart", {
        id: `cart-error-${safeId}`,
      });
    }
  };

  const handleDecrease = async (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;

    if (currentQuantity <= 1) {
      try {
        await removeFromCart(cartItem._id);
      } catch (error) {
        toast.error(error.message || "Failed to remove item", {
          id: `cart-error-${safeId}`,
        });
      }
      return;
    }

    try {
      await updateQuantity(cartItem._id, currentQuantity - 1, currentQuantity); 
    } catch (error) {
      toast.error(error.message || "Failed to update cart", {
        id: `cart-error-${safeId}`,
      });
    }
  };

  return (
    <div
      className="relative h-full flex flex-col bg-pink-100 rounded-lg border border-pink-200 shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
      key={safeId}
    >
      <div className="absolute top-3 right-3 z-10 flex gap-1 transition">
        <button
          onClick={handleWishlistToggle}
          className="p-1 sm:p-1.5 bg-white rounded-full shadow-md transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FaHeart
            className={`w-5 h-5 transition-colors duration-200 ${
              isInWishlist
                ? "text-pink-500 drop-shadow-sm" 
                : "text-gray-300 hover:text-pink-600" 
            }`}
          />
        </button>
      </div>

      {/* Product Label */}
      {label && (
        <div className="absolute top-2 left-2 bg-white text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow z-10"> 
          {label}
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-40 sm:h-46 bg-gradient-to-tr from-pink-200 via-yellow-100 to-blue-100 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={productName}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
          onError={(e) => {
            e.currentTarget.src = teddyToy;
          }}
        />
        {images[1] && (
          <img
            src={buildImageUrl(images[1])}
            alt={`${productName} - alt`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            onError={(e) => {
              e.currentTarget.src = teddyToy;
            }}
          />
        )}
        {/* Out of Stock Overlay */}
        {effectiveStock === 0 && (
          <div className="absolute inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center">
            <span className="text-white text-sm md:text-base font-bold bg-red-600 px-3 py-1 rounded-full shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 bg-white flex-1 flex flex-col items-center">
        <h3 className="text-sm xl:text-base font-bold text-pink-500 hover:text-pink-600 leading-tight line-clamp-2 min-h-[1.5rem]">
          {productName}
        </h3>

        {age && <p className="text-sm text-gray-600 mt-1 sm:mt-2">Age: {age}</p>}

        {/* <div className="mt-2 min-h-[1.5rem]">
          <p className="text-sm sm:text-md md:text-lg font-bold">
            ₹{Math.round(discountedPrice).toLocaleString("en-IN")}
            {effectiveDiscount > 0 && (
              <>
                <span className="ml-2 text-xs line-through text-gray-500">
                  ₹{Math.round(originalPrice).toLocaleString("en-IN")}
                </span>
                <span className="ml-2 text-xs sm:text-sm font-bold text-green-600">
                  ({Math.round(effectiveDiscount)}% OFF)
                </span>
              </>
            )}
          </p>
        </div>   */}
        <div className="mt-2 min-h-[1.5rem]">
          <p className="text-sm sm:text-md md:text-base font-bold">
            ₹{Math.round(discountedPrice || 0).toLocaleString("en-IN")}
            {effectiveDiscount > 0 && originalPrice > discountedPrice && (
              <>
                <span className="ml-2 text-xs line-through text-gray-500">
                  ₹{Math.round(originalPrice).toLocaleString("en-IN")}
                </span>
                <span className="ml-2 text-xs sm:text-sm font-bold text-green-600">
                  ({Math.round(effectiveDiscount)}% OFF)
                </span>
              </>
            )}
          </p>
        </div>

        <div className="min-h-[1.1rem] mt-auto">
          {effectiveStock === 0 && (
            <p className="text-xs text-red-600 font-semibold">Out of stock</p>
          )}
          {effectiveStock > 0 && effectiveStock <= 7 && (
            <p className="text-xs text-red-600 font-semibold">
              Hurry! Only {effectiveStock} left
            </p>
          )}
        </div>

        <div className="mt-auto w-full px-0 sm:px-2">
          {currentQuantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#014aaf] hover:bg-blue-800 text-white text-sm font-semibold py-1.5 xl:py-2 rounded-full transition shadow-sm cursor-pointer"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-100 border-1 border-blue-800 rounded-full overflow-hidden">
              <button
                onClick={handleDecrease}
                className="w-10 md:w-14 py-1 xl:py-1.5 flex items-center justify-center bg-[#014aaf] text-white font-bold hover:bg-blue-800 cursor-pointer"
              >
                −
              </button>
              <span className="flex-1 text-center font-semibold">
                {currentQuantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-10 md:w-14 py-1 xl:py-1.5 flex items-center justify-center bg-[#014aaf] text-white font-bold hover:bg-blue-800 cursor-pointer"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;