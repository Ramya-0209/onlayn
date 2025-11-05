import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-30 bg-white text-center p-6">
      <h1 className="text-7xl font-extrabold text-pink-500 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="bg-blue-800 text-white px-6 py-3 rounded-sm shadow-md hover:bg-blue-900 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
