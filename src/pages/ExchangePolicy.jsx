// import React from "react";

// const RefundPolicy = () => {
//   return (
//     <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
//       <h1 className="text-4xl font-extrabold text-[#014aaf] mb-8">Exchange Policy</h1>
//       <p className="mb-4 text-sm">
//         At <strong>ToyShack</strong>, we value your trust and happiness. To ensure a hassle-free shopping
//         experience, we follow a <strong>no return policy</strong>. Instead, we offer{" "}
//         <strong>instant exchanges</strong> and <strong>open-box delivery</strong> so that you
//         always get the perfect product without worry.
//       </p>

//       <h2 className="text-xl font-semibold mt-6 mb-2">1. Instant Exchanges</h2>
//       <p className="text-sm mb-4">
//         If you receive a product that is damaged, defective, or not as expected, we’ll provide an{" "}
//         <strong>instant exchange</strong>. Our delivery partner will hand over the replacement
//         item at your doorstep while collecting the original product. This ensures you never have to
//         wait long for your child’s joy.
//       </p>

//       <h2 className="text-xl font-semibold mt-6 mb-2">2. Open-Box Delivery</h2>
//       <p className="text-sm mb-4">
//         For selected items, we offer <strong>open-box delivery</strong>. This allows you to check
//         your toy in front of the delivery partner before accepting it. If there are any issues,
//         the exchange will be processed immediately.
//       </p>

//       <h2 className="text-xl font-semibold mt-6 mb-2">3. Eligibility for Exchange</h2>
//       <ul className="list-disc ml-6 text-sm space-y-1">
//         <li>Exchange request must be raised within <strong>48 hours</strong> of delivery.</li>
//         <li>Products must be in unused condition (except in case of damage/defect at delivery).</li>
//         <li>A valid proof of purchase (order ID or invoice) is required.</li>
//       </ul>

//       <h2 className="text-xl font-semibold mt-6 mb-2">4. Non-Exchangeable Items</h2>
//       <ul className="list-disc ml-6 text-sm space-y-1">
//         <li>Customized or personalized toys</li>
//         <li>Clearance or final sale items</li>
//       </ul>

//       <h2 className="text-xl font-semibold mt-6 mb-2">5. Need Help?</h2>
//       <p className="text-sm">
//         For any exchange or delivery-related queries, email us at{" "}
//         <a href="mailto:hello.toyshack@gmail.com" className="text-[#014aaf] underline">
//           hello.toyshack@gmail.com
//         </a>{" "}
//         or call{" "}
//         <a href="tel:+91 8121301888" className="text-[#014aaf] underline">
//         +91 8121301888
//         </a>
//         . Our team will be happy to assist you.
//       </p>
//     </div>
//   );
// };

// export default RefundPolicy;

import React from "react";
import { Link } from "react-router-dom";

const ExchangePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl text-center font-extrabold text-[#13426b] mb-8">
        Exchange Policy
      </h1>

      <p className="text-sm mb-4">
        At <strong>Onlayn</strong>, we value your trust and happiness. To ensure
        a hassle-free shopping experience, we follow a <strong>no return policy</strong>. 
        Instead, we offer <strong>instant exchanges</strong> and{" "}
        <strong>open-box delivery</strong> so that you always get the perfect
        product without worry. <br />
        <span className="font-semibold text-red-500">
          No return once the order is accepted by the customer.
        </span>
      </p>

      {/* Instant Exchange */}
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Instant Exchanges</h2>
      <p className="text-sm mb-4">
        If you receive a product that is damaged, defective, or not as expected,
        we will provide an instant exchange. Our delivery partner will hand over
        the replacement item at your doorstep while collecting the original
        product. This ensures you never have to wait long for your child’s joy.
      </p>

      {/* Open Box Delivery */}
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Open-Box Delivery</h2>
      <p className="text-sm mb-4">
        For selected items, we offer <strong>open-box delivery</strong>. This
        allows you to check your toy in front of the delivery partner before
        accepting it. If there are any issues, the exchange will be processed
        immediately.
      </p>

      {/* Need Help */}
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Need Help?</h2>
      <p className="text-sm mb-4">
        For any exchange or delivery-related queries, email us at{" "}
        <a
          href="mailto:contact.onlayn@gmail.com"
          className="text-blue-600 underline"
        >
          contact.onlayn@gmail.com
        </a>{" "}
        or call{" "}
        <a href="tel:+918121301888" className="text-blue-600 underline">
          +91 8121301888
        </a>
        ,{" "}
        <a href="tel:+918121304888" className="text-blue-600 underline">
          +91 8121304888
        </a>
        . Our team will be happy to assist you.
      </p>

      {/* About Onlayn */}
      <h2 className="text-xl font-semibold mt-8 mb-2">About Onlayn</h2>
      <p className="text-sm mb-4">
        Trusted by parents and loved by kids, our toys are designed to be safe,
        affordable, and full of joy — making playtime more meaningful at every
        stage of childhood.
      </p>

      {/* Quick Links */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Quick Links</h2>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>
          <Link to="/" className="text-blue-600 ">
            Home
          </Link>
        </li>
        <li>
          <Link to="/toys" className="text-blue-600 ">
            Toys
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ExchangePolicy;
