import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-extrabold text-[#014aaf] mb-8">Terms & Conditions</h1>
      <p className="mb-4 text-sm">
        Welcome to <strong>ToyShack</strong>. These Terms & Conditions govern your use of our website and services. By accessing or purchasing from our site, you agree to these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Website</h2>
      <p className="text-sm mb-4">
        You agree to use our site for lawful purposes only. Any misuse, fraudulent activity, or harm caused to the platform or users may result in restricted access or legal action.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Products & Pricing</h2>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>All prices are in INR and inclusive of applicable taxes (unless otherwise stated).</li>
        <li>We reserve the right to change pricing or discontinue products at any time without notice.</li>
        <li>Product availability is subject to change based on stock.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Orders & Payments</h2>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>By placing an order, you confirm that all provided information is accurate and complete.</li>
        <li>Payments must be made through our secure gateway. We do not store any card details.</li>
        <li>We reserve the right to cancel orders due to errors, stock issues, or suspicious activity.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Shipping & Delivery</h2>
      <p className="text-sm mb-4">
        We aim to dispatch orders promptly. Delays due to external factors (e.g., courier delays, weather) are not our responsibility. Delivery timelines are estimates.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Returns & Refunds</h2>
      <p className="text-sm mb-4">
        Please refer to our <strong>Return Policy</strong> for full details. Products must be unused and returned within 7 days of delivery to be eligible for a refund or exchange.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Intellectual Property</h2>
      <p className="text-sm mb-4">
        All content on this site — including logos, graphics, and text — is the property of ToyShack and cannot be used without prior written permission.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h2>
      <p className="text-sm mb-4">
        We are not liable for any damages arising from the use or inability to use our products or website beyond the purchase amount.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to Terms</h2>
      <p className="text-sm mb-4">
        We reserve the right to update these terms at any time. It is your responsibility to check this page periodically for changes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact Us</h2>
      <p className="text-sm mb-4">
        If you have questions about these terms, please contact us at{" "}
        <a href="mailto:hello.toyshack@gmail.com" className="text-[#014aaf] underline">
          hello.toyshack@gmail.com
        </a>.
      </p>

      {/* <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p> */}
    </div>
  );
};

export default TermsAndConditions;
