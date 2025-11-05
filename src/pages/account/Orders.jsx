import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Processing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user?._id) {
      setAllOrders([]);
      setLoading(false);
      setError("User not logged in");
      return;
    }
  
    try {
      setLoading(true);
  
      const res = await fetch(
        "https://apis.toyshack.in/Dashboard/orders/orders-data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: user._id }),
        }
      );
  
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  
      const data = await res.json();
  
      if (!Array.isArray(data.response)) throw new Error("Unexpected API format");
  
      setAllOrders(data.response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    const toastId = toast.loading("Cancelling order...");
    setCancellingOrderId(orderId);

    try {
      const payload = {
        customerId: user._id, 
        orderId,
        orderStatus: "Cancelled", 
      };

      const res = await fetch(
        "https://apis.toyshack.in/App/orders/status-update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Order cancelled successfully!", { id: toastId });
        fetchOrders(); 
      } else {
        toast.error(data?.error || "Failed to cancel order", { id: toastId });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.message || "Failed to cancel order", { id: toastId });
    } finally {
      setCancellingOrderId(null);
    }
  };

  const filteredOrders = allOrders
    .filter(
      (order) =>
        order.orderStatus?.toLowerCase().trim() ===
        activeTab.toLowerCase().trim()
    )
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  const getTotalItems = (products) => {
    if (!products || products.length === 0) return 0;
    return products.length;
  };

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase().trim()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-[#014aaf] border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Loading orders...</div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 bg-gray-50">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-8">
        My Orders
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-0 sm:gap-8 mb-8 border-b-2 border-gray-200">
        {["Processing", "Delivered", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative -mb-[2px] px-5 py-3 rounded-t-lg text-sm sm:text-md font-semibold transition-colors duration-200 cursor-pointer
              ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <p className="text-lg">No {activeTab.toLowerCase()} orders found.</p>
          <p className="text-sm mt-1">Check back later or view other tabs.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-lg p-6 space-y-5 transform transition-transform hover:scale-[1.01] duration-300"
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold text-gray-700">
                    <span className="text-gray-900">Order ID:</span>{" "}
                    {order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Date:</span>{" "}
                    {new Date(order.orderDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      Total Items:
                    </span>{" "}
                    {getTotalItems(order.products)}
                  </p>
                </div>

                {/* Status + View Details */}
                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusClasses(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                  <Link
                    to={`/account/orders/${order._id}`}
                    className="bg-blue-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg shadow-sm 
                              hover:bg-blue-700 transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Products */}
              <div className="divide-y divide-gray-200">
                {order.products?.length > 0 ? (
                  order.products.map((item) => (
                    <div
                      key={item._id || item.productName}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          Product: {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ₹{Math.round(Number(item.discountedPrice)).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm py-4">
                    No items found in this order.
                  </p>
                )}
              </div>

              {/* Cancel Button */}
              {order.orderStatus === "Processing" && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-500 text-white font-medium py-2 px-6 rounded-lg shadow-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    disabled={cancellingOrderId === order._id}
                  >
                    {cancellingOrderId === order._id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
