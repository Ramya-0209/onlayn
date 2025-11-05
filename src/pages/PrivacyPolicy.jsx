import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-extrabold text-[#014aaf] mb-8">Privacy Policy</h1>
      <p className="mb-4 text-sm">
        At <strong>ToyShack</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide while using our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>Personal details like name, email, phone number, and address during checkout or account creation</li>
        <li>Browsing behavior including pages visited, clicks, and time spent</li>
        <li>Device information like IP address, browser type, and operating system</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>To process and deliver your orders</li>
        <li>To respond to your customer service requests</li>
        <li>To personalize your experience and show relevant products</li>
        <li>To send occasional updates and promotions (you may opt out anytime)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
      <p className="text-sm mb-4">
        We implement strong security measures to protect your data from unauthorized access, misuse, or disclosure. However, no method of online transmission is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies</h2>
      <p className="text-sm mb-4">
        Our website uses cookies to enhance user experience, remember preferences, and analyze traffic. You can disable cookies through your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Third-Party Services</h2>
      <p className="text-sm mb-4">
        We may use trusted third-party tools (e.g., payment gateways or analytics providers). These parties are bound to protect your data under their own privacy policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>Access, update, or delete your personal information</li>
        <li>Request to stop receiving promotional emails</li>
        <li>Contact us for any data-related questions at <a href="mailto:hello.toyshack@gmail.com" className="text-[#014aaf] underline">hello.toyshack@gmail.com</a></li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Policy Updates</h2>
      <p className="text-sm mb-4">
        We may update this policy periodically. Please review this page occasionally to stay informed.
      </p>

      {/* <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p> */}
    </div>
  );
};

export default PrivacyPolicy;
