import React from "react";
import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md text-center border border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Order Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn’t find any order to display. Please check your order history.
          </p>
          <a
            href="/account/orders"
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-pink-600 transition"
          >
            View Order History
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-15 flex items-center justify-center bg-gray-50 p-4">
      <div className="p-8 max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17L4 12"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Thank you! Order Placed.
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
          Your order <strong>#{order.orderId}</strong> is confirmed and will be processed shortly. You can check the status and details in your order history.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/account/orders"
            className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-600 transition-colors transform hover:scale-105"
          >
            Check Order Status
          </Link>
          <Link
            to="/toys"
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;