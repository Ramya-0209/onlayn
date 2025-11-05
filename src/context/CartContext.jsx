import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
  
    try {
      const res = await fetch(
        `https://apis.toyshack.in/Dashboard/cart/cart-data?customerId=${user._id}`
      );
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Fetch cart failed:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
    else setCartItems([]);
  }, [user]);

  // const addToCart = async (...args) => {
  //   if (!user) {
  //     toast.warning("Please login to add items to cart.");
  //     return;
  //   }

  //   let product, qty;
  //   if (typeof args[0] === "object" && args.length === 1) {
  //     product = args[0];
  //     qty = args[0].quantity || 1;
  //   } else {
  //     [product, qty = 1] = args;
  //   }

  //   const cartItem = cartItems.find(item => item.productId?._id === product._id);
  //   const currentQuantityInCart = cartItem?.quantity || 0;

  //   if (currentQuantityInCart + qty > Number(product.stock || 0)) {
  //     toast.error(`Cannot add more than ${product.stock} items to cart.`, {
  //       id: `cart-stock-${product._id}`,
  //     });
  //     return;
  //   }

  //   try {
  //     const originalPrice = Number(product.price) || 0;
  //     const discount = product.discount || 0;
  //     const discountedPrice = Math.round((originalPrice - (originalPrice * discount) / 100) * 100) / 100;

  //     const payload = {
  //       customerName: localStorage.getItem("customerName") || "",
  //       customerId: user._id,
  //       productId: product._id,
  //       productName: product.productName,
  //       shortId: product.shortId,
  //       originalPrice,
  //       discountedPrice,
  //       discount,
  //       category: product.category || "",
  //       brand: product.brand || "",
  //       unit: product.unit || "",
  //       size: product.size || "",
  //       stock: product.stock || 0,
  //       material: product.material || "",
  //       color: product.color || "",
  //       age: product.age || "",
  //       mainPrice: product.price,
  //       quantity: qty,
  //       reviews: product.reviews || 0,
  //       images: product.images || [],
  //       cess: product.cess || 0,
  //       igst: product.igst || 0,
  //       sgst: product.sgst || 0, 
  //       cgst: product.cgst || 0, 
  //     };

  //     const toastId = toast.loading("Adding to cart...");
  //     await fetch("https://apis.toyshack.in/Dashboard/cart/create-cart", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });
  //     await fetchCart();

  //     toast.success(
  //       <div className="font-normal">
  //         <span className="font-semibold">Added to cart!</span><br />
  //         {qty} × {product.productName}
  //       </div>,
  //       { id: toastId }
  //     );

  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to add to cart.", {
  //       id: `cart-error-${product._id}`,
  //     });
  //   }
  // };

  const addToCart = async (product, qty = 1) => {
    if (!user) {
      toast.warning("Please login to add items to cart.");
      return;
    }
  
    if (!product?._id) {
      toast.error("Invalid product data.");
      return;
    }
  
    try {
      const toastId = toast.loading("Adding to cart...");
  
      // ✅ Simplified payload (only what backend expects)
      const payload = {
        customerId: user._id,
        customerName: localStorage.getItem("customerName") || user?.name || "Guest",
        productId: product._id,
        quantity: qty,
      };
  
      const response = await fetch("https://apis.toyshack.in/Dashboard/cart/create-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (!response.ok) throw new Error(result.error || "Failed to add item");
  
      await fetchCart(); 
  
      toast.success(
        <div className="font-normal">
          <span className="font-semibold">Added to cart!</span><br />
          {qty} × {product.productName}
        </div>,
        { id: toastId }
      );
  
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.message || "Failed to add to cart.");
    }
  };

  const updateQuantity = async (cartItemId, newQuantity, oldQuantity) => {
    if (newQuantity < 1) {
      toast.warning("Quantity must be at least 1", { id: "min-qty" });
      return;
    }
  
    try {
      const toastId = `cart-update-${cartItemId}`;
      toast.loading("Updating cart...", { id: toastId });
  
      // get customerId from your context or local storage
      const customerId = user?._id || await AsyncStorage.getItem("id"); // adjust based on your app
  
      await fetch("https://apis.toyshack.in/Dashboard/cart/update-cart-item", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity: newQuantity, customerId }),
      });
  
      await fetchCart();
      toast.success(
        newQuantity > oldQuantity ? "Quantity increased!" : "Quantity decreased!",
        { id: toastId }
      );
  
    } catch (error) {
      console.error("Update quantity failed:", error);
      toast.error("Something went wrong. Please try again.", { id: `cart-update-${cartItemId}` });
    }
  };
  
  const removeFromCart = async (itemId) => {
    const toastId = `cart-remove-${itemId}`;
    toast.loading("Removing item...", { id: toastId });
  
    try {
      await fetch(`https://apis.toyshack.in/Dashboard/cart/delete-cart-item/${itemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: user._id }), // <-- send customerId
      });
  
      await fetchCart();
      toast.success("Item removed from cart!", { id: toastId });
    } catch (error) {
      console.error("Remove from cart failed:", error);
      toast.error("Failed to remove item. Please try again.", { id: toastId });
    }
  };
  
  const clearCart = async (showToast = true) => {
    const toastId = "cart-clear";
  
    try {
      if (showToast) toast.loading("Clearing your cart...", { id: toastId });
  
      await fetch("https://apis.toyshack.in/Dashboard/cart/clear-cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: user._id }), // <-- send customerId
      });
  
      await fetchCart();
      if (showToast) toast.success("Your cart has been cleared!", { id: toastId });
    } catch (error) {
      console.error("Clear cart failed:", error);
      if (showToast) toast.error("Failed to clear cart. Please try again.", { id: toastId });
    }
  };
  const resetCartState = () => setCartItems([]);

  const cartCount = useMemo(() =>
    cartItems.reduce((total, item) => total + parseInt(item.quantity || 0), 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        fetchCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        resetCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
