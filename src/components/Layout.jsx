import React from "react";
import ContactBar from "./ContactBar";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "sonner";
import AppDownloadBanner from "./AppDownloadBanner"; // ⬅️ import it here

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ContactBar />
      <Header />

      <main className="flex-grow">{children}</main>

      <Footer />

      {/* 🔽 App download popup/banner */}
      <AppDownloadBanner />

      <Toaster
        position="top-center"
        closeButton
        duration={2000}
        toastOptions={{
          classNames: {
            toast: `
              flex items-center gap-3 
              px-5 py-3 rounded-lg 
              shadow-md border border-gray-200`,
            title: "text-base font-normal text-gray-900",
            description: "text-base font-normal text-gray-700",
          },
        }}
      />
    </div>
  );
};

export default Layout;
