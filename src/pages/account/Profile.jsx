import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

const Profile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    profilePicture:
      "https://placehold.co/150x150/aabbcc/ffffff?text=Loading...",
    createdAt: "",
    pinCode: "",
    address: [],
  });

  const [formData, setFormData] = useState({ ...user });
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const profilePictureURL = parsedUser.profilePicture
          ? parsedUser.profilePicture
          : "https://placehold.co/150x150/aabbcc/ffffff?text=No+Image";

        const formattedUser = {
          firstName: parsedUser.firstName || "",
          lastName: parsedUser.lastName || "",
          email: parsedUser.email || "",
          mobileNumber: parsedUser.mobileNumber || "",
          profilePicture: profilePictureURL,
          createdAt: parsedUser.createdAt || "",
          pinCode: parsedUser.pinCode || "",
          address: parsedUser.address || [],
        };

        setUser(formattedUser);
        setFormData(formattedUser);
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
    setIsLoading(false);
  }, []);

  // Handle input changes immediately
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUser((prev) => ({ ...prev, [name]: value }));
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, [name]: value })
    );
  };

  // Handle avatar change with immediate preview and persist in localStorage
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result; // Base64 string
      setFormData((prev) => ({ ...prev, profilePicture: base64Image }));
      setUser((prev) => ({ ...prev, profilePicture: base64Image }));

      // Persist Base64 in localStorage for refresh
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, profilePicture: base64Image })
      );
    };
    reader.readAsDataURL(file);
  };

// ✅ Save changes to backend
const handleSave = useCallback(async () => {
  const API_URL = "https://apis.toyshack.in/Dashboard/customers/customer-update";
  const customerId = localStorage.getItem("id");

  if (!customerId) {
    toast.error("Customer ID not found.");
    return;
  }

  const updateFormData = new FormData();
  updateFormData.append("id", customerId);
  updateFormData.append("firstName", formData.firstName);
  updateFormData.append("lastName", formData.lastName);
  updateFormData.append("email", formData.email);
  updateFormData.append("mobileNumber", formData.mobileNumber);

  if (formData.pinCode) updateFormData.append("pinCode", formData.pinCode);
  if (formData.address.length)
    updateFormData.append("address", JSON.stringify(formData.address));
  if (avatarFile) updateFormData.append("profilePicture", avatarFile);

  const toastId = toast.loading("Saving profile...");

  try {
    const response = await axios.put(API_URL, updateFormData);

    if (response.status === 200) {
      // ✅ Get the full updated customer object from backend
      const updatedUser = response.data.updates;

      // ✅ Fix image path
      const updatedProfilePic = updatedUser.profilePicture
        ? `https://apis.toyshack.in/storage/userdp/${updatedUser.profilePicture}`
        : user.profilePicture;

      // ✅ Keep all fields (including _id, createdAt, token, etc.)
      const previousData = JSON.parse(localStorage.getItem("user")) || {};
      const finalUser = {
        ...previousData,
        ...updatedUser,
        profilePicture: updatedProfilePic,
      };

      // ✅ Store updated user info safely
      localStorage.setItem("user", JSON.stringify(finalUser));
      localStorage.setItem("id", updatedUser._id); // ensure ID persists

      setUser(finalUser);
      setFormData(finalUser);
      setAvatarFile(null);
      setEditMode(false);

      toast.success("Profile updated successfully!", { id: toastId });
    } else {
      toast.error("Failed to update profile.", { id: toastId });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    toast.error("Error updating profile.", { id: toastId });
  }
}, [formData, avatarFile, user]);

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
    setAvatarFile(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center text-gray-600 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-50">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-12">
        My Profile
      </h1>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* Left Panel */}
        <div className="p-8 flex flex-col justify-center items-center text-center md:border-r md:border-gray-200">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            <img
              src={user.profilePicture}
              alt="Avatar"
              className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/150x150/aabbcc/ffffff?text=No+Image";
              }}
            />
            {editMode && (
              <label className="absolute bottom-0 right-8 bg-[#014aaf] text-white text-xs px-2 py-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <h2 className="text-xl font-semibold mt-4 text-gray-800 tracking-tight">
            {`${user.firstName} ${user.lastName}`.trim()}
          </h2>
          <p className="text-md text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            Joined{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              : "N/A"}
          </p>
        </div>

        {/* Right Panel */}
        <div className="col-span-2 p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
              Account Details
            </h3>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>

          {editMode ? (
            <div className="space-y-6">
              {[
                { name: "firstName", label: "First Name" },
                { name: "lastName", label: "Last Name" },
                { name: "email", label: "Email" },
                { name: "mobileNumber", label: "Phone Number" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {label}
                  </label>
                  <input
                    type={name === "email" ? "email" : "text"}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014aaf] transition-colors"
                  />
                </div>
              ))}

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="bg-[#014aaf] text-white px-6 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="cursor-pointer border border-[#014aaf] text-[#014aaf] bg-white px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {[
                {
                  label: "Full Name",
                  value: `${user.firstName} ${user.lastName}`.trim(),
                },
                { label: "Email Address", value: user.email },
                { label: "Phone Number", value: user.mobileNumber },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <p className="text-sm text-gray-500 mb-1">{label}</p>
                  <p className="text-base font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
