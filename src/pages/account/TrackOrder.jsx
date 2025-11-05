import React, { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";

const dummyOrders = {
  "ORD-001": {
    status: "Shipped",
    location: "En route to Hyderabad",
    estimatedDelivery: "July 26, 2025",
    orderDate: "July 21, 2025",
    shipping: {
      name: "Ramya Boyina",
      phone: "+91 9876543210",
      addressLine1: "45, Rainbow Apartments",
      addressLine2: "Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
    },
  },
  "ORD-002": {
    status: "Delivered",
    location: "Delivered to Chennai",
    estimatedDelivery: "July 10, 2025",
    orderDate: "June 29, 2025",
    shipping: {
      name: "Ramya Boyina",
      phone: "+91 9876543210",
      addressLine1: "Plot 12, Anna Nagar",
      addressLine2: "",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
    },
  },
  "ORD-003": {
    status: "Cancelled",
    location: "N/A",
    estimatedDelivery: "N/A",
    orderDate: "June 10, 2025",
    shipping: {
      name: "Ramya Boyina",
      phone: "+91 9876543210",
      addressLine1: "Sector 45",
      addressLine2: "MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
  },
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);

  const handleTrack = () => {
    const id = orderId.trim().toUpperCase();
    if (dummyOrders[id]) {
      setOrderStatus(dummyOrders[id]);
    } else {
      setOrderStatus("not_found");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-[#0d6e82] mb-8 text-center">
        Track Your Order
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Enter Order ID (e.g. ORD-001)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0d6e82] transition"
        />
        <button
          onClick={handleTrack}
          className="flex items-center gap-2 bg-[#0d6e82] text-white px-5 py-2.5 rounded-lg hover:bg-[#0a5c6d] transition"
        >
          <FaSearchLocation className="text-lg" /> Track
        </button>
      </div>

      {/* Order Status */}
      <div className="mt-8">
        {orderStatus && orderStatus !== "not_found" && (
          <div className="bg-white border rounded-xl p-6 shadow-md space-y-6">
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    orderStatus.status === "Delivered"
                      ? "text-green-600"
                      : orderStatus.status === "Shipped"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {orderStatus.status}
                </span>
              </p>
              <p>
                <span className="font-medium">Current Location:</span>{" "}
                {orderStatus.location}
              </p>
              <p>
                <span className="font-medium">Estimated Delivery:</span>{" "}
                {orderStatus.estimatedDelivery}
              </p>
              <p>
                <span className="font-medium">Order Date:</span>{" "}
                {orderStatus.orderDate}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">
                Delivery Address
              </h4>
              <div className="text-gray-700 text-sm space-y-1">
                <p>{orderStatus.shipping.name}</p>
                <p>{orderStatus.shipping.addressLine1}</p>
                {orderStatus.shipping.addressLine2 && (
                  <p>{orderStatus.shipping.addressLine2}</p>
                )}
                <p>
                  {orderStatus.shipping.city}, {orderStatus.shipping.state} -{" "}
                  {orderStatus.shipping.pincode}
                </p>
                <p>📞 {orderStatus.shipping.phone}</p>
              </div>
            </div>
          </div>
        )}

        {orderStatus === "not_found" && (
          <div className="mt-4 text-center text-red-600 font-medium">
            ❌ Order not found. Please check your Order ID.
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
