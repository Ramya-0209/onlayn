// import React from "react";

// const PrivacyPolicy = () => {
//   return (
//     <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
//       <h1 className="text-4xl font-extrabold text-[#014aaf] mb-8">Privacy Policy</h1>
//       <p className="mb-4 text-sm">
//         At <strong>ToyShack</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide while using our website.
//       </p>

//       <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
//       <ul className="list-disc ml-6 text-sm space-y-1">
//         <li>Personal details like name, email, phone number, and address during checkout or account creation</li>
//         <li>Browsing behavior including pages visited, clicks, and time spent</li>
//         <li>Device information like IP address, browser type, and operating system</li>
//       </ul>

//       <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
//       <ul className="list-disc ml-6 text-sm space-y-1">
//         <li>To process and deliver your orders</li>
//         <li>To respond to your customer service requests</li>
//         <li>To personalize your experience and show relevant products</li>
//         <li>To send occasional updates and promotions (you may opt out anytime)</li>
//       </ul>

//       <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
//       <p className="text-sm mb-4">
//         We implement strong security measures to protect your data from unauthorized access, misuse, or disclosure. However, no method of online transmission is 100% secure.
//       </p>

//       <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies</h2>
//       <p className="text-sm mb-4">
//         Our website uses cookies to enhance user experience, remember preferences, and analyze traffic. You can disable cookies through your browser settings.
//       </p>

//       <h2 className="text-xl font-semibold mt-6 mb-2">5. Third-Party Services</h2>
//       <p className="text-sm mb-4">
//         We may use trusted third-party tools (e.g., payment gateways or analytics providers). These parties are bound to protect your data under their own privacy policies.
//       </p>

//       <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
//       <ul className="list-disc ml-6 text-sm space-y-1">
//         <li>Access, update, or delete your personal information</li>
//         <li>Request to stop receiving promotional emails</li>
//         <li>Contact us for any data-related questions at <a href="mailto:hello.toyshack@gmail.com" className="text-[#014aaf] underline">hello.toyshack@gmail.com</a></li>
//       </ul>

//       <h2 className="text-xl font-semibold mt-6 mb-2">7. Policy Updates</h2>
//       <p className="text-sm mb-4">
//         We may update this policy periodically. Please review this page occasionally to stay informed.
//       </p>

//       {/* <p className="text-sm text-gray-500 mt-8">
//         Last updated: {new Date().toLocaleDateString()}
//       </p> */}
//     </div>
//   );
// };

// export default PrivacyPolicy;



