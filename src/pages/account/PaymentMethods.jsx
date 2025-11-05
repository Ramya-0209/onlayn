import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";

const PaymentMethods = () => {
  return (
    <div>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8">
        Payment Method
      </h2>
  
      {/* Payment Method Card */}
      <div className="bg-white p-6 flex items-center gap-6 transition-transform transform hover:scale-[1.01] duration-300">
        {/* Icon */}
        <div className="p-4 rounded-full bg-blue-100 text-amber-400">
          <FaMoneyBillWave className="text-3xl" />
        </div>
  
        {/* Text Content */}
        <div className="space-y-1">
          <p className="font-semibold text-xl text-gray-900">Cash on Delivery</p>
          <p className="text-sm text-gray-500">
            Pay when your order is delivered to you.
          </p>
        </div>
      </div>
  
      {/* Note */}
      <div className="mt-6 p-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-700">
        <p className="text-sm">
          <span className="font-semibold text-gray-800">Note:</span> Only
          <span className="text-[#014aaf] font-bold ml-1">COD</span> is currently
          available. Online payment options will be added soon.
        </p>
      </div>
    </div>
    </div>
  );
};

export default PaymentMethods;
