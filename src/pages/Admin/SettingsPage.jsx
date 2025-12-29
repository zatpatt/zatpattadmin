// src/pages/Admin/SettingsPage.jsx
import React, { useState } from "react";
import { ToggleLeft, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    deliveryFee: 30,
    serviceCharge: 5, // in %
    surgeMultiplier: 1.5,
    minOrder: 100,
    refundLimit: 5000,
    paymentGatewayKey: "",
    firebaseKey: "",
    maintenanceMode: false,
    appVersion: "1.0.0",
  });

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const saveSettings = () => {
    // You can connect this to API or localStorage
    alert("Settings saved!");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">App Settings</h2>

      <div className="bg-white p-4 rounded-2xl shadow space-y-4">

        {/* Delivery & Fees */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="flex flex-col">
              Delivery Fee
              <input
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => handleChange("deliveryFee", parseFloat(e.target.value))}
                className="border p-2 rounded-lg"
              />
            </label>
            <label className="flex flex-col">
              Service Charge (%)
              <input
                type="number"
                value={settings.serviceCharge}
                onChange={(e) => handleChange("serviceCharge", parseFloat(e.target.value))}
                className="border p-2 rounded-lg"
              />
            </label>
            <label className="flex flex-col">
              Minimum Order
              <input
                type="number"
                value={settings.minOrder}
                onChange={(e) => handleChange("minOrder", parseFloat(e.target.value))}
                className="border p-2 rounded-lg"
              />
            </label>
            <label className="flex flex-col">
              Refund Limit
              <input
                type="number"
                value={settings.refundLimit}
                onChange={(e) => handleChange("refundLimit", parseFloat(e.target.value))}
                className="border p-2 rounded-lg"
              />
            </label>
          </div>
        </div>

        {/* Surge / Peak Pricing */}
        <div className="space-y-2">
          <label className="flex flex-col w-48">
            Surge Multiplier
            <input
              type="number"
              step="0.1"
              value={settings.surgeMultiplier}
              onChange={(e) => handleChange("surgeMultiplier", parseFloat(e.target.value))}
              className="border p-2 rounded-lg"
            />
          </label>
        </div>

        {/* Payment & Firebase Keys
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Keys & Integrations</h3>
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col w-64">
              Payment Gateway Key
              <input
                type="text"
                value={settings.paymentGatewayKey}
                onChange={(e) => handleChange("paymentGatewayKey", e.target.value)}
                className="border p-2 rounded-lg"
              />
            </label>
            <label className="flex flex-col w-64">
              Firebase Key
              <input
                type="text"
                value={settings.firebaseKey}
                onChange={(e) => handleChange("firebaseKey", e.target.value)}
                className="border p-2 rounded-lg"
              />
            </label>
          </div>
        </div> */}

        {/* Maintenance Mode & App Version */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">App Controls</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ToggleLeft
                size={24}
                className={`cursor-pointer ${settings.maintenanceMode ? "text-red-500" : "text-green-500"}`}
                onClick={() => handleChange("maintenanceMode", !settings.maintenanceMode)}
              />
              <span>{settings.maintenanceMode ? "Maintenance Mode ON" : "Maintenance Mode OFF"}</span>
            </div>
            <label className="flex flex-col">
              App Version
              <input
                type="text"
                value={settings.appVersion}
                onChange={(e) => handleChange("appVersion", e.target.value)}
                className="border p-2 rounded-lg"
              />
            </label>
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
}
