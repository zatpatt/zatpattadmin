import React, { useEffect, useState } from "react";
import { Button, Badge } from "flowbite-react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import {
  getDeliveryPartners,
  updateDeliveryPartner,
  addDeliveryPartner,
} from "../../services/deliveryPartnerApi";

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  /* ---------------- SEARCH ---------------- */
  const [search, setSearch] = useState("");

  /* ---------------- ADD FORM ---------------- */
  const [addForm, setAddForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    adhaar_card: null,
    pan_card: null,
    driving_license: null,
    rc_book: null,
  });

  /* ---------------- MODALS ---------------- */
  const [viewDocs, setViewDocs] = useState(null);
  const [editPartner, setEditPartner] = useState(null);

  /* ---------------- FETCH LIST ---------------- */
  useEffect(() => {
    setLoading(true);
    getDeliveryPartners()
      .then((res) => {
        if (res?.status) setPartners(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- ADD DELIVERY PARTNER ---------------- */
  const submitAddPartner = async () => {
    const formData = new FormData();
    Object.entries(addForm).forEach(([k, v]) => v && formData.append(k, v));

    const res = await addDeliveryPartner(formData);
    if (!res?.status) return alert(res?.message || "Failed");

    const refreshed = await getDeliveryPartners();
    if (refreshed?.status) setPartners(refreshed.data || []);

    setAddForm({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      adhaar_card: null,
      pan_card: null,
      driving_license: null,
      rc_book: null,
    });
  };

  /* ---------------- UPDATE ---------------- */
  const saveEdit = async () => {
    const payload = {
      delivery_part_id: editPartner.delivery_part_id,
      first_name: editPartner.first_name,
      last_name: editPartner.last_name,
      phone: editPartner.phone,
      email: editPartner.email,
    };

    const res = await updateDeliveryPartner(payload);
    if (!res?.status) return alert(res?.message || "Update failed");

    setPartners((prev) =>
      prev.map((p) =>
        p.delivery_part_id === editPartner.delivery_part_id
          ? editPartner
          : p
      )
    );

    setEditPartner(null);
  };

  /* ---------------- TOGGLES ---------------- */
  const toggleActive = async (p) => {
    await updateDeliveryPartner({
      delivery_part_id: p.delivery_part_id,
      is_active: !p.is_active,
    });

    setPartners((prev) =>
      prev.map((x) =>
        x.delivery_part_id === p.delivery_part_id
          ? { ...x, is_active: !x.is_active }
          : x
      )
    );
  };

  const toggleVerified = async (p) => {
    await updateDeliveryPartner({
      delivery_part_id: p.delivery_part_id,
      is_verified: !p.is_verified,
    });

    setPartners((prev) =>
      prev.map((x) =>
        x.delivery_part_id === p.delivery_part_id
          ? { ...x, is_verified: !x.is_verified }
          : x
      )
    );
  };

  /* ---------------- DELETE (UI ONLY FOR NOW) ---------------- */
  const deletePartner = (id) => {
    if (!window.confirm("Delete delivery partner?")) return;

    // 🔴 Backend delete API can be added here later
    setPartners((prev) => prev.filter((p) => p.delivery_part_id !== id));
  };

  /* ---------------- FILTER ---------------- */
  const filtered = partners.filter((p) =>
    `${p.first_name} ${p.last_name} ${p.phone} ${p.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone); // Indian mobile validation
};

const isAddFormValid =
  addForm.first_name.trim() &&
  addForm.last_name.trim() &&
  addForm.email.trim() &&
  isValidPhone(addForm.phone);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold">Delivery Partners</h1>

  <Button
    size="sm"
    color="warning"
    onClick={() => setAddModalOpen(true)}
    className="
            flex items-center gap-2
            bg-orange-500 text-white font-semibold
            px-5 py-2 rounded-xl
            shadow-md hover:shadow-lg
            transition
          "
  >
    <Plus size={16} />
    Add Delivery Partner
  </Button>
</div>

     {/* ================= SEARCH ================= */}
      <input
        placeholder="Search by name, phone, email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full max-w-md"
      />

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border border-gray-600">
          <thead className="bg-orange-500 text-white">
            <tr>
              {[
                "Name",
                "Email",
                "Phone",
                "Documents",
                "Verified",
                "Active",
                "Actions",
              ].map((h) => (
                <th key={h} className="border px-3 py-2 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.delivery_part_id}>
                <td className="border px-3 py-2">
                  {p.first_name} {p.last_name}
                </td>
                <td className="border px-3 py-2">{p.email}</td>
                <td className="border px-3 py-2">{p.phone}</td>

            <td className="border px-3 py-2 text-xs space-y-1">
              {[
                ["adhaar_card", "Aadhaar"],
                ["pan_card", "PAN"],
                ["driving_license", "Driving License"],
                ["rc_book", "RC Book"],
              ].map(([key, label]) => {
                const hasDoc = Boolean(p[key]);

                return (
                  <div key={key}>
                    {hasDoc ? (
                      <button
                        type="button"
                        onClick={() => setViewDocs({ [key]: p[key] })}
                        className="w-full text-left"
                      >
                        <Badge
                          color="success"
                          className="cursor-pointer hover:opacity-80"
                        >
                          {label} ✓
                        </Badge>
                      </button>
                    ) : (
                      <Badge color="failure">
                        {label} ✗
                      </Badge>
                    )}
                  </div>
                );
              })}
            </td>

                <td className="border px-3 py-2 text-center">
                  <Button
                    size="xs"
                    color={p.is_verified ? "success" : "failure"}
                    onClick={() => toggleVerified(p)}
                  >
                    {p.is_verified ? "Verified" : "Unverified"}
                  </Button>
                </td>

                <td className="border px-3 py-2 text-center">
                  <Button
                    size="xs"
                    color={p.is_active ? "success" : "failure"}
                    onClick={() => toggleActive(p)}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </Button>
                </td>

                <td className="border px-3 py-2 flex justify-center gap-2">
                  <Button size="xs" onClick={() => setViewDocs(p)}>
                    <Eye size={14} />
                  </Button>
                  <Button size="xs" color="warning" onClick={() => setEditPartner(p)}>
                    <Edit size={14} />
                  </Button>
                  <Button size="xs" color="failure" onClick={() => deletePartner(p.delivery_part_id)}>
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= VIEW DOCS MODAL ================= */}
      {viewDocs && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-xl w-full max-w-lg">
            <h3 className="font-semibold mb-3">Documents</h3>
            {["adhaar_card", "pan_card", "driving_license", "rc_book"].map(
              (k) =>
                viewDocs[k] && (
                  <a
                    key={k}
                    href={viewDocs[k]}
                    target="_blank"
                    className="block text-blue-600 underline"
                  >
                    View {k.replace("_", " ")}
                  </a>
                )
            )}
            <Button className="mt-4" onClick={() => setViewDocs(null)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editPartner && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-xl w-full max-w-md space-y-3">
            <h3 className="font-semibold">Edit Partner</h3>

            {["first_name", "last_name", "phone", "email"].map((f) => (
              <input
                key={f}
                value={editPartner[f]}
                onChange={(e) =>
                  setEditPartner({ ...editPartner, [f]: e.target.value })
                }
                className="border px-3 py-2 rounded w-full"
              />
            ))}

            <div className="flex justify-end gap-3">
              <Button color="gray" onClick={() => setEditPartner(null)}>
                Cancel
              </Button>
              <Button color="warning" onClick={saveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD PARTNER MODAL ================= */}
{addModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Plus size={18} className="text-orange-500" />
        Add Delivery Partner
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {["first_name", "last_name", "phone", "email"].map((f) => (
         <div key={f} className="space-y-1">
        <input
          placeholder={f.replace("_", " ").toUpperCase()}
          value={addForm[f]}
          onChange={(e) =>
            setAddForm({ ...addForm, [f]: e.target.value })
          }
          className={`border rounded-lg px-3 py-2 w-full
            ${f === "phone" && addForm.phone && !isValidPhone(addForm.phone)
              ? "border-red-500"
              : "focus:ring-2 focus:ring-orange-400"}
          `}
        />

        {f === "phone" && addForm.phone && !isValidPhone(addForm.phone) && (
          <p className="text-xs text-red-600">
            Enter valid 10-digit mobile number
          </p>
        )}
      </div>
      ))}

        {[
          ["adhaar_card", "Aadhaar"],
          ["pan_card", "PAN"],
          ["driving_license", "Driving License"],
          ["rc_book", "RC Book"],
        ].map(([k, label]) => (
          <div key={k}>
            <label className="text-xs text-gray-500">{label}</label>
            <input
              type="file"
              onChange={(e) =>
                setAddForm({ ...addForm, [k]: e.target.files[0] })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4">
     <button
  onClick={() => {
    setAddModalOpen(false);
    setAddForm({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      adhaar_card: null,
      pan_card: null,
      driving_license: null,
      rc_book: null,
    });
  }}
  className="
    px-5 py-2 rounded-xl
    border border-gray-400
    text-gray-700 font-medium
    bg-white
    hover:bg-gray-100
    transition
  "
>
  Cancel
</button>

        {/* 🔥 PREMIUM SAVE BUTTON */}
        <button
        disabled={!isAddFormValid}
        onClick={async () => {
          await submitAddPartner();
          setAddModalOpen(false);
        }}
        className={`
          flex items-center gap-2
          px-5 py-2 rounded-xl font-semibold
          transition
          ${
            isAddFormValid
              ? "bg-orange-500 text-white shadow-md hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
      >
          <Plus size={16} />
          Save Partner
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
