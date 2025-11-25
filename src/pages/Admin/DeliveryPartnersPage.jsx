// src/pages/Admin/DeliveryPartnersPage.jsx
import React, { useState } from "react";
import { Avatar, Button, Badge, Table } from "flowbite-react";
import { Edit, Trash2, Eye } from "lucide-react";

const mockDeliveryPartners = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg",
    aadhaarUploaded: true,
    panUploaded: false,
    rcBookUploaded: true,
    dlUploaded: true,
    bankVerified: true,
    active: true,
  },
  {
    id: 2,
    name: "Sneha Kapoor",
    email: "sneha@example.com",
    phone: "9123456780",
    profilePhoto: "https://randomuser.me/api/portraits/women/2.jpg",
    aadhaarUploaded: false,
    panUploaded: false,
    rcBookUploaded: false,
    dlUploaded: true,
    bankVerified: false,
    active: false,
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit@example.com",
    phone: "9988776655",
    profilePhoto: "https://randomuser.me/api/portraits/men/3.jpg",
    aadhaarUploaded: true,
    panUploaded: true,
    rcBookUploaded: true,
    dlUploaded: true,
    bankVerified: true,
    active: true,
  },
];

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState(mockDeliveryPartners);

  const toggleActive = (id) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      )
    );
  };

  const deletePartner = (id) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      setPartners((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Delivery Partners</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Profile</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">KYC Status</th>
              <th className="py-3 px-4 text-left">Bank Verified</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Avatar img={partner.profilePhoto} rounded={true} />
                </td>
                <td className="py-3 px-4">{partner.name}</td>
                <td className="py-3 px-4">{partner.email}</td>
                <td className="py-3 px-4">{partner.phone}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    <Badge color={partner.aadhaarUploaded ? "success" : "failure"}>
                      Aadhaar {partner.aadhaarUploaded ? "✓" : "✗"}
                    </Badge>
                    <Badge color={partner.panUploaded ? "success" : "failure"}>
                      PAN {partner.panUploaded ? "✓" : "✗"}
                    </Badge>
                    <Badge color={partner.rcBookUploaded ? "success" : "failure"}>
                      RC Book {partner.rcBookUploaded ? "✓" : "✗"}
                    </Badge>
                    <Badge color={partner.dlUploaded ? "success" : "failure"}>
                      DL {partner.dlUploaded ? "✓" : "✗"}
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge color={partner.bankVerified ? "success" : "failure"}>
                    {partner.bankVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Button
                    size="xs"
                    color={partner.active ? "success" : "failure"}
                    onClick={() => toggleActive(partner.id)}
                  >
                    {partner.active ? "Active" : "Inactive"}
                  </Button>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <Button size="xs" color="gray" onClick={() => alert("View clicked")}>
                    <Eye size={16} />
                  </Button>
                  <Button size="xs" color="warning" onClick={() => alert("Edit clicked")}>
                    <Edit size={16} />
                  </Button>
                  <Button size="xs" color="failure" onClick={() => deletePartner(partner.id)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No delivery partners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
