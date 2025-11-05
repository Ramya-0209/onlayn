import { useState, useCallback, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate} from "react-router-dom";
import { toast } from "sonner";
import CouponSelector from "./CouponAutoApply";
import API from "../api";

const CheckoutPage = () => {
 const { cartItems, clearCart } = useCart();
 console.log(cartItems)
 const navigate = useNavigate();
 const [loading, setLoading] = useState(false);
 const [customerid, setCustomerid] = useState("");

 const [addressList, setAddressList] = useState([]);
 const [fullAddressList, setFullAddressList] = useState([]);
 const [selectedAddress, setSelectedAddress] = useState(null);
 const [showAddressModal, setShowAddressModal] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedCoupon, setSelectedCoupon] = useState(null);

 const [userProfile, setUserProfile] = useState(
  () => JSON.parse(localStorage.getItem("user")) || {}
 );
 const userId = customerid;

 const loadAddresses = useCallback(() => {
  const storedProfile = localStorage.getItem("user");

  if (storedProfile) {
   const parsedProfile = JSON.parse(storedProfile);
   const list = parsedProfile.address || [];
   setAddressList(list);

   const lastSelectedAddressKey = `lastSelectedAddress_${parsedProfile._id}`;
   const lastSelected = localStorage.getItem(lastSelectedAddressKey);
   const lastSelectedObject = lastSelected ? JSON.parse(lastSelected) : null;

   const foundLastSelected = list.find(
    (addr) =>
     addr.pincode === lastSelectedObject?.pincode &&
     addr.line1 === lastSelectedObject?.line1
   );

   let addrToSelect = null;
   if (foundLastSelected) {
    addrToSelect = foundLastSelected;
   } else {
    addrToSelect = list.find((a) => a.isDefault) || list[0] || null;
   }

   setSelectedAddress(addrToSelect);
  } else {
   setAddressList([]);
   setSelectedAddress(null);
  }
 }, []);

 const handleOpenAddressModal = () => {
  setShowAddressModal(true);
 };

 useEffect(() => {
  const loadFromLocalStorage = () => {
    const storedProfile = localStorage.getItem("user");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setUserProfile(parsedProfile);
      const currentUserId = parsedProfile._id;
      setCustomerid(currentUserId);

      const profileAddresses = parsedProfile.address || [];
      setFullAddressList(profileAddresses);
      setAddressList(profileAddresses);

      let newSelected = null;

      newSelected = profileAddresses.find(a => a.isDefault);

      if (!newSelected) {
        const lastSelectedKey = `lastSelectedAddress_${currentUserId}`;
        const lastSelectedRaw = localStorage.getItem(lastSelectedKey);
        const lastSelected = lastSelectedRaw ? JSON.parse(lastSelectedRaw) : null;
        if (lastSelected) {
          newSelected = profileAddresses.find(a => a._id === lastSelected._id);
        }
      }
      
      if (!newSelected && profileAddresses.length > 0) {
        newSelected = profileAddresses[0];
      }

      setSelectedAddress(newSelected);
    } else {
      setAddressList([]);
      setFullAddressList([]);
      setSelectedAddress(null);
    }
  };

  loadFromLocalStorage();
  window.addEventListener("addressUpdated", loadFromLocalStorage);

  return () => {
   window.removeEventListener("addressUpdated", loadFromLocalStorage);
  };
}, []);
 
