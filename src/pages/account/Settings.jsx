import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    showRecentlyViewed: true,
    orderTrackingUpdates: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-[#0d6e82] mb-6">Account Settings</h2>

      <div className="bg-white border rounded-lg p-5 shadow-sm space-y-6">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Dark Mode</p>
            <p className="text-sm text-gray-500">Toggle dark theme for this site.</p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => toggleSetting("darkMode")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#0d6e82] rounded-full peer relative transition-colors">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.darkMode ? "translate-x-5" : ""
                }`}
              />
            </div>
          </label>
        </div>

        {/* Recently Viewed Products */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Show Recently Viewed</p>
            <p className="text-sm text-gray-500">
              Display products you recently viewed on homepage.
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showRecentlyViewed}
              onChange={() => toggleSetting("showRecentlyViewed")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#0d6e82] rounded-full peer relative transition-colors">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.showRecentlyViewed ? "translate-x-5" : ""
                }`}
              />
            </div>
          </label>
        </div>

        {/* Order Tracking Updates */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Order Tracking Updates</p>
            <p className="text-sm text-gray-500">
              Get updates on the status of your orders within your account.
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.orderTrackingUpdates}
              onChange={() => toggleSetting("orderTrackingUpdates")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#0d6e82] rounded-full peer relative transition-colors">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.orderTrackingUpdates ? "translate-x-5" : ""
                }`}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
