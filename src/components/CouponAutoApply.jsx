import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const CouponSelector = ({ cartTotal, onCouponSelect }) => {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
console.log("cartTotal====>",cartTotal)
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const computeDiscount = (coupon, total) => {
    if (!coupon) return 0;
    const totalNum = toNumber(total);
    const value = toNumber(coupon.discountValue);
    const max = coupon.maxDiscount != null ? toNumber(coupon.maxDiscount) : null;

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (totalNum * value) / 100;
      if (max !== null && discount > max) discount = max;
    } else {
      discount = value;
    }

    return Math.round((discount + Number.EPSILON) * 100) / 100;
  };



  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const customerId = localStorage.getItem("id");
        const url = customerId
          ? `https://apis.toyshack.in/App/coupons/getcoupons?customerId=${customerId}`
          : `https://apis.toyshack.in/App/coupons/getcoupons`;
    
        const response = await fetch(url);
        const data = await response.json();
  
        if (data && Array.isArray(data.coupons)) {
          console.log("data.coupons=>",data.coupons)
          setAvailableCoupons(data.coupons);
        } else {
          console.warn("❗ Invalid coupon data format:", data);
          setAvailableCoupons([]);
        }
      } catch (error) {
        console.error("❌ Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (selectedCoupon && toNumber(cartTotal) < toNumber(selectedCoupon.minPurchase)) {
      setSelectedCoupon(null);
      setDiscountAmount(0);
      onCouponSelect?.(null);
    }
  }, [cartTotal, selectedCoupon, onCouponSelect]);

  const handleSelectCoupon = (couponCode) => {
    if (!couponCode) {
      setSelectedCoupon(null);
      setDiscountAmount(0);
      onCouponSelect?.(null);
      return;
    }

    const coupon = availableCoupons.find((c) => c.couponCode === couponCode);
    if (!coupon) return;

    if (toNumber(cartTotal) >= toNumber(coupon.minPurchase)) {
      const discount = computeDiscount(coupon, cartTotal);

      setSelectedCoupon(coupon);
      setDiscountAmount(discount);
      onCouponSelect?.({
        coupon,
        discountedTotal: Math.max(0, toNumber(cartTotal) - discount),
      });
      toast.success(`Coupon "${coupon.couponCode}" applied!`);
    } else {
      toast.warning(`Minimum purchase ₹${toNumber(coupon.minPurchase)} required.`);
      setSelectedCoupon(null);
      setDiscountAmount(0);
      onCouponSelect?.(null);
    }
  };

  const finalAmount = Math.max(0, toNumber(cartTotal) - toNumber(discountAmount));

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 mt-6">
      <h3 className="text-2xl font-semibold mb-6 pb-4 border-b border-gray-200 text-gray-800">
        Apply Coupon
      </h3>

      {loading ? (
        <p className="text-center text-gray-500 py-4">Loading coupons...</p>
      ) : (
        <div className="relative">
          <select
            value={selectedCoupon?.couponCode || ""}
            onChange={(e) => handleSelectCoupon(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer bg-white"
          >
            {availableCoupons.length === 0 ? (
              <option value="" disabled>
                No coupons available
              </option>
            ) : (
              <>
                <option value="">Select an available coupon</option>
                {availableCoupons.map((coupon) => {
                  const isEligible = toNumber(cartTotal) >= toNumber(coupon.minPurchase);
                  const discountText =
                    coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% OFF${coupon.maxDiscount ? ` (up to ₹${coupon.maxDiscount})` : ""}`
                      : `₹${coupon.discountValue} OFF`;

                  const label = `${coupon.couponCode} — ${discountText}${
                    coupon.minPurchase > 0 ? ` • Minimum purchase ₹${coupon.minPurchase}` : ""
                  }`;

                  return (
                    <option
                      key={coupon.couponCode}
                      value={coupon.couponCode}
                      disabled={!isEligible}
                      className={`${!isEligible ? "text-gray-400 italic" : "text-gray-800"}`}
                    >
                      {label} {isEligible ? "" : "(Not Eligible)"}
                    </option>
                  );
                })}
              </>
            )}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      )}

      {/* {availableCoupons.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 font-medium">
          Add ₹
          {(
            Math.min(...availableCoupons.map(c => Number(c.minPurchase))) - Number(cartTotal)
          ).toFixed(2)}{" "}
          more to get a coupon!
        </div>
      )} */}

{availableCoupons.length > 0 && (
  <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 font-medium">
    {(() => {
      // Find the smallest minimum purchase requirement that is still higher than the cart total
      const nextCoupon = availableCoupons
        .map(c => Number(c.minPurchase))
        .filter(min => min > Number(cartTotal))
        .sort((a, b) => a - b)[0]; // get smallest higher value

      if (!nextCoupon) return "You're eligible for all available coupons! 🎉";

      const difference = nextCoupon - Number(cartTotal);

      return (
        <>
          Add ₹{difference.toFixed(2)} more to get a coupon!
        </>
      );
    })()}
  </div>
)}


      {selectedCoupon && (
        <div className="mt-4 p-4 rounded-xl bg-pink-50 border border-pink-200">
          <p className="text-sm text-pink-700 font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Coupon applied successfully!
          </p>
        </div>
      )}

      {/* Summary Section */}
      <div className="mt-8 border-t pt-6 text-md font-semibold">
        <div className="flex justify-between mb-2 text-gray-700">
          <span>Original Total:</span>
          <span>₹{Math.round(toNumber(cartTotal)).toLocaleString("en-IN")}</span>
        </div>

        {selectedCoupon && (
          <div className="flex justify-between mb-2 text-pink-600">
            <span>Coupon Discount:</span>
            <span>- ₹{Math.round(toNumber(discountAmount)).toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-xl border-t border-dashed border-gray-300 pt-4">
          <span>Final Amount:</span>
          <span>₹{Math.round(toNumber(finalAmount)).toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
};

export default CouponSelector;
