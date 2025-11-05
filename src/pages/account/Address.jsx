import React, { useState, useEffect, useCallback } from "react";
import { FaTrash, FaEdit, FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";
import AddressModal from "./AddressModal";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    label: "Home",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMode, setNewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messageStatus, setMessageStatus] = useState(null);
  const [deliveryPincodes, setDeliveryPincodes] = useState([]);
  const [pincodeMessage, setPincodeMessage] = useState({ text: "", type: "" });

  const userProfile = JSON.parse(localStorage.getItem("user")) || {};
  const userId = userProfile._id;

  const resetForm = useCallback(() => {
    setFormData({
      label: "Home",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
    setEditId(null);
    setNewMode(false);
    setPincodeMessage({ text: "", type: "" });
  }, []);

  const updateLocalData = useCallback((newAddressList) => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedUser = { ...storedUser, address: newAddressList };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("address-updated"));
  }, []);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const userProfile = JSON.parse(localStorage.getItem("user")) || {};
      const customerId = userProfile._id; // ✅ get ID from localStorage
  
      const response = await fetch(
        `https://apis.toyshack.in/Dashboard/customers/customer-profile?id=${customerId}`
      );
  
      const rawData = await response.json();
  
      if (response.ok && rawData && rawData.address) {
        const fetchedAddresses = rawData.address.map((addr) => ({
          ...addr,
          id: addr._id,
          isDefault: addr.isDefault || false,
        }));
        setAddresses(fetchedAddresses);
        updateLocalData(fetchedAddresses);
      } else {
        console.error("API response is not as expected:", rawData);
        toast.error("Received unexpected address data from the server.");
        setAddresses([]);
        updateLocalData([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error(`Failed to load addresses: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }, [updateLocalData]);

  const fetchDeliveryPincodes = useCallback(async () => {
    try {
      const response = await fetch(
        "https://apis.toyshack.in/Dashboard/deliverypincode/all-delivery-pincodes"
      );
      const data = await response.json();
      const validPincodes = data.map((item) => item.pincode);
      setDeliveryPincodes(validPincodes);
    } catch (error) {
      console.error("Error fetching delivery pincodes:", error);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
    fetchDeliveryPincodes();
  }, [fetchAddresses, fetchDeliveryPincodes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode") {
      if (value.length === 6) {
        if (deliveryPincodes.includes(value)) {
          setPincodeMessage({ text: "Delivery is available for this pincode! 😊", type: "success" });
        } else {
          setPincodeMessage({ text: "Sorry, delivery is not available for this pincode. 😟", type: "error" });
        }
      } else {
        setPincodeMessage({ text: "", type: "" });
      }
    }
  };

  const validateForm = () => {
    const { label, line1, city, state, pincode, country } = formData;

    if (!label) return toast.error("Please select a label.") && false;
    if (!line1.trim()) return toast.error("Address Line 1 is required.") && false;
    if (!city.trim()) return toast.error("City is required.") && false;
    if (!state.trim()) return toast.error("State is required.") && false;
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode))
      return toast.error("Please enter a valid 6-digit pincode.") && false;
    if (!deliveryPincodes.includes(pincode))
      return toast.error("Sorry, delivery is not available for this pincode.") && false;
    if (!country.trim()) return toast.error("Country is required.") && false;

    return true;
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;
  
    const newAddress = { ...formData };
    let finalAddresses = editId
      ? addresses.map((addr) =>
          addr.id === editId
            ? { ...newAddress, _id: addr.id, isDefault: addr.isDefault }
            : addr
        )
      : [...addresses, { ...newAddress, isDefault: false }];
  
    // ✅ include userId in payload
    const userProfile = JSON.parse(localStorage.getItem("user")) || {};
    const updatePayload = {
      id: userProfile._id,   // pass id to backend
      address: finalAddresses,
    };
  
    const toastId = toast.loading("Saving address...");
  
    try {
      const response = await fetch(
        "https://apis.toyshack.in/Dashboard/customers/customer-update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Address saved successfully!", { id: toastId });
        const fetchedAddresses = data?.address
          ? data.address.map((addr) => ({
              ...addr,
              id: addr._id,
              isDefault: addr.isDefault || false,
            }))
          : finalAddresses;
  
        setAddresses(fetchedAddresses);
        updateLocalData(fetchedAddresses);
        resetForm();
        setIsModalOpen(false);
      } else {
        toast.error(
          `Failed to update address: ${data?.error || data?.message || response.statusText}`,
          { id: toastId }
        );
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(`Failed to update address: ${error.message || "Unknown error"}`, { id: toastId });
    }
  }, [addresses, formData, editId, updateLocalData, resetForm, validateForm]);

  const handleEdit = useCallback((address) => {
    setFormData({
      label: address.label || "Home",
      line1: address.line1 || "",
      line2: address.line2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
    });
    setEditId(address.id);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (idToDelete) => {
      if (!window.confirm("Are you sure you want to delete this address?")) return;
  
      const updatedAddresses = addresses.filter((addr) => addr.id !== idToDelete);
      const toastId = toast.loading("Deleting address...");
  
      try {
        const userProfile = JSON.parse(localStorage.getItem("user")) || {};
        const response = await fetch(
          "https://apis.toyshack.in/Dashboard/customers/customer-update",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: userProfile._id,   // ✅ pass customerId
              address: updatedAddresses,
            }),
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
          toast.success("Address deleted successfully!", { id: toastId });
          const fetchedAddresses = data?.address
            ? data.address.map((addr) => ({
                ...addr,
                id: addr._id,
                isDefault: addr.isDefault || false,
              }))
            : updatedAddresses;
  
          setAddresses(fetchedAddresses);
          updateLocalData(fetchedAddresses);
        } else {
          toast.error(
            `Failed to delete address: ${data?.error || data?.message || response.statusText}`,
            { id: toastId }
          );
          fetchAddresses();
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        toast.error(`Failed to delete address: ${error.message || "Unknown error"}`, { id: toastId });
        fetchAddresses();
      }
    },
    [addresses, fetchAddresses, updateLocalData]
  );

  const handleSetDefault = useCallback(
    async (id) => {
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        id: addr.id || addr._id,
        isDefault: (addr.id || addr._id) === id,
      }));
  
      // get customer id from localStorage
      const customerId = localStorage.getItem("id");
  
      const updatePayload = { 
        id: customerId,   // ✅ required by backend
        address: updatedAddresses 
      };
  
      const toastId = toast.loading("Setting default address...");
  
      try {
        const response = await fetch(
          "https://apis.toyshack.in/Dashboard/customers/customer-update",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload),
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
          toast.success("Default address set successfully!", { id: toastId });
  
          const fetchedAddresses = data?.address
            ? data.address.map((addr) => ({
                ...addr,
                id: addr._id,
                isDefault: addr.isDefault || false,
              }))
            : updatedAddresses;
  
          setAddresses(fetchedAddresses);
  
          // update localStorage
          const storedProfile = localStorage.getItem("user");
          if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile);
            localStorage.setItem(
              "user",
              JSON.stringify({ ...parsedProfile, address: fetchedAddresses })
            );
          }
  
          window.dispatchEvent(new Event("addressUpdated"));
        } else {
          toast.error(
            `Failed to set default address: ${data?.error || response.statusText}`,
            { id: toastId }
          );
        }
      } catch (error) {
        console.error("Error setting default address:", error);
        toast.error(
          `Failed to set default address: ${error.message || "Unknown error"}`,
          { id: toastId }
        );
      }
    },
    [addresses]
  );

  if (isLoading) return <div className="text-center py-8 text-gray-600 text-lg">Loading addresses...</div>;

  return (
    <div className="max-w-5xl px-8 py-8 sm:py-12 bg-gray-50">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 sm:mb-10">My Addresses</h2>

      {addresses.length > 0 ? (
        <div className="space-y-6">
          {[...addresses]
            .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
            .map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl shadow-lg p-6 relative transition-all duration-300 ${
                  addr.isDefault ? "ring-2 ring-blue-600" : "hover:shadow-xl"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-gray-700 space-y-1">
                    <p className="font-semibold text-gray-900">{addr.label} Address</p>
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p>{addr.country}</p>
                  </div>
                  <div className="flex gap-4 text-gray-500 hover:text-gray-900 transition-colors">
                    <button onClick={() => handleEdit(addr)} title="Edit" className="p-2 rounded-full hover:bg-gray-100">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      title="Delete"
                      className="p-2 rounded-full hover:bg-red-100 hover:text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-sm font-medium">
                  {addr.isDefault ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <FaCheckCircle className="text-green-500" /> Default Address
                    </span>
                  ) : (
                    <button onClick={() => handleSetDefault(addr.id)} className="text-[#014aaf] cursor-pointer">
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6 text-center">
          No addresses found. Click "Add New Address" to add one.
        </p>
      )}

      <AddressModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSave={handleSave}
        resetForm={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        editId={editId}
        pincodeMessage={pincodeMessage}
      />
      <button
        onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        className="mt-8 w-full sm:w-auto bg-[#014aaf] text-white px-6 py-2 rounded-lg font-semibold shadow-md cursor-pointer"
      >
        + Add New Address
      </button>
    </div>
  );
};

export default Address;
