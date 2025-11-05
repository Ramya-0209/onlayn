import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ScrollProvider } from "./context/ScrollContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {/* <ScrollProvider> */}
            <App />
          {/* </ScrollProvider> */}
          {/* <ToastContainer
            position="top-center"
            autoClose={1500}
            // hideProgressBar
            hideProgressBar={false}
            newestOnTop={true}
            pauseOnHover
            closeOnClick
            draggable
          /> */}
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </BrowserRouter>
);

