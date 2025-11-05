import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const OrderDetails = () => {
 const { id } = useParams();
 const [order, setOrder] = useState(null);
 const [allProducts, setAllProducts] = useState([]);
 const [deliveryDetails, setDeliveryDetails] = useState(null);
 const [profiles, setProfiles] = useState([]);
 const [agentMobile, setAgentMobile] = useState(null); 
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const navigate = useNavigate();
 const token = localStorage.getItem("token");

 useEffect(() => {
  const fetchAllData = async () => {
   setLoading(true);
   setError(null);
 
   try {
    const [orderRes, deliveryRes, productsRes, profilesRes] = await Promise.all([
     fetch(`https://apis.toyshack.in/Dashboard/orders/one-order/${id}`),
     fetch(`https://apis.toyshack.in/Dashboard/delivery/all-deliveries`),
     fetch("https://apis.toyshack.in/Dashboard/products/all-products"),
     fetch("https://apis.toyshack.in/Dashboard/Users/all-profiles"),
    ]);
 
    const orderData = orderRes.ok ? await orderRes.json() : null;
    const productsData = productsRes.ok ? await productsRes.json() : [];
    const deliveryData = deliveryRes.ok ? await deliveryRes.json() : [];
    const profilesData = profilesRes.ok ? await profilesRes.json() : [];
 
    const orderObj = orderData?.order || orderData;
    const productsArray = productsData?.products || productsData;
    const deliveriesArray = Array.isArray(deliveryData) ? deliveryData : deliveryData?.deliveries || [];
    const profilesArray = Array.isArray(profilesData) ? profilesData : profilesData?.profiles || [];
 
    if (!orderRes.ok || !orderObj) {
     throw new Error(orderData?.message || "Failed to fetch order");
    }
 
    const matchedDelivery = deliveriesArray.find(
     (delivery) =>
      String(delivery.orderId?._id || delivery.orderId) ===
      String(orderObj._id)
    );
 
    setOrder(orderObj);
    setAllProducts(productsArray);
    setProfiles(profilesArray);
 
    if (matchedDelivery) {
     setDeliveryDetails(matchedDelivery);
 
     if (matchedDelivery.agentId) {
      const agentProfile = profilesArray.find(
       (p) => String(p._id) === String(matchedDelivery.agentId)
      );
 
      if (agentProfile?.mobileNumber) {
       setAgentMobile(agentProfile.mobileNumber);
      }
     }
    }
   } catch (err) {
    console.error("Error fetching data:", err);
    setError(err.message || "Failed to load details. Please try again.");
   } finally {
    setLoading(false);
   }
  };
 
  if (id) fetchAllData();
  else {
   setLoading(false);
   setError("Order ID is missing.");
  }
 }, [id]);
 
const getTotalItems = (products) => {
 if (!products || products.length === 0) return 0;
 return products.length; 
};

const goToProductDetail = (item) => {
 navigate(`/product/${item.id || item.productId}`, { state: { product: item } });
};

const handleDownloadInvoice = () => {
 if (!order) return;

 const doc = new jsPDF("p", "mm", "a4");
 const margin = 15;
 const pageWidth = doc.internal.pageSize.getWidth();
 const rightMargin = pageWidth - margin;
 let y = 20;

 const couponDiscount = order.discountedAmount || 0;
 const calculatedSubtotal = (order.totalAmount ?? 0) + (couponDiscount ?? 0); 
 const finalTotalPayable = (order.totalAmount ?? 0);

 doc.setFontSize(22).setFont("helvetica", "bold").setTextColor("#014aaf");
 doc.text("INVOICE", margin, y);
 y += 12;

 // ===== Invoice Info =====
 doc.setFontSize(10).setFont("helvetica", "normal").setTextColor("#000");

 // Labels row
 doc.text("INVOICE NO.", margin, y);
 doc.text("DATE", margin + 60, y);
 doc.text("PAYMENT METHOD", margin + 110, y);
 doc.text("FINAL AMOUNT", rightMargin, y, { align: "right" });
 y += 6;

 // Values row
 doc.setFont("helvetica", "bold");
 doc.text(String(order.orderId), margin, y);
 const orderDate = new Date(order.orderDate);
 const formattedDate = `${String(orderDate.getDate()).padStart(2,'0')}/${String(orderDate.getMonth()+1).padStart(2,'0')}/${orderDate.getFullYear()}`;
 doc.text(formattedDate, margin + 60, y);
  doc.text("Cash on Delivery", margin + 110, y);
  doc.text(`Rs ${Math.round(finalTotalPayable)}`, rightMargin, y, { align: "right" });
  y += 12;

 doc.line(margin, y, rightMargin, y);
 y += 10;

 // ===== BILL TO =====
 doc.setFontSize(12).setFont("helvetica", "bold");
 doc.text("BILL TO:", margin, y);
 y += 6;

 doc.setFontSize(10).setFont("helvetica", "normal");
 doc.text(order.customerName, margin, y);
 y += 5;

 const billToAddress = [
  order.address || "",
  order.city || "",
  order.state || "",
  order.pincode || "",
  order.addresses || ""
]
  .filter(Boolean)
  .join(", ");

if (billToAddress) {
  const billToLines = doc.splitTextToSize(billToAddress, 80);
  doc.text(billToLines, margin, y);
  y += billToLines.length * 3 + 4;
}

 if (order.mobileNumber) {
  doc.text(`${order.mobileNumber}`, margin, y);
  y += 8;
} else if (order.phone) {
  doc.text(`Phone: ${order.phone}`, margin, y);
  y += 8;
}

 // ===== BILL FROM =====
 doc.setFontSize(12).setFont("helvetica", "bold");
 doc.text("BILL FROM:", margin, y);
 y += 6;

 doc.setFontSize(10).setFont("helvetica", "normal");
 doc.text("Novelty Technologies", margin, y);
 y += 5;

 const billFromAddress =
  "D/No. 25-84/42/FF502, Venu Dharani Apartment, P.M Palem, Revenue Ward 4, Visakhapatnam, Andhra Pradesh - 530048";
 const billFromLines = doc.splitTextToSize(billFromAddress, 80);
 doc.text(billFromLines, margin, y);
 y += billFromLines.length * 3 + 4;

 doc.text("+91 8121301888", margin, y);
 y += 5;
 doc.text("hello.toyshack@gmail.com", margin, y);
 y += 5;
 doc.text("GST Number: 37AAYFN3829L1ZC", margin, y);
 y += 12;

 doc.line(margin, y, rightMargin, y);
 y += 10;

 // ===== Table =====
 const tableBody = order.products.map((item) => {
  const price = Number(item.mainPrice ?? 0);
  const qty = Number(item.quantity ?? 0);
  const discountedPrice = Number(item.discountedPrice ?? price);

  const gross = price * qty;
  const taxable = discountedPrice * qty;
  const igst = Number(item.igst ?? 0);
  const cess = Number(item.cess ?? 0);
  const cgst = Number(item.cgst ?? 0);
  const sgst = Number(item.sgst ?? 0);
  const total = taxable;

  const discountPercent =
  price > 0 ? Math.round(((price - discountedPrice) / price) * 100) : 0;

  return [
   item.productName || "N/A",
   String(qty),
  `Rs ${Math.round(price)}`,
  `Rs ${Math.round(gross)}`,
  `${Math.round(discountPercent)}%`,
  `Rs ${Math.round(taxable)}`,
  `${Math.round(igst)}%`,
  `${Math.round(cess)}%`,
  `${Math.round(cgst)}%`,
  `${Math.round(sgst)}%`,
  `Rs ${Math.round(total)}`
  ];
 });

 autoTable(doc, {
  startY: y,
  head: [
   [
    "Item",
    "Qty",
    "Price",
    "Gross Amt",
    "Discount",
    "Taxable Value",
    "IGST",
    "CESS",
    "SGST",
    "CGST",
    "Total",
   ],
  ],
  body: tableBody,
  theme: "grid",
  headStyles: {
   fillColor: [255, 255, 255], 
   textColor: [0, 0, 0],    
   halign: "center",
   fontStyle: "bold",
   lineWidth: 0.3,      
   lineColor: [0, 0, 0],    
  },
  bodyStyles: {
   halign: "center",
  },
  styles: {
   fontSize: 9,
   cellPadding: 3,
   lineWidth: 0.2,       
   lineColor: [0, 0, 0],
  },
 }); 

 // ===== Totals =====
 let finalY = doc.lastAutoTable.finalY + 10;
 doc.setFont("helvetica", "normal").setFontSize(10);

 // UPDATED: Use the calculated Subtotal
 doc.text("Subtotal", 140, finalY);
 doc.text(`Rs ${Math.round(calculatedSubtotal)}`, rightMargin, finalY, { align: "right" }); 

 finalY += 6;
 if (order.couponApplied) {
  // Use the calculated subtotal for percentage
  const discountPercent = calculatedSubtotal > 0 
   ? ((couponDiscount / calculatedSubtotal) * 100).toFixed(2) 
   : "0";

  doc.text(`Coupon`, 140, finalY);
  doc.text(`- Rs ${Math.round(couponDiscount)}`, rightMargin, finalY, {
    align: "right",
  });
  finalY += 6;
 }

 doc.setFont("helvetica", "bold");
 doc.text("Total Amount", 140, finalY);
 // UPDATED: Use the final total payable
 doc.text(`Rs ${Math.round(finalTotalPayable)}`, rightMargin, finalY, {
  align: "right",
});
 
 // ===== Footer =====
 doc.setFontSize(14).setFont("helvetica", "bold").setTextColor("#014aaf");
 doc.text("THANK YOU FOR YOUR PURCHASE!", margin, finalY + 20);

 doc.save(`invoice_${order.orderId}.pdf`);
};

if (loading) return <div className="text-center py-10 text-gray-600">Loading order details...</div>;
if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
if (!order || allProducts.length === 0) return <div className="text-center py-10 text-gray-600">Waiting for all data to load...</div>;

return (
 <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-10">
  <div className="max-w-4xl mx-auto">
   {/* Back Button */}
   <div className="mb-6">
    <Link 
     to="/account/orders" 
     className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
    >
     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
     </svg>
     Back to My Orders
    </Link>
   </div>

   {/* Header and Download Button */}
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Order Details</h2>
    {order?.orderStatus === "Delivered" && (
     <button 
      onClick={handleDownloadInvoice} 
      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
     >
      Download Invoice
     </button>
    )}
   </div>

   {/* Order Info Card */}
   <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 space-y-6">
    <div className="flex justify-between items-start flex-wrap gap-4">
     <div className="text-sm sm:text-base text-gray-800 space-y-2">
      <p><span className="font-semibold text-gray-500">Order ID:</span> {order.orderId}</p>
      <p> 
       <span className="font-semibold text-gray-500">Order Date:</span>{" "}
       {new Date(order.orderDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
       })}
      </p>
      <p><span className="font-semibold text-gray-500">Customer:</span> {order.customerName}</p>
      {order.orderStatus !== "Cancelled" && (
       <div className="mt-4 space-y-2">
        <p><span className="font-semibold text-gray-500">Delivery Person:</span>{" "}
         {deliveryDetails?.deliveryAgent || (
          <span className="text-white bg-blue-600 px-2 py-1 rounded-full text-xs font-semibold inline-block">
           Not yet assigned
          </span>
         )}
        </p>
        {(order.orderStatus === "Processing" || deliveryDetails) && (
         <p><span className="font-semibold text-gray-500">Mobile No:</span>{" "}
          {deliveryDetails?.mobileNumber || <span className="text-gray-400">Not available</span>}
         </p>
        )}
        {(order.orderStatus === "Processing" || order.orderStatus === "Delivered") && (
         <p>
         <span className="font-semibold text-gray-500">
          {order.orderStatus === "Delivered" ? "Delivered On:" : "Estimated Delivery:"}
         </span>{" "}
         {deliveryDetails?.estimatedDate
          ? new Date(deliveryDetails.estimatedDate).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
           })
          : "Not available"}
        </p>        
        )}
       </div>
      )}
     </div>
     <div>
      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border
       ${
        order.orderStatus === "Delivered"
         ? "bg-green-100 text-green-700 border-green-200"
         : order.orderStatus === "Cancelled"
         ? "bg-red-100 text-red-700 border-red-200"
         : "bg-blue-100 text-blue-700 border-blue-200"
       }`}
      >
       {order.orderStatus}
      </span>
     </div>
    </div>
    <div className="mt-4 text-sm sm:text-base text-gray-800 space-y-2 border-t border-gray-200 pt-6">
     <p className="font-semibold text-gray-500">Shipping Address:</p>
     <p className="font-medium">{order.address}</p>
    </div>
   </div>

   {/* Items Section */}
   <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Items in Your Order</h3>
    <p className="text-gray-500 mb-4">
     Total Items: {getTotalItems(order.products)}
    </p>
    <div className="divide-y divide-gray-200">
     {order.products.map((item, index) => (
      <div key={index} 
      className="flex justify-between items-center py-4 first:pt-0 cursor-pointer"
      onClick={() => goToProductDetail(item)}>
       <div className="flex items-center gap-4">
        <img
         src={`https://apis.toyshack.in/storage/productimages/${item.images?.[0]}`}
         alt={item.name}
         className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200"
        />
        <div>
         <p className="font-medium text-gray-800">{item.productName}</p>
         <p className="text-sm text-gray-500">Size: {item.size || "N/A"}</p>
         <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
         <p className="text-sm text-gray-500">Price: ₹{Math.round(item.discountedPrice).toLocaleString("en-IN")}</p>
        </div>
       </div>
       <span className="text-sm sm:text-lg font-bold text-gray-800">
        ₹{Math.round(item.discountedPrice * item.quantity).toLocaleString("en-IN")}
      </span>
      </div>
     ))}
    </div>
   </div>

   {/* Payment Summary */}
   <div className="bg-white rounded-2xl shadow-xl p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h3>
    <div className="flex flex-col gap-2 text-gray-700 text-base">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span className="font-medium">
          ₹{Math.round(
            ((order.totalAmount ?? 0) + (order.discountedAmount ?? 0)) ||
            (order.subTotal ?? 0)
          ).toLocaleString("en-IN")}
        </span>
      </div>
      {order.couponApplied && (
        <div className="flex justify-between text-green-600">
          <span>Discount ({order.couponApplied})</span>
          <span className="font-medium">
            - ₹{Math.round(order.discountedAmount ?? 0).toLocaleString("en-IN")}
          </span>
        </div>
      )}
      <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900">
        <span>Total Payable</span>
        <span>₹{Math.round(order.totalAmount ?? 0).toLocaleString("en-IN")}</span> 
      </div>
    </div>
   </div>
  </div>
 </div>
);
};

export default OrderDetails;