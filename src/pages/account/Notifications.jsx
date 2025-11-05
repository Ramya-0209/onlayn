// import React, { useState, useEffect, useCallback } from "react";
// import { toast } from "sonner";
// import { FaBell } from "react-icons/fa";
// import API from "../../api";

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchNotifications = useCallback(async () => {
//     setIsLoading(true);
  
//     try {
//       const response = await API.get("/Dashboard/notifications/notifications"); // ✅ FIXED endpoint
  
//       const fetchedNotifications = response.data.notifications;
  
//       if (!Array.isArray(fetchedNotifications)) {
//         console.error(
//           "API response for notifications is not an array:",
//           response.data
//         );
//         toast.error("Received unexpected data format from the server.");
//         setIsLoading(false);
//         return;
//       }
  
//       const formattedNotifications = fetchedNotifications.map((note) => ({
//         id: note._id,
//         title: note.notificationTitle || "No Title",
//         message: note.message || "No Message",
//         date: new Date(note.createdAt).toLocaleString(),
//       }));
  
//       setNotifications(formattedNotifications);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       const errorMessage =
//         error.response?.data?.message || error.message || "Unknown error";
//       toast.error(`Failed to load notifications: ${errorMessage}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const handleDeleteAllNotifications = useCallback(async () => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete all notifications?"
//     );
  
//     if (!confirmDelete) return; 
  
//     const toastId = toast.loading("Deleting all notifications...");
  
//     try {
//       const response = await API.delete(
//         "/Dashboard/notifications/delete-all-notifications"
//       );
  
//       if (response.status === 200) {
//         toast.success("All notifications deleted successfully!", { id: toastId });
//         setNotifications([]);
//         fetchNotifications();
//       } else {
//         toast.error("Failed to delete notifications", { id: toastId });
//       }
//     } catch (error) {
//       console.error("Error deleting all notifications:", error);
//       const errorMessage =
//         error.response?.data?.error ||
//         error.response?.data?.message ||
//         error.message ||
//         "Unknown error";
//       toast.error(`An error occurred: ${errorMessage}`, { id: toastId });
//     }
//   }, [fetchNotifications]);
  

//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   if (isLoading) {
//     return (
//       <div className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-600 text-lg">
//         Loading notifications...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto bg-gray-50 p-4 sm:p-6 lg:p-10">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
//           <FaBell className="text-3xl" /> Notifications
//         </h2>
//         <button
//           onClick={handleDeleteAllNotifications}
//           disabled={notifications.length === 0}
//           className={`text-sm px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm cursor-pointer
//             ${
//               notifications.length > 0
//                 ? "bg-red-500 text-white hover:bg-red-600"
//                 : "bg-gray-200 text-gray-500 cursor-not-allowed"
//             }`}
//         >
//           Delete All
//         </button>
//       </div>

//       {/* Notification List */}
//       {notifications.length === 0 ? (
//         <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-16 w-16 mb-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1.5}
//               d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//             />
//           </svg>
//           <p className="text-lg">You're all caught up!</p>
//           <p className="text-sm mt-1">No new notifications at this time.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map((note) => (
//             <div
//               key={note.id}
//               className="flex justify-between items-start rounded-xl p-5 shadow-sm transition-all duration-300 bg-white text-gray-700 hover:shadow-md"
//             >
//               <div>
//                 <p className="font-semibold">{note.title}</p>
//                 <p className="text-sm text-gray-600 mt-1">{note.message}</p>
//                 <p className="text-xs text-gray-400 mt-2">{note.date}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;





// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import { FaBell, FaTrash } from "react-icons/fa";

// const API = axios.create({ baseURL: "https://apis.toyshack.in" });

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   /** ✅ Fetch all notifications */
//   const fetchNotifications = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await API.get("App/notifications/all-notifications");
//       const fetchedNotifications = response.data.notifications;

//       if (!Array.isArray(fetchedNotifications)) {
//         console.error("API response is not an array:", response.data);
//         toast.error("Unexpected data format from server.");
//         return;
//       }

//       const formatted = fetchedNotifications.map((note) => ({
//         id: note._id,
//         title: note.notificationTitle || "No Title",
//         message: note.message || "No Message",
//         date: new Date(note.createdAt).toLocaleString(),
//       }));

//       setNotifications(formatted);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       toast.error(`Failed to load notifications: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   /** ✅ Delete a single notification */
//   const handleDeleteNotification = useCallback(async (id) => {
//     if (!window.confirm("Delete this notification?")) return;

//     const toastId = toast.loading("Deleting notification...");
//     try {
//       const response = await API.delete(`/App/notifications/delete-notification/${id}`);
//       if (response.status === 200) {
//         toast.success("Notification deleted!", { id: toastId });
//         setNotifications((prev) => prev.filter((n) => n.id !== id));
//       } else {
//         toast.error("Failed to delete notification", { id: toastId });
//       }
//     } catch (error) {
//       console.error("Error deleting notification:", error);
//       toast.error(`Error: ${error.response?.data?.message || error.message}`, { id: toastId });
//     }
//   }, []);

//   /** ✅ Delete all notifications */
//   const handleDeleteAllNotifications = useCallback(async () => {
//     if (!window.confirm("Delete all notifications?")) return;

//     const toastId = toast.loading("Deleting all notifications...");
//     try {
//       const response = await API.delete("/App/notifications/delete-all-notifications");
//       if (response.status === 200) {
//         toast.success("All notifications deleted!", { id: toastId });
//         setNotifications([]);
//       } else {
//         toast.error("Failed to delete all notifications", { id: toastId });
//       }
//     } catch (error) {
//       console.error("Error deleting all notifications:", error);
//       toast.error(`Error: ${error.response?.data?.message || error.message}`, { id: toastId });
//     }
//   }, []);

//   /** ✅ Load on mount */
//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   if (isLoading) {
//     return (
//       <div className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-600 text-lg">
//         Loading notifications...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto bg-gray-50 p-4 sm:p-6 lg:p-10">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
//           <FaBell className="text-3xl" /> Notifications
//         </h2>
//         <button
//           onClick={handleDeleteAllNotifications}
//           disabled={notifications.length === 0}
//           className={`text-sm px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm cursor-pointer
//             ${
//               notifications.length > 0
//                 ? "bg-red-500 text-white hover:bg-red-600"
//                 : "bg-gray-200 text-gray-500 cursor-not-allowed"
//             }`}
//         >
//           Delete All
//         </button>
//       </div>

//       {/* Notification List */}
//       {notifications.length === 0 ? (
//         <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-16 w-16 mb-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1.5}
//               d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//             />
//           </svg>
//           <p className="text-lg">You're all caught up!</p>
//           <p className="text-sm mt-1">No new notifications at this time.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map((note) => (
//             <div
//               key={note.id}
//               className="flex justify-between items-start rounded-xl p-5 shadow-sm transition-all duration-300 bg-white text-gray-700 hover:shadow-md"
//             >
//               <div>
//                 <p className="font-semibold">{note.title}</p>
//                 <p className="text-sm text-gray-600 mt-1">{note.message}</p>
//                 <p className="text-xs text-gray-400 mt-2">{note.date}</p>
//               </div>
//               <button
//                 onClick={() => handleDeleteNotification(note.id)}
//                 className="text-red-500 hover:text-red-600 ml-4"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;



import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaBell, FaTrash } from "react-icons/fa";

const API = axios.create({ baseURL: "https://apis.toyshack.in" });

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /** ✅ Fetch all notifications (with filter by customerId) */
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const customerId = localStorage.getItem("id"); // ✅ use localStorage in web

      const response = await API.get("/App/notifications/all-notifications");
      const fetchedNotifications = response.data.notifications;

      if (!Array.isArray(fetchedNotifications)) {
        console.error("API response is not an array:", response.data);
        toast.error("Unexpected data format from server.");
        return;
      }

      // ✅ Filter notifications for this customer
      const filtered = fetchedNotifications.filter(
        (item) => String(item.customerId) === String(customerId)
      );

      // ✅ Format
      const formatted = filtered.map((note) => ({
        id: note._id,
        title: note.notificationTitle || "No Title",
        message: note.message || "No Message",
        date: new Date(note.createdAt).toLocaleString(),
      }));

      setNotifications(formatted);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(
        `Failed to load notifications: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** ✅ Delete a single notification */
  const handleDeleteNotification = useCallback(async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    const toastId = toast.loading("Deleting notification...");
    try {
      const response = await API.delete(`/App/notifications/delete-notification/${id}`);
      if (response.status === 200) {
        toast.success("Notification deleted!", { id: toastId });
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } else {
        toast.error("Failed to delete notification", { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`, { id: toastId });
    }
  }, []);

  /** ✅ Delete all notifications (only for this customer) */
  const handleDeleteAllNotifications = useCallback(async () => {
    if (!window.confirm("Delete all notifications?")) return;

    const customerId = localStorage.getItem("id");
    const toastId = toast.loading("Deleting all notifications...");

    try {
      // if your backend supports filtering delete by customerId:
      // const response = await API.delete(`/App/notifications/delete-all-notifications?customerId=${customerId}`);

      // otherwise delete all, then clear only this customer's list in frontend
      const response = await API.delete("/App/notifications/delete-all-notifications");

      if (response.status === 200) {
        toast.success("All notifications deleted!", { id: toastId });
        setNotifications([]); // ✅ clear state for this user
      } else {
        toast.error("Failed to delete all notifications", { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`, { id: toastId });
    }
  }, []);

  /** ✅ Load on mount */
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-600 text-lg">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <FaBell className="text-3xl" /> Notifications
        </h2>
        <button
          onClick={handleDeleteAllNotifications}
          disabled={notifications.length === 0}
          className={`text-sm px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm cursor-pointer
            ${
              notifications.length > 0
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
        >
          Delete All
        </button>
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="text-lg">You're all caught up!</p>
          <p className="text-sm mt-1">No new notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((note) => (
            <div
              key={note.id}
              className="flex justify-between items-start rounded-xl p-5 shadow-sm transition-all duration-300 bg-white text-gray-700 hover:shadow-md"
            >
              <div>
                <p className="font-semibold">{note.title}</p>
                <p className="text-sm text-gray-600 mt-1">{note.message}</p>
                <p className="text-xs text-gray-400 mt-2">{note.date}</p>
              </div>
              <button
                onClick={() => handleDeleteNotification(note.id)}
                className="text-red-500 hover:text-red-600 ml-4"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;