import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl text-center font-extrabold text-[#13426b] mb-5">Privacy Policy</h1>
      <p className="mb-8 text-sm text-gray-500">
        <strong>Last Updated:</strong> 17th November 2025
      </p>

      {/* 1. Introduction */}
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
      <p className="text-sm mb-4">
        This Privacy Policy describes how Novelty Technologies ("we," "us," or "our") collects, uses, and shares information through our{" "}
        <a
          href="https://onlayn.toys/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          Website
        </a>{" "}
        and our{" "}
        <a
          href="https://play.google.com/store/apps/details?id=com.default.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          Mobile Application
        </a>
        .
      </p>

      <p className="text-sm mb-4">
        By using our services, you consent to the data practices described in this policy.
      </p>

      {/* 2. The information we collect */}
      <h2 className="text-xl font-semibold mt-6 mb-2">2. The Information We Collect</h2>
      <p className="text-sm mb-2">
        We collect the following personal data to provide and improve our services:
      </p>

      <h3 className="text-lg font-medium mt-4 mb-1">A. Data You Provide Directly:</h3>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>
          <strong>Identity & Contact Data:</strong> Your full name, email address, and mobile phone number (for account creation and order verification).
        </li>
        <li>
          <strong>Delivery Data:</strong> Your delivery addresses (including home, work, etc.).
        </li>
        <li>
          <strong>Communications:</strong> Any information you provide when you contact our customer support.
        </li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-1">B. Data We Collect Automatically (Usage Data):</h3>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>
          <strong>Device Data:</strong> Information about your mobile device, such as IP address, device model, operating system, and App version.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about how you interact with our App, such as pages viewed, products searched, and time spent on the App.
        </li>
      </ul>

      {/* 3. How We Use Your Data */}
      <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Use Your Data</h2>
      <p className="text-sm mb-2">
        We use your personal data for the specific purposes for which we collected it:
      </p>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>
          <strong>To Provide Our Service:</strong> To create and manage your account, identify you, and process your orders.
        </li>
        <li>
          <strong>To Deliver Your Orders:</strong> To find your location, dispatch a delivery partner, and confirm delivery.
        </li>
        <li>
          <strong>To Communicate With You:</strong> To send you order updates, transaction confirmations, and respond to your support requests.
        </li>
        <li>
          <strong>For Marketing:</strong> To send you promotional offers, newsletters, and information about new products.
        </li>
        <li>
          <strong>To Improve Our App:</strong> To analyze usage patterns, fix bugs, and improve the user experience.
        </li>
      </ul>

      {/* 4. Who We Share Your Data With */}
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Who We Share Your Data With</h2>
      <p className="text-sm mb-2">
        We do not sell your personal data. We only share it with the following third parties as necessary:
      </p>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>
          <strong>Our Delivery Partners:</strong> We share your name, delivery address, phone number, and order details with our delivery riders so they can find you and complete the delivery.
        </li>
        <li>
          <strong>Legal & Safety:</strong> We may disclose your information if required by law, or to protect the safety of our users, our staff, or the public.
        </li>
      </ul>

      {/* 5. Your Rights */}
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>
          <strong>Right to Access:</strong> You have the right to get a summary of the personal data we hold about you. You can find this in the profile section.
        </li>
        <li>
          <strong>Right to Correct:</strong> You have the right to correct any inaccurate or outdated information in your profile.
        </li>
        <li>
          <strong>Right to Erase:</strong> You have the right to request that we delete your personal data by writing a mail to <a href="mailto:contact.onlayn@gmail.com" className="text-blue-600 underline">contact.onlayn@gmail.com</a>. We aim to resolve your query within 7 working days.
        </li>
        <li>
          <strong>Right to Withdraw Consent:</strong> You have the right to withdraw your consent at any time. For example, you can unsubscribe from marketing emails.
        </li>
      </ul>

      {/* 6. Data Security */}
      <h2 className="text-xl font-semibold mt-6 mb-2">6. Data Security</h2>
      <p className="text-sm mb-4">
        We take reasonable security measures to protect your data from loss, theft, and unauthorized access. This includes using encryption (like SSL) and secure server practices. However, no internet-based service can be 100% secure.
      </p>

      {/* 7. Data Retention */}
      <h2 className="text-xl font-semibold mt-6 mb-2">7. Data Retention</h2>
      <p className="text-sm mb-4">
        We will only keep your personal data for as long as it is necessary to fulfill the purposes we collected it for, or as required by any law (e.g., for tax and accounting records).
      </p>

      {/* 8. Children's Data */}
      <h2 className="text-xl font-semibold mt-6 mb-2">8. Children's Data</h2>
      <p className="text-sm mb-2">
        Our services are not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If you are aware that a child has provided us with their data, please contact us immediately.
      </p>
      <p className="text-sm mb-4">
        Mail id- <a href="mailto:contact.onlayn@gmail.com" className="text-blue-600 underline">contact.onlayn@gmail.com</a>
      </p>

      {/* 9. Grievance Officer & Contact Information */}
      <h2 className="text-xl font-semibold mt-6 mb-2">9. Grievance Officer & Contact Information</h2>
      <p className="text-sm mb-2">
        For any questions, concerns, or grievances regarding this privacy policy or your personal data, you may contact our Grievance Officer:
      </p>
      <p className="text-sm mb-4">
        Name: <strong>M Sudheer</strong><br />
        Email: <a href="mailto:contact.onlayn@gmail.com" className="text-blue-600 underline">contact.onlayn@gmail.com</a>
      </p>

      {/* 10. Changes to This Policy */}
      <h2 className="text-xl font-semibold mt-6 mb-2">10. Changes to This Policy</h2>
      <p className="text-sm mb-4">
        We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our App and Site or by sending you an email.
      </p>
    </div>
  );
};

export default PrivacyPolicy;