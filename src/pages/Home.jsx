import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductShowcase from "../components/ProductShowcase";
import AgeRecommendations from "../components/AgeRecommendations";
import Testimonials from "../components/Testimonials";
import PromoBanner from "../components/PromoBanner";
import TrustSection from "../components/TrustSection";

const Home = () => {
  return (
    <div>
      
      <Hero />
      <PromoBanner />
      <Categories />
      <ProductShowcase />
      <AgeRecommendations />
      <Testimonials />
      <TrustSection />
    </div>
  );
};

export default Home;