const total = cartItems.reduce((sum, item) => {
 const originalPrice = item.discountedPrice;
 const productDiscount =item.discount;
 const finalPrice = originalPrice ;
 return sum + finalPrice * item.quantity;
}, 0);

 const [discountedTotal, setDiscountedTotal] = useState(total);
 const [discountAmount, setDiscountAmount] = useState(0);
 
 const calculateFinalTotal = () => {
  const originalSubtotal = total; 
  let couponDiscountAmount = 0;
  let finalTotal = originalSubtotal;
 
  if (selectedCoupon && originalSubtotal >= selectedCoupon.minPurchase) {
   if (selectedCoupon.discountType === "percentage") {
    let calculatedDiscount = (originalSubtotal * selectedCoupon.discountValue) / 100;
 
    // Apply the max discount cap if it exists and the calculated discount is larger
    if (selectedCoupon.maxDiscount && calculatedDiscount > selectedCoupon.maxDiscount) {
     couponDiscountAmount = selectedCoupon.maxDiscount;
    } else {
     couponDiscountAmount = calculatedDiscount;
    }
   } else if (selectedCoupon.discountType === "fixed") {
    couponDiscountAmount = selectedCoupon.discountValue;
   }
   
   // Ensure the final total doesn't go below zero
   finalTotal = Math.max(0, originalSubtotal - couponDiscountAmount);
  }
 
  return {
   subtotal: originalSubtotal,
   couponDiscountAmount,
   finalTotal,
  };
 };
 
 const handlePlaceOrder = async () => {
  if (!cartItems || cartItems.length === 0) {
   toast.warning("Your cart is empty. Please add items before placing an order.");
   return;
  }
 
  const customerid = localStorage.getItem("id");
  const mobile = localStorage.getItem("mobileNumber");
 
  if (!selectedAddress) {
   toast.warning("Please select a delivery address.");
   return;
  }
 
  // Calculate final totals - MODIFIED DESTRUCTURING
  const { subtotal: orderSubtotal, couponDiscountAmount, finalTotal: orderFinalTotal } = calculateFinalTotal();
 
  // Build order payload - MODIFIED TO INCLUDE subTotal
  const safeFirstName = userProfile?.firstName?.toString().trim() || "";
  let safeLastName = userProfile?.lastName?.toString().trim() || "";
  
  // If backend stored "undefined" as a string, clean it
  if (safeLastName.toLowerCase() === "undefined") {
    safeLastName = "";
  }
  
  const orderPayload = {
    customerId: customerid,
    customerName: `${safeFirstName} ${safeLastName}`.trim(),
    mobileNumber: mobile,
  
    address: `${selectedAddress.line1 || ""}, ${selectedAddress.line2 || ""}, ${selectedAddress.city || ""}, ${selectedAddress.state || ""} - ${selectedAddress.pincode || ""}`
      .replace(/\s*,\s*,/g, ",")
      .replace(/^,|,$/g, ""), 
  
    products: cartItems.map((p) => ({
      productId: p.productId?._id || p.productId,
      productName: p.productName,
      shortId: p.shortId,
      description: p.description,
      brand: p.brand,
      category: p.category,
      color: p.color,
      discountedPrice: p.discountedPrice,
      size: p.size,
      material: p.material,
      stock: p.stock,
      age: p.age,
      unit: p.unit,
      mainPrice: String(p.mainPrice),
      quantity: Number(p.quantity),
      discount: p.discount,
      igst: p.igst || "0",
      cess: p.cess || "0",
      cgst: p.cgst || "0",
      sgst: p.sgst || "0",
      finalPrice: p.finalPrice || String(p.price * p.quantity),
      images: p.images,
    })),
  
    totalAmount: orderFinalTotal,
    subTotal: orderSubtotal,
    discountedAmount: couponDiscountAmount,
    couponApplied: selectedCoupon?.couponCode || null,
  };    
 
  try {
   setLoading(true);
   const res = await API.post("/Dashboard/orders/create-order", orderPayload);
   setLoading(false);
   if (res.status === 200 || res.status === 201) {
    toast.success("Order placed successfully!");
    await clearCart(false);
    navigate("/order-confirmation", { state: { order: res.data.order } });
   } else {
    toast.error(res.data?.message || "Failed to place order");
   }
  } catch (error) {
   setLoading(false);
   console.error("Order placement failed:", error.response?.data || error.message);
   toast.error(error.response?.data?.message || "Something went wrong while placing order.");
  }
 };
 
 if (!selectedAddress && addressList.length === 0) {
  return (
   <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-lg mx-auto my-12 animate-fadeIn">
    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-6">
     <svg
      className="w-8 h-8 text-pink-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
     >
      <path
       strokeLinecap="round"
       strokeLinejoin="round"
       strokeWidth={2}
       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
       strokeLinecap="round"
       strokeLinejoin="round"
       strokeWidth={2}
       d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
     </svg>
    </div>
    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">No Address Found</h2>
    <p className="text-lg text-gray-600 mb-8">
     It looks like you haven't added a delivery address yet.
    </p>
    <button
     onClick={() => navigate("/account/address")}
     className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
    >
     Add a New Address
    </button>
   </div>
  );
 }

 return (
  <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
   <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 text-center mb-12">
     <span className="text-pink-600">Checkout</span>
    </h2>
 
    <div className="flex flex-col lg:flex-row gap-10">
     <div className="lg:w-2/3 w-full space-y-8">
      {/* Order Summary */}
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
       <h3 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
        Order Summary
       </h3>
       <div className="space-y-6">
        {cartItems.map((item, idx) => (
         <div
          key={idx}
          className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0"
         >
          <div className="flex items-center gap-6">
           <img
            src={`https://apis.toyshack.in/storage/productimages/${item.productId?.images?.[0]}`}
            alt={item.productId?.productName || item.productName}
            className="w-24 h-24 object-cover rounded-xl border border-gray-200"
           />
           <div>
            <p className="font-bold text-lg text-gray-900">
             {item.productId?.productName || item.productName}
            </p>
            <p className="text-sm font-medium text-gray-600">
             Size: {item.size || "N/A"}
            </p>
            <p className="text-sm font-medium text-gray-600">
             Qty: {item.quantity}
            </p>
           </div>
          </div>
          <p className="font-bold text-lg text-gray-900">
            ₹
            {Math.round(
              // ((item.priceAtAddToCart ?? item.productId?.diprice ?? 0) -
              //   ((item.discount ?? 0) / 100) *
              //     (item.priceAtAddToCart ?? item.productId?.price ?? 0)) *
              //   item.quantity
              (item.discountedPrice ?? 0) * (item.quantity ?? 1)
            ).toLocaleString("en-IN")}
          </p>
         </div>
        ))}
       </div>
       {/* The following coupon display is now somewhat redundant but can be kept to show the effect within the order summary */}
       {selectedCoupon && (
        <div className="mt-4 flex justify-between items-center text-green-600">
         <span className="font-semibold">Discount ({selectedCoupon.couponCode})</span>
         <span className="font-semibold">- ₹{Math.round(discountAmount).toLocaleString("en-IN")}</span>
        </div>
       )}
      </div>
 
      <CouponSelector
       cartTotal={total}
       onCouponSelect={(data) => {
        const { coupon, discountedTotal } = data || {}; // default to {}
        if (coupon) {
         setSelectedCoupon(coupon);
         setDiscountedTotal(discountedTotal);
         setDiscountAmount(total - discountedTotal);
        } else {
         // No coupon selected, reset
         setSelectedCoupon(null);
         setDiscountedTotal(total);
         setDiscountAmount(0);
        }
       }}
      />
     </div>
 
     <div className="lg:w-1/3 w-full space-y-8">
      <div className="lg:sticky lg:top-8 space-y-8">
       {/* Delivery Address */}
       <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
         <h3 className="text-2xl font-semibold text-gray-800">Delivery Address</h3>
         <button
          onClick={handleOpenAddressModal}
          className="text-sm text-pink-600 font-medium hover:text-pink-800 transition cursor-pointer"
         >
          Change
         </button>
        </div>
        <div className="text-gray-700 space-y-1.5 leading-relaxed text-sm">
         {selectedAddress ? (
          <>
           <p className="font-bold">
            {selectedAddress.label ||
             `${userProfile.firstName} ${userProfile.lastName}`}
           </p>
           <p>{userProfile.mobileNumber}</p>
           <p>{selectedAddress.line1}</p>
           {selectedAddress.line2 && <p>{selectedAddress.line2}</p>}
           <p>
            {selectedAddress.city}, {selectedAddress.state} -{" "}
            {selectedAddress.pincode}
           </p>
           <p>{selectedAddress.country}</p>
          </>
         ) : (
          <p className="text-gray-500 italic">No address selected. Please add an address.</p>
         )}
        </div>
       </div>
              
        {/* Price Details - NEW SECTION ADDED */}
        {/* <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
              Price Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{Math.round(total).toLocaleString("en-IN")}</span>
            </div>
            <div className={`flex justify-between ${discountAmount > 0 ? 'text-green-600 font-medium' : 'text-gray-700'}`}>
              <span>Coupon Discount</span>
              <span>- ₹{Math.round(discountAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200 text-xl font-bold text-gray-900">
              <span>Total Amount</span>
              <span>₹{Math.round(discountedTotal).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div> */}

       {/* Payment & Action Button */}
       <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Payment Method</h3>
        <p className="text-sm mb-6 text-gray-500">
         Cash on Delivery (COD) is the only available option.
        </p>
        <button
         onClick={handlePlaceOrder}
         disabled={loading}
         className="w-full bg-pink-600 text-white py-4 rounded-full font-bold shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
        >
         {loading ? "Placing Order..." : "Place Order (COD)"}
        </button>
       </div>
      </div>
     </div>
    </div>
 
    {showAddressModal && (
     <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
       <div className="flex justify-between items-center p-6 bg-gray-100 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">
         Select Delivery Address
        </h3>
        <button
         onClick={() => setShowAddressModal(false)}
         className="text-gray-500 hover:text-gray-800 text-2xl"
        >
         &times;
        </button>
       </div>
 
       <div className="p-4 bg-white border-b border-gray-100">
        <input
         type="text"
         placeholder="Search by label, city, or pincode..."
         className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
         value={searchQuery}
         onChange={(e) => {
          const value = e.target.value;
          setSearchQuery(value);

          // Filter from the full list, not the currently filtered list
          const filtered = fullAddressList.filter(
           (addr) =>
            addr.label?.toLowerCase().includes(value.toLowerCase()) ||
            addr.city?.toLowerCase().includes(value.toLowerCase()) ||
            addr.pincode?.toString().includes(value)
          );
          setAddressList(filtered);
         }}
        />
       </div>
       <div className="flex-1 overflow-y-auto p-6 grid gap-6 sm:grid-cols-2">
        {addressList.length === 0 ? (
         <p className="text-gray-400 text-center col-span-full text-sm">
          No addresses found.
         </p>
        ) : (
         addressList.map((addr, idx) => {
          const isSelected =
           selectedAddress &&
           (
            selectedAddress._id === addr._id ||
            (selectedAddress.line1 === addr.line1 && selectedAddress.pincode === addr.pincode)
           );

          return (
           <label
            key={addr._id || idx}
            onClick={() => {
             setSelectedAddress(addr);
             if (userProfile?._id) {
              localStorage.setItem(
               `lastSelectedAddress_${userProfile._id}`,
               JSON.stringify(addr)
              );
             }
             setShowAddressModal(false);
            }}
            className={`relative border rounded-2xl p-6 shadow-sm transition-all duration-200 ease-in-out cursor-pointer ${
             isSelected
              ? "border-pink-500 bg-pink-50 ring-1 ring-pink-500"
              : "hover:border-pink-300"
            }`}
           >
            <input
             type="radio"
             name="selectedAddress"
             checked={isSelected}
             readOnly
             className="absolute top-5 right-5 w-5 h-5 text-pink-600 focus:ring-pink-500"
            />
            <p className="font-bold text-lg text-gray-900 mb-1">
             {addr.label || "Address"}
            </p>
            <div className="text-sm text-gray-600 space-y-1">
             <p>{addr.line1}</p>
             {addr.line2 && <p>{addr.line2}</p>}
             <p>
              {addr.city}, {addr.state} - {addr.pincode}
             </p>
             <p>{addr.country}</p>
            </div>
           </label>
          );
         })
        )}
       </div>

       <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4">
        <button
         onClick={() => {
          localStorage.setItem("addressBookOpenedFromCheckout", "true");
          navigate("/account/address");
         }}
         className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition cursor-pointer"
        >
         + Add New Address
        </button>
        <button
         onClick={() => setShowAddressModal(false)}
         className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition cursor-pointer"
        >
         Cancel
        </button>
       </div>
      </div>
     </div>
    )}
   </div>
  </div>
 );
};

export default CheckoutPage;