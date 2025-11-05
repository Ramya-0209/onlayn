import React from "react";
import ProductCard from "../ProductCard";

const ProductGrid = ({ products}) => {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">No products found!</p>
    );
  }

  products.forEach((product, index) => {
    const { _id, productName, price } = product || {};
    if (!_id || !productName || price === undefined || price === null) {
      console.warn(
        `Product missing critical field at index ${index}:`,
        { _id, productName, price }
      );
    }
  });

  return (
    <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product._id || `temp-${index}-${product.productName || "no-name"}`}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;


