import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ShopPage from "./pages/ShopPage";
import ProductDetail from "./components/shopPage/ProductDetail";
import Wishlist from "./pages/Wishlist";
import CartPage from "./pages/CartPage";
import CategoriesPage from "./pages/CategoriesPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound"; 

import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import Orders from "./pages/account/Orders";
import TrackOrder from "./pages/account/TrackOrder";
import Address from "./pages/account/Address";
import PaymentMethods from "./pages/account/PaymentMethods";
import Coupons from "./pages/account/Coupons";
import Notifications from "./pages/account/Notifications";
import Settings from "./pages/account/Settings";
import OrderDetail from "./pages/account/OrderDetail";
import CheckoutPage from "./components/CheckoutPage";
import OrderConfirmation from "./components/OrderConfirmation";
import { FiltersProvider } from "./context/FiltersContext";
import ScrollToTop from "./components/ScrollToTop";
import { ScrollProvider } from "./context/ScrollContext";
import ExchangePolicy from "./pages/ExchangePolicy";

const App = () => {
  return (
    <FiltersProvider>
      <ScrollProvider>
      <Layout>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/toys" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

            <Route path="/account" element={<AccountLayout />}>
              <Route index element={<Navigate to="profile" />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="track-order" element={<TrackOrder />} />
              <Route path="address" element={<Address />} />
              <Route path="payment-methods" element={<PaymentMethods />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/exchange-policy" element={<ExchangePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ScrollProvider>
    </FiltersProvider>
    
  );
};

export default App;
