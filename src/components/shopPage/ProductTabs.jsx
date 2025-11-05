import React, { useState } from "react";
import ReviewsTab from "./ReviewsTab"; 

const SpecItem = ({ k, v }) => (
      <div className="bg-white border border-gray-100 rounded-lg shadow p-3">
        <dt className="text-gray-500">{k}</dt>
        <dd className="text-gray-900 font-medium mt-1">{v}</dd>
      </div>
    );  

const ProductTabs = ({
  product,
  displayCategory,
  age,
  material,
  size,
  unit,
  currentStock,
  currentDiscount,
  displayReviewss,
  setDisplayReviewss,
}) => {
  const TABS = ["Description", "Specifications", "Exchange & Delivery",];
  const [activeTab, setActiveTab] = useState("Description");

  return (
    <div className="mt-12 lg:mt-16 bg-white rounded-xl shadow-lg p-6 lg:p-8">
      {/* Tab Buttons */}
      <div className="flex gap-3 sm:gap-2 border-b-2 border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-1 sm:px-6 py-3 text-sm sm:text-lg font-semibold transition-colors duration-300 cursor-pointer
              ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === "Description" && (
          <p className="text-gray-700 leading-relaxed">
            {product.description ||
              "This is a fun and engaging toy perfect for young minds."}
          </p>
        )}

        {activeTab === "Specifications" && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-base borde">
            {product.shortId && <SpecItem k="Short ID (SKU)" v={product.shortId} />}
            {displayCategory && <SpecItem k="Category" v={displayCategory} />}
            {product.brand && <SpecItem k="Brand" v={product.brand} />}
            {age && <SpecItem k="Age" v={product.age} />}
            {material && <SpecItem k="Material" v={product.material} />}
            {size && <SpecItem k="Size" v={product.size} />}
            {unit && <SpecItem k="Unit" v={product.unit} />}
            <SpecItem k="Stock" v={String(currentStock)} />
            {currentDiscount > 0 && <SpecItem k="Discount" v={`${currentDiscount}%`} />}
          </dl>
        )}

        {activeTab === "Exchange & Delivery" && (
          <div className="space-y-6 text-gray-700 text-md">
            <p className="leading-relaxed">
              We provide <strong>instant exchanges</strong> for unused items in their
              original packaging. Please note,{" "}
              <span className="font-semibold">returns are not accepted</span>—only direct
              exchanges.
            </p>
            <p className="leading-relaxed">
              With our <strong>open box delivery</strong> service, you can inspect your
              item upon arrival and exchange it immediately if needed. Enjoy a
              hassle-free experience and quick resolutions without waiting for returns.
            </p>
            <p className="leading-relaxed">
              Our delivery options are fast and reliable, including same-day delivery in
              select cities. Shipping costs and estimated delivery times will be clearly
              displayed at checkout.
            </p>
          </div>
        )}

        {activeTab === "Reviews" && (
          <ReviewsTab
            displayReviews={displayReviewss}
            setDisplayReviews={setDisplayReviewss}
          />
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
