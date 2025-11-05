import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import teddyToy from "../../assets/teddyToy.png";
import { extractCategoryLabels } from "../../utils/categoryUtils";
import axios from "axios";
import ProductCard from "../ProductCard";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import ProductMainSection from "./ProductMainSection";
import ProductTabs from "./ProductTabs";

const TABS = ["Description", "Specifications", "Exchange & Delivery"];
const BRAND_BLUE = "#014aaf";
const API_BASE_URL = "https://apis.toyshack.in";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn } = useAuth();
  const { cartItems, addToCart } = useCart();
  const { wishlist, addToWishlist } = useWishlist();
  const [searchParams] = useSearchParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const bannerProductIds = searchParams.get("productIds");
  const bannerTitle = searchParams.get("bannerTitle");

  const [displayReviewss, setDisplayReviewss] = useState([
    { user: "Alice", rating: 5, comment: "Amazing toy!" },
    { user: "Bob", rating: 4, comment: "My kid loves it!" },
  ]);

  const buildImageUrl = (imageName) => {
    if (!imageName) return teddyToy;
    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
      return imageName;
    }
    return `${API_BASE_URL}/storage/productimages/${imageName}`;
  };

  const normalizeOrderItem = (item) => {
    if (!item) return null;
    return {
      ...item,
      _id: item._id || item.id || item.productId || null,
      productName: item.productName || item.name || "",
      images: Array.isArray(item.images)
        ? item.images
        : item.image
        ? [item.image]
        : [],
      price: item.finalPrice ?? item.mainPrice ?? 0,
      orderQuantity: item.quantity ?? null,
      orderSize: item.size ?? null,
    };
  };

  useEffect(() => {
    const fetchProductAndSimilar = async () => {
      setLoading(true);
      setError(null);
      const fetchId = id || normalizeOrderItem(location.state?.product)?._id;

      if (!fetchId) {
        setError("Product ID not found.");
        setLoading(false);
        return;
      }

      try {
        const productResponse = await axios.get(
          `${API_BASE_URL}/Dashboard/products/product/${fetchId}`
        );
        const fetchedProduct = productResponse.data.product;

        if (!fetchedProduct) {
          setError("Product not found.");
          setProduct(null);
          setLoading(false);
          return;
        }

        const currentProduct = {
          ...fetchedProduct,
          orderQuantity: location.state?.product?.quantity ?? null,
          orderSize: location.state?.product?.size ?? null,
        };

        setProduct(currentProduct);

        const allProductsResponse = await axios.get(
          `${API_BASE_URL}/Dashboard/products/all-products`
        );
        const allProducts = allProductsResponse.data.products;

        const currentCategory = currentProduct?.category?.trim().toLowerCase();
        if (allProducts && allProducts.length > 0 && currentCategory) {
          const similarProducts = allProducts
            .filter(
              (p) =>
                (p.category || "").trim().toLowerCase() === currentCategory &&
                String(p._id) !== String(currentProduct._id)
            )
            .slice(0, 8);
          setRelatedProducts(similarProducts);
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch product details or related products:", err);
        setError("Product not found or failed to load.");
        setProduct(null); 
          } finally {
        setLoading(false);
      }
    };

    fetchProductAndSimilar();
  }, [id, location.state]);

  useEffect(() => {
    if (product) {
      document.title = `${product.metaTitle || product.productName} | ToyStore`;

      const ogTags = [
        { property: "og:title", content: product.productName },
        {
          property: "og:description",
          content:
            product.metaDescription ||
            product.description?.substring(0, 150) ||
            "Check out this amazing product!",
        },
        {
          property: "og:image",
          content: buildImageUrl(product.images?.[0] || product.image),
        },
        {
          property: "og:url",
          content: `${window.location.origin}/product/${product._id}`,
        },
        { property: "og:type", content: "product" },
      ];

      ogTags.forEach((tagData) => {
        let tag = document.querySelector(
          `meta[property='${tagData.property}']`
        );
        if (!tag) {
          tag = document.createElement("meta");
          tag.setAttribute("property", tagData.property);
          document.head.appendChild(tag);
        }
        tag.setAttribute("content", tagData.content);
      });
    }
  }, [product]);

  useEffect(() => {
    return () => {
      const ogTags = document.querySelectorAll('meta[property^="og:"]');
      ogTags.forEach((tag) => tag.remove());
    };
  }, []);

  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!product) return;
    setSelectedVariant(null);
    const firstImg = product.images?.[0] || null;
    setActiveImage(firstImg ? buildImageUrl(firstImg) : null);
  }, [product]);

  useEffect(() => {
    if (product) {
      const existingCartItem = cartItems?.find(
        (item) => item.productId === product._id
      );
      setSelectedQuantity(existingCartItem?.quantity || 1);
  
      const savedY = sessionStorage.getItem("shopScrollY");
      if (savedY) {
        setTimeout(() => window.scrollTo(0, parseInt(savedY, 10)), 50);
        sessionStorage.removeItem("shopScrollY");
      }
    }
  }, [product, cartItems, selectedVariant]);
  
  useEffect(() => {
    if (!product) return;
    const found = wishlist.some(
      (item) =>
        String(item.productId) === String(product._id) ||
        String(item.productId?._id) === String(product._id) ||
        String(item._id) === String(product._id)
    );
    setIsInWishlist(found);
  }, [wishlist, product]);

  const requireAuth = () => {
    if (!isLoggedIn) {
      toast.warning("You need to login to continue", { duration: 1500 });
      setTimeout(() => {
        navigate("/login", { state: { from: location } });
      }, 1000);
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
      setTogglingWishlist(true); 
      await addToWishlist(product);
      setIsInWishlist(true);
    } catch (error) {
      toast.error(error.message || "Failed to add to wishlist", {
        id: "wishlistAction",
      });
    } finally {
      setTogglingWishlist(false); 
    }
  };

  const handleAddToCart = async () => {
    if (!requireAuth()) return;
    if (!product) {
      toast.error("Product data not available.");
      return;
    }

    const currentStock = product.stock || 0;
    const cartItem = cartItems.find((item) => item.productId?._id === product._id);
    const currentQuantityInCart = cartItem?.quantity || 0;

    if (currentStock < 1) {
      toast.warning("This item is currently out of stock.");
      return;
    }

    if (selectedQuantity + currentQuantityInCart > currentStock) {
      const maxAllowed = currentStock - currentQuantityInCart;
      if (maxAllowed <= 0) {
        toast.error(`Cannot add more than ${currentStock} items to cart.`);
        return;
      }
      setSelectedQuantity(maxAllowed);
      toast.info(`Only ${maxAllowed} more items can be added`);
      return;
    }

    try {
      await addToCart(product, selectedQuantity);
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error(error.message || "Failed to add to cart.");
    }
  };

  const onThumbKeyDown = (e, img) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveImage(img);
    }
  };

  const currentPrice = product?.finalPrice || product?.price || 0;
  const currentDiscount = product?.discount || 0;
  const discountedPrice = Number(
    currentPrice - (currentPrice * currentDiscount) / 100
  );
  const originalPrice = currentPrice;
  const currentStock = product?.stock ?? 0;
  const age = product?.age;
  const size = product?.size;
  const unit = product?.unit;
  const material = product?.material;

  const thumbnails = (
    product?.images?.length
      ? product.images
      : product?.image
      ? [product.image]
      : []
  )
    .map(buildImageUrl)
    .filter(Boolean);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const categoryLabels = extractCategoryLabels(product);
  const displayCategory = categoryLabels[0] || "Category";

  const rupee = (n) => Number(n || 0).toLocaleString("en-IN");
  const decQty = () => setSelectedQuantity((q) => Math.max(1, q - 1));
  const incQty = () => setSelectedQuantity((q) => Math.min(q + 1, currentStock));

  useEffect(() => {
    if (!product) return;
    const stockToStore = product.stock ?? 0;
    localStorage.setItem(`stock_${product._id}`, stockToStore);
  }, [product]);

  const onShare = async (product, discountedPrice) => {
    if (!product) {
      toast.error("Product data not available.");
      return;
    }

    const appLink = "https://toyshack.in/";
    const firstImage =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : null;

    const imageUrl = firstImage
      ? `https://apis.toyshack.in/storage/productimages/${firstImage}`
      : "https://via.placeholder.com/300";

    const priceToShare = discountedPrice > 0 ? discountedPrice : product.finalPrice;

    const message = `🧸 ${product.productName}
💰 Price: ₹${Math.round(Number(priceToShare))}
Check it out: ${window.location.origin}/product/${product._id}
Website: ${appLink}`;

    try {
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "product.jpg", { type: blob.type });

        await navigator.share({
          title: `🧸 ${product.productName}`,
          text: message,
          files: [file],
          url: `${window.location.origin}/product/${product._id}`,
        });

        toast.success("Product shared successfully!");
        return;
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
        toast.success("Product details copied to clipboard!");
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = message;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Product details copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Unable to share the product. Try manually.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="h-[420px] bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-10 w-36 bg-gray-200 rounded" />
            <div className="h-16 w-full bg-gray-200 rounded" />
            <div className="h-10 w-60 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <p className="text-red-600 font-medium mb-4">
          {error || "Product not found or data not provided."}
        </p>
        <button
          onClick={() => navigate("/toys")}
          className="mt-4 inline-flex items-center rounded-full px-5 py-3 text-white"
          style={{ backgroundColor: BRAND_BLUE }}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>{product?.productName} | ToyShack</title>
        <meta property="og:title" content={`🧸 ${product?.productName}`} />
        <meta
          property="og:description"
          content={`✨ Check this amazing product! 💰 Price: ₹${Number(
            currentDiscount > 0 ? discountedPrice : currentPrice
          ).toFixed(2)} | Buy now on ToyShack!`}
        />
        <meta
          property="og:image"
          content={
            product?.images?.[0]
              ? `https://apis.toyshack.in/storage/productimages/${product.images[0]}`
              : "https://toyshack.in/default.jpg"
          }
        />
        <meta
          property="og:url"
          content={`https://toyshack.in/product/${product?._id}`}
        />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="ToyShack" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`🧸 ${product?.productName}`} />
        <meta
          name="twitter:description"
          content={`✨ Check this amazing product! 💰 Price: ₹${
            currentDiscount > 0 ? discountedPrice : currentPrice
          } | Buy now on ToyShack!`}
        />
        <meta
          name="twitter:image"
          content={
            product?.images?.[0]
              ? `https://apis.toyshack.in/storage/productimages/${product.images[0]}`
              : "https://toyshack.in/default.jpg"
          }
        />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-10">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link
            to={
              bannerProductIds || bannerTitle
                ? `/toys?${searchParams.toString()}`
                : "/toys"
            }
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Toys
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{displayCategory}</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-gray-800">
            {product.productName}
          </span>
        </nav>
        <div className="container mx-auto">
          <ProductMainSection
            product={product}
            activeImage={activeImage}
            thumbnails={thumbnails}
            setActiveImage={setActiveImage}
            isPreviewOpen={isPreviewOpen}
            setIsPreviewOpen={setIsPreviewOpen}
            onThumbKeyDown={onThumbKeyDown}
            displayCategory={displayCategory}
            age={age}
            size={size}
            material={material}
            discountedPrice={discountedPrice}
            originalPrice={originalPrice}
            currentDiscount={currentDiscount}
            currentStock={currentStock}
            rupee={rupee}
            decQty={decQty}
            incQty={incQty}
            selectedQuantity={selectedQuantity}
            handleAddToCart={handleAddToCart}
            cartItems={cartItems}
            selectedVariant={selectedVariant}
            handleWishlistToggle={handleWishlistToggle}
            togglingWishlist={togglingWishlist}
            isInWishlist={isInWishlist}
            onShare={onShare}
          />
        </div>
        <ProductTabs
          product={product}
          displayCategory={displayCategory}
          age={age}
          material={material}
          size={size}
          unit={unit}
          currentStock={currentStock}
          currentDiscount={currentDiscount}
          displayReviewss={displayReviewss}
          setDisplayReviewss={setDisplayReviewss}
        />
        {relatedProducts.length > 0 ? (
          <div className="mt-12 lg:mt-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              You may also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 lg:mt-16 text-center text-gray-500">
            <p className="text-lg">No related products found in this category.</p>
            <Link
              to="/toys"
              className="inline-block mt-4 px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all duration-300"
            >
              Explore More Toys
            </Link>
          </div>
        )}
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between shadow-2xl z-40">
        <div className="flex-1 flex flex-col">
          <div className="text-lg font-bold text-pink-600">
            ₹{Math.round(discountedPrice).toLocaleString("en-IN")}
          </div>
          {currentDiscount > 0 && (
            <div className="text-sm text-gray-400 line-through">
              ₹{Math.round(originalPrice).toLocaleString("en-IN")}
            </div>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={currentStock < 1}
          className={`flex-1 ml-4 rounded-full px-6 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-300
            ${
              currentStock < 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-pink-500 hover:brightness-110"
            }`}
        >
          {currentStock < 1
            ? "Out of Stock"
            : cartItems?.some(
                (item) =>
                  item.productId === product._id &&
                  item.variantId === selectedVariant?._id
              )
            ? "Update Cart"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;