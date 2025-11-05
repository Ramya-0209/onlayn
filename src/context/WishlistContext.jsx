// import { createContext, useContext, useState, useEffect } from "react";
// import { toast } from "sonner";
// import { jwtDecode } from "jwt-decode";
// import { useAuth } from "./AuthContext";
// import API from "../api"; // ✅ use API instance

// const WishlistContext = createContext();
// export const useWishlist = () => useContext(WishlistContext);

// export const WishlistProvider = ({ children }) => {
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   // Fetch Wishlist
//   const fetchWishlist = async () => {
//     if (!user) {
//       setWishlist([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await API.get("/Dashboard/wishlist"); 
//       setWishlist(response.data.wishlist || []);
//     } catch (error) {
//       console.error("❌ Error fetching wishlist:", error.response?.data || error.message);
//       setWishlist([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchWishlist();
//     } else {
//       setWishlist([]);
//     }
//   }, [user]);

//   const clearWishlistState = () => setWishlist([]);

//   const addToWishlist = async (product) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.warning("Please log in to add items to wishlist.");
//       return;
//     }

//     let customerid;
//     try {
//       const decoded = jwtDecode(token);
//       customerid = decoded._id || decoded.id;
//     } catch {
//       toast.error("Invalid session, please log in again.");
//       return;
//     }

//     const productId = product.productId || product._id;
//     if (!productId) {
//       toast.error("Invalid product data.");
//       return;
//     }

//     const payload = {
//       productId,
//       productName: product.productName,
//       description: product.description || "",
//       price: product.price,
//       category: product.category || "General",
//       brand: product.brand || "NoBrand",
//       unit: product.unit || "piece",
//       size: product.size || "One Size",
//       discount: product.discount || 0,
//       stock: product.stock || 0,
//       material: product.material || "Unknown",
//       color: product.color || "Unknown",
//       age: product.age || "All",
//       reviews: product.reviews || [],
//       images: product.images || [],
//     };

//     try {
//       const toastId = toast.loading("Adding to wishlist...");
//       await API.post("/Dashboard/wishlist/add", payload); // ✅ API instance
//       await fetchWishlist();

//       toast.success(
//         <div className="font-normal">
//           <span className="font-semibold">Added to wishlist!</span><br />
//           {product.productName}
//         </div>,
//         { id: toastId }
//       );
//     } catch (error) {
//       console.error("Error adding to wishlist:", error.response?.data || error.message);
//       toast.error(
//         error?.response?.data?.message || "Failed to add to wishlist.",
//         { id: `wishlist-error-${productId}` }
//       );
//     }
//   };

//   const removeFromWishlist = async (wishlistItemId) => {
//     try {
//       const toastId = toast.loading("Removing product...");
//       await API.delete(`/Dashboard/wishlist/remove/${wishlistItemId}`); // ✅ API instance
//       setWishlist(prev => prev.filter(item => item._id !== wishlistItemId));
//       toast.success("Product removed from wishlist!", { id: toastId });
//     } catch (error) {
//       console.error("Error removing from wishlist:", error.response?.data || error.message);
//       toast.error("Failed to remove product from wishlist", {
//         description: error.response?.data?.message || "Please try again later.",
//       });
//     }
//   };

//   const clearWishlist = async () => {
//     const toastId = toast.loading("Clearing wishlist...");
//     try {
//       await API.delete("/Dashboard/wishlist/clear"); // ✅ API instance
//       setWishlist([]);
//       toast.success("Wishlist cleared successfully!", { id: toastId });
//     } catch (error) {
//       console.error("Error clearing wishlist:", error.response?.data || error.message);
//       toast.error("Failed to clear wishlist.", {
//         id: toastId,
//         description: error.response?.data?.message || "Please try again later.",
//       });
//     }
//   };

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlist,
//         addToWishlist,
//         removeFromWishlist,
//         clearWishlist,
//         clearWishlistState,
//         loading,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };



import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import API from "../api"; 

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); 

  const fetchWishlist = async () => {
    if (!user?._id) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      const response = await API.get("/Dashboard/wishlist", {
        params: { customerId: user._id }, 
      });
      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error.response?.data || error.message);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const clearWishlistState = () => setWishlist([]);

  const addToWishlist = async (product) => {
    if (!user?._id) {
      toast.warning("Please log in to add items to wishlist.");
      return;
    }

    const productId = product.productId || product._id;
    if (!productId) {
      toast.error("Invalid product data.");
      return;
    }

    const payload = {
      customerId: user._id, 
      productId,
      productName: product.productName,
      description: product.description || "",
      price: product.price,
      category: product.category || "General",
      brand: product.brand || "NoBrand",
      unit: product.unit || "piece",
      size: product.size || "One Size",
      discount: product.discount || 0,
      stock: product.stock || 0,
      material: product.material || "Unknown",
      color: product.color || "Unknown",
      age: product.age || "All",
      reviews: product.reviews || [],
      images: product.images || [],
    };

    try {
      const toastId = toast.loading("Adding to wishlist...");
      await API.post("/Dashboard/wishlist/add", payload); 
      await fetchWishlist();

      toast.success(
        <div className="font-normal">
          <span className="font-semibold">Added to wishlist!</span><br />
          {product.productName}
        </div>,
        { id: toastId }
      );
    } catch (error) {
      console.error("Error adding to wishlist:", error.response?.data || error.message);
      toast.error(
        error?.response?.data?.message || "Failed to add to wishlist.",
        { id: `wishlist-error-${productId}` }
      );
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    if (!user?._id) return;

    try {
      const toastId = toast.loading("Removing product...");
      await API.delete(`/Dashboard/wishlist/remove/${wishlistItemId}`, {
        data: { customerId: user._id }, 
      });
      setWishlist(prev => prev.filter(item => item._id !== wishlistItemId));
      toast.success("Product removed from wishlist!", { id: toastId });
    } catch (error) {
      console.error("Error removing from wishlist:", error.response?.data || error.message);
      toast.error("Failed to remove product from wishlist", {
        description: error.response?.data?.message || "Please try again later.",
      });
    }
  };

  const clearWishlist = async () => {
    if (!user?._id) return;

    const toastId = toast.loading("Clearing wishlist...");
    try {
      await API.delete("/Dashboard/wishlist/clear", {
        data: { customerId: user._id }, 
      });
      setWishlist([]);
      toast.success("Wishlist cleared successfully!", { id: toastId });
    } catch (error) {
      console.error("Error clearing wishlist:", error.response?.data || error.message);
      toast.error("Failed to clear wishlist.", {
        id: toastId,
        description: error.response?.data?.message || "Please try again later.",
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        clearWishlistState,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};