// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import { FaUserCircle, FaBox, FaMapMarkerAlt, FaCreditCard, FaBell } from "react-icons/fa";

// const sidebarLinks = [
//   { to: "profile", icon: <FaUserCircle />, label: "Profile" },
//   { to: "orders", icon: <FaBox />, label: "Orders" },
//   { to: "address", icon: <FaMapMarkerAlt />, label: "Addresses" },
//   { to: "payment-methods", icon: <FaCreditCard />, label: "Payments" },
//   { to: "notifications", icon: <FaBell />, label: "Notifications" },
// ];

// const AccountLayout = () => {
//   return (
//     <div className="bg-gray-50 p-4 sm:p-6 lg:p-10">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
//         {/* Sidebar */}
//         <aside className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 lg:sticky lg:top-8 lg:self-start lg:h-fit">
//           {/* Profile Heading */}
//           <div className="text-center mb-6 hidden lg:block">
//             <FaUserCircle className="text-5xl text-gray-400 mx-auto" />
//             <h2 className="mt-3 text-2xl font-semibold text-gray-800 tracking-tight">My Account</h2>
//           </div>

//           {/* Nav Links */}
//           <nav className="flex justify-center items-center lg:block space-x-4 lg:space-x-0 lg:space-y-4">
//             {sidebarLinks.map(({ to, icon, label }) => (
//               <NavLink
//                 key={to}
//                 to={to}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ease-in-out
//                   ${
//                     isActive
//                       ? "bg-[#014aaf] text-white shadow-md transform scale-105"
//                       : "text-gray-700 hover:bg-gray-100 hover:text-[#014aaf]"
//                   }`
//                 }
//                 aria-label={label}
//               >
//                 <span className="text-xl">{icon}</span>
//                 <span className="font-medium whitespace-nowrap hidden lg:inline">{label}</span>
//               </NavLink>
//             ))}
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <section className="lg:col-span-3 bg-white shadow-lg">
//           <Outlet />
//         </section>
//       </div>
//     </div>
//   );
// };

// export default AccountLayout;





import React from "react";
import { Outlet } from "react-router-dom";
import { FaUserCircle, FaBox, FaMapMarkerAlt, FaCreditCard, FaBell } from "react-icons/fa";

const sidebarLinks = [
  { to: "/account/profile", icon: <FaUserCircle />, label: "Profile" },
  { to: "/account/orders", icon: <FaBox />, label: "Orders" },
  { to: "/account/address", icon: <FaMapMarkerAlt />, label: "Addresses" },
  { to: "/account/payment-methods", icon: <FaCreditCard />, label: "Payments" },
  { to: "/account/notifications", icon: <FaBell />, label: "Notifications" },
];

const AccountLayout = () => {
  const currentPath = window.location.pathname; // get current URL path

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 lg:sticky lg:top-8 lg:self-start lg:h-fit">
          {/* Profile Heading */}
          <div className="text-center mb-6 hidden lg:block">
            <FaUserCircle className="text-5xl text-gray-400 mx-auto" />
            <h2 className="mt-3 text-2xl font-semibold text-gray-800 tracking-tight">My Account</h2>
          </div>

          {/* Nav Links */}
          <nav className="flex justify-center items-center lg:block space-x-4 lg:space-x-0 lg:space-y-4">
            {sidebarLinks.map(({ to, icon, label }) => {
              const isActive = currentPath === to; // check if current URL matches link
              return (
                <a
                  key={to}
                  href={to}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ease-in-out
                    ${isActive 
                      ? "bg-[#014aaf] text-white shadow-md transform scale-105" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#014aaf]"
                    }`}
                  aria-label={label}
                >
                  <span className="text-xl">{icon}</span>
                  <span className="font-medium whitespace-nowrap hidden lg:inline">{label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-3 bg-white shadow-lg">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AccountLayout;
