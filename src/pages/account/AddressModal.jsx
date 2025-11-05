import React, { useEffect } from "react";

const AddressModal = ({
  open,
  onClose,
  formData,
  handleChange,
  handleSave,
  resetForm,
  editId,
  pincodeMessage,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-full sm:max-w-xl lg:max-w-3xl p-4 sm:p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
    
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
            {editId ? "Edit Address" : "Add New Address"}
          </h3>
    
          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[#014aaf] focus:border-[#014aaf] transition-colors"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
    
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                name="line1"
                value={formData.line1}
                onChange={handleChange}
                placeholder="Building Name, House No."
                className="border border-gray-300 rounded-lg w-full px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[#014aaf] focus:border-[#014aaf] transition-colors"
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                name="line2"
                value={formData.line2}
                onChange={handleChange}
                placeholder="Street Name / Area"
                className="border border-gray-300 rounded-lg w-full px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[#014aaf] focus:border-[#014aaf] transition-colors"
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="border border-gray-300 rounded-lg w-full px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[#014aaf] focus:border-[#014aaf] transition-colors"
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="border border-gray-300 rounded-lg w-full px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[#014aaf] focus:border-[#014aaf] transition-colors"
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                maxLength="6"
                className="border border-gray-300 rounded-lg w-full px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[#014aaf] focus:border-[#014aaf] transition-colors"
              />
              {pincodeMessage.text && (
                <p
                  className={`mt-1 text-sm ${
                    pincodeMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {pincodeMessage.text}
                </p>
              )}
            </div>
    
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="border border-gray-300 rounded-lg w-full px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[#014aaf] focus:border-[#014aaf] transition-colors"
              />
            </div>
          </div>
    
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-[#014aaf] text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-colors cursor-pointer w-full sm:w-auto text-center"
            >
              {editId ? "Update Address" : "Save Address"}
            </button>
            <button
              onClick={resetForm}
              className="border-2 border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer w-full sm:w-auto text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
    
};

export default AddressModal;
