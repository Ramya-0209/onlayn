import React from "react";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { X } from "lucide-react";
import teddyToy from "../../assets/teddyToy.png"; 
import ShareButtons from "../ShareButtons";

const buildVideoUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtu.be")) {
    return url.replace("youtu.be/", "www.youtube.com/embed/");
  }
  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  return url;
};

const ProductMainSection = ({
  product,
  activeImage,
  thumbnails,
  setActiveImage,
  isPreviewOpen,
  setIsPreviewOpen,
  onThumbKeyDown,
  displayCategory,
  age,
  size,
  material,
  discountedPrice,
  originalPrice,
  currentDiscount,
  currentStock,
  rupee,
  decQty,
  incQty,
  selectedQuantity,
  handleAddToCart,
  cartItems,
  selectedVariant,
  handleWishlistToggle,
  togglingWishlist,
  isInWishlist,
  onShare,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 lg:p-10 grid lg:grid-cols-2 gap-8">
      {/* Left Column: Images & Video */}
      <section>
        <div
          className="relative overflow-hidden group rounded-lg cursor-pointer"
          onClick={() => setIsPreviewOpen(true)}
        >
          <div className="w-full aspect-[6/5] overflow-hidden rounded-xl">
            {activeImage?.includes("youtube.com/embed") ? (
              <iframe
                src={activeImage}
                title="Product Video"
                className="w-full h-full rounded-xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <img
                src={activeImage || teddyToy}
                alt={product?.productName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                onError={(e) => (e.currentTarget.src = teddyToy)}
              />
            )}
          </div>
        </div>

        {/* Thumbnails + Video Thumbnail */}
        <div
          className="mt-6 py-2 px-2 flex flex-wrap gap-4 overflow-x-auto lg:overflow-visible"
          role="listbox"
          aria-label="Product media"
        >
          {(thumbnails.length ? thumbnails : [teddyToy]).map((img, idx) => {
            const isActive = img === activeImage;
            return (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                onKeyDown={(e) => onThumbKeyDown(e, img)}
                className={`shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-300 focus:outline-none cursor-pointer
                  ${
                    isActive
                      ? "border-pink-500 ring-1 ring-pink-500"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                aria-label={`Image ${idx + 1}`}
                aria-selected={isActive}
              >
                <img
                  src={img}
                  alt={`thumb-${idx}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = teddyToy)}
                />
              </button>
            );
          })}

          {/* 🎥 Video Thumbnail */}
          {product?.videoUrl && (
            <button
              onClick={() => setActiveImage(buildVideoUrl(product.videoUrl))}
              className={`shrink-0 w-20 h-20 rounded-xl border-2 flex items-center justify-center bg-black text-white transition-all duration-300
                ${
                  activeImage?.includes("youtube.com/embed")
                    ? "border-pink-500 ring-1 ring-pink-500"
                    : "border-gray-200 hover:border-pink-300"
                }`}
              aria-label="Product video"
            >
              🎥
            </button>
          )}
        </div>
      </section>

      {/* Image/Video Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setIsPreviewOpen(false)}
          >
            <X size={32} />
          </button>

          <div className="flex-grow flex items-center justify-center w-full">
            {activeImage?.includes("youtube.com/embed") ? (
              <iframe
                src={activeImage}
                title="Product Video Preview"
                className="h-[68vh] max-w-full rounded-xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <img
                src={activeImage || teddyToy}
                alt="Preview"
                className="h-[68vh] max-w-full object-contain"
                onError={(e) => (e.currentTarget.src = teddyToy)}
              />
            )}
          </div>

          {/* Thumbnails in Preview */}
          <div className="flex gap-5 py-4 overflow-x-auto max-w-5xl px-4 mt-auto">
            {(thumbnails.length ? thumbnails : [teddyToy]).map((img, idx) => {
              const isActive = img === activeImage;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`shrink-0 w-16 h-16 border-2 overflow-hidden transition-all duration-300
                    ${
                      isActive
                        ? "border-pink-500 ring-2 ring-pink-500"
                        : "border-gray-300 hover:border-pink-300"
                    }`}
                >
                  <img
                    src={img}
                    alt={`preview-thumb-${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = teddyToy)}
                  />
                </button>
              );
            })}

            {/* 🎥 Video Thumbnail in Preview */}
            {product?.videoUrl && (
              <button
                onClick={() => setActiveImage(buildVideoUrl(product.videoUrl))}
                className={`shrink-0 w-16 h-16 border-2 flex items-center justify-center bg-black text-white transition-all duration-300
                  ${
                    activeImage?.includes("youtube.com/embed")
                      ? "border-pink-500 ring-2 ring-pink-500"
                      : "border-gray-300 hover:border-pink-300"
                  }`}
              >
                🎥
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right Column: Product Details & Actions */}
      <section className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
          {product.productName}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
          {product.shortId && (
            <span>
              <span className="text-gray-400">SKU:</span>{" "}
              <span className="font-medium text-gray-700">{product.shortId}</span>
            </span>
          )}
          {product.brand && (
            <span>
              <span className="text-gray-400">Brand:</span>{" "}
              <span className="font-medium text-gray-700">{product.brand}</span>
            </span>
          )}
          {displayCategory && (
            <span>
              <span className="text-gray-400">Category:</span>{" "}
              <span className="font-medium text-gray-700">{displayCategory}</span>
            </span>
          )}
          {age && (
            <span>
              <span className="text-gray-400">Age:</span>{" "}
              <span className="font-medium text-gray-700">{age}</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {size && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-900 text-sm font-medium shadow-sm border border-gray-800">
              <span className="tracking-wide text-blue-900">Size:</span>
              <span>{product.size}</span>
            </div>
          )}
          {material && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-900 text-sm font-medium shadow-sm border border-gray-800">
              <span className="tracking-wide text-blue-900">Material:</span>
              <span>{product.material}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100" />
        <div className="flex items-baseline gap-3">
          <div className="text-4xl font-extrabold leading-none text-pink-500">
            ₹{rupee(Math.round(discountedPrice))}
          </div>
          {currentDiscount > 0 && (
            <>
              <div className="text-gray-400 line-through text-xl">
                ₹{rupee(Math.round(originalPrice || price))}
              </div>
              <span className="text-blue-700 bg-blue-100 border border-blue-200 text-sm font-semibold px-2 py-1 rounded-full">
                {Math.round(currentDiscount)}% OFF
              </span>
            </>
          )}
        </div>

        <div
          className={`inline-flex items-center text-sm px-3 py-1.5 rounded-full border
            ${
              currentStock < 1
                ? "text-red-700 bg-red-100 border-red-200"
                : currentStock < 10
                ? "text-amber-700 bg-amber-100 border-amber-200"
                : "text-green-700 bg-green-100 border-green-200"
            }`}
        >
          {currentStock < 1
            ? "This product is currently out of stock"
            : currentStock < 10
            ? `Hurry! Only ${currentStock} left`
            : `In stock (${currentStock})`}
        </div>

        <div className="border-t border-gray-100" />

        <div className="flex flex-wrap items-center gap-4">
          {/* Quantity Counter */}
          <div className="flex items-center rounded-full overflow-hidden border border-gray-300 bg-gray-100">
            <button
              onClick={decQty}
              className="px-4 py-3 font-bold cursor-pointer hover:bg-pink-100 transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-5 min-w-[2ch] text-center font-medium">
              {selectedQuantity}
            </span>
            <button
              onClick={incQty}
              className="px-5 py-3 font-bold cursor-pointer hover:bg-pink-100 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={currentStock < 1}
            className={`rounded-full px-6 py-4 text-sm text-white bg-pink-500 font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300 cursor-pointer
              ${
                currentStock < 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "hover:scale-105"
              }`}
          >
            {currentStock < 1
              ? "Out of Stock"
              : cartItems?.some(
                  (item) =>
                    item.productId?._id === product._id &&
                    item.variantId === selectedVariant?._id
                )
              ? "Update Cart"
              : "Add to Cart"}
          </button>

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            disabled={togglingWishlist}
            className={`items-center flex rounded-full px-5 py-4 text-sm border font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-1 cursor-pointer
              ${
                isInWishlist
                  ? "border-pink-500 text-white bg-pink-500 shadow-md hover:scale-105"
                  : "border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-400"
              }`}
            aria-pressed={isInWishlist}
          >
            <FaHeart className="inline mr-2" />
            {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
          </button>

          {/* Share */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onShare(product, discountedPrice)}
              className="rounded-full px-5 py-4 text-sm font-medium border border-gray-300 text-white bg-blue-400 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer hover:scale-105"
            >
              <FaShareAlt className="inline mr-2" /> Share
            </button>

            <ShareButtons
              product={product}
              currentDiscount={currentDiscount}
              discountedPrice={discountedPrice}
              currentPrice={discountedPrice}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductMainSection;
