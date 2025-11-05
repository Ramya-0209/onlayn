import React from "react";

const Coupons = () => {
  const coupons = [
    {
      code: "TOYSALE25",
      description: "Get 25% off on all educational toys.",
      expiry: "July 31, 2025",
      discount: "25%",
    },
    {
      code: "FREESHIP",
      description: "Free shipping on orders above ₹999.",
      expiry: "August 15, 2025",
      discount: "Free Shipping",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0d6e82] mb-6">My Coupons</h2>

      {coupons.length === 0 ? (
        <p className="text-gray-600">You don’t have any active coupons.</p>
      ) : (
        <div className="grid gap-4">
          {coupons.map((coupon, index) => (
            <div
              key={index}
              className="border border-dashed rounded-lg p-4 shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-bold text-[#158aac]">{coupon.code}</p>
                <p className="text-sm text-gray-700">{coupon.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Expires on: {coupon.expiry}
                </p>
              </div>
              <span className="text-sm font-medium bg-[#e0f7ff] text-[#0d6e82] px-3 py-1 rounded-full">
                {coupon.discount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coupons;
