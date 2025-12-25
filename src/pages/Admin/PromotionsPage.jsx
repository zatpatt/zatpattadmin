// src/pages/Admin/PromotionsPage.jsx
import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import { addOffer, getOffers, editOffer} from "../../services/promotionsApi";

export default function PromotionsPage() {
const [promos, setPromos] = useState([]);
const [loadingPromos, setLoadingPromos] = useState(false);

const [search, setSearch] = useState(""); // ✅ ADD HERE

const ITEMS_PER_PAGE = 5;
const [page, setPage] = useState(1);

const [editModalOpen, setEditModalOpen] = useState(false);
const [editingPromo, setEditingPromo] = useState(null);
const [newEndDate, setNewEndDate] = useState("");
const [editForm, setEditForm] = useState({
  id: null,
  promo_type: "discount",
  min_order_amount: "",
  start_date: "",
  end_date: "",
  region: "",
  usage_limit: "",
  budget: "",
});

const [editError, setEditError] = useState("");

const isValidEditDate = (start, end) => {
  if (!end) return false;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (endDate < startDate) return false;
  if (endDate < today) return false;

  return true;
};

const isExpired = (promo) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(promo.validity.end) < today;
};

const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [promoToDelete, setPromoToDelete] = useState(null);

const [newPromo, setNewPromo] = useState({
  promo_type: "discount",
  min_order_amount: "",
  start_date: "",
  end_date: "",
  budget: "",
  usage_limit: "",
});

const addPromo = async () => {
  if (
    !newPromo.min_order_amount ||
    !newPromo.start_date ||
    !newPromo.end_date ||
    !newPromo.budget ||
    !newPromo.usage_limit
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await addOffer({
      promo_type: newPromo.promo_type,
      min_order_amount: Number(newPromo.min_order_amount),
      start_date: newPromo.start_date,
      end_date: newPromo.end_date,
      budget: Number(newPromo.budget),
      usage_limit: Number(newPromo.usage_limit),
    });

    // 🔴 VERY IMPORTANT CHECK
    if (!res?.status) {
      alert(res?.message || "Offer not created (backend restriction)");
      return;
    }

    const data = await getOffers();

    setPromos(
      data.map((o) => ({
        id: o.promotion_id,
        code: o.code,
        type: o.promo_type,
        minOrder: o.min_order_amount,
        validity: {
          start: o.start_date.split("T")[0],
          end: o.end_date.split("T")[0],
        },
        region: o.region,
        usage: o.usage_limit,
        budget: o.budget,
        active: true,
      }))
    );

    setNewPromo({
      promo_type: "discount",
      min_order_amount: "",
      start_date: "",
      end_date: "",
      budget: "",
      usage_limit: "",
    });

  } catch (err) {
    console.error(err);
    alert("Failed to add promotion");
  }
};
 
 useEffect(() => {
  setLoadingPromos(true);

  getOffers()
    .then((data) => {
      const formatted = data.map((o) => ({
        id: o.promotion_id,
        code: o.code,
        type: o.promo_type,
        minOrder: o.min_order_amount,
        validity: {
          start: o.start_date.split("T")[0],
          end: o.end_date.split("T")[0],
        },
        region: o.region,
        usage: o.usage_limit,
        budget: o.budget,
        active: true,
      }));

      setPromos(formatted);
    })
    .finally(() => setLoadingPromos(false));
}, []);

const filteredPromos = promos.filter(p =>
  `${p.code} ${p.type} ${p.region}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

const totalPages = Math.ceil(filteredPromos.length / ITEMS_PER_PAGE);

const paginatedPromos = filteredPromos.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Promotions & Marketing</h2>

      {/* Add Promo */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Plus size={18} /> Create New Promotion
        </h3>

        <div className="flex flex-wrap gap-3">
          <input
          type="number"
          placeholder="Min Order Amount"
          value={newPromo.min_order_amount}
          onChange={(e) =>
            setNewPromo({ ...newPromo, min_order_amount: e.target.value })
          }
          className="border p-2 rounded-lg"
        />

        <select
          value={newPromo.promo_type}
          onChange={(e) =>
            setNewPromo({ ...newPromo, promo_type: e.target.value })
          }
          className="border p-2 rounded-lg"
        >
          <option value="discount">Discount</option>
          <option value="cashback">Cashback</option>
          <option value="free_delivery">Free Delivery</option>
        </select>

        <input
          type="date"
          value={newPromo.start_date}
          onChange={(e) =>
            setNewPromo({ ...newPromo, start_date: e.target.value })
          }
          className="border p-2 rounded-lg"
        />

        <input
          type="date"
          value={newPromo.end_date}
          onChange={(e) =>
            setNewPromo({ ...newPromo, end_date: e.target.value })
          }
          className="border p-2 rounded-lg"
        />

        <input
          type="number"
          placeholder="Usage Limit"
          value={newPromo.usage_limit}
          onChange={(e) =>
            setNewPromo({ ...newPromo, usage_limit: e.target.value })
          }
          className="border p-2 rounded-lg"
        />

        <input
          type="number"
          placeholder="Budget"
          value={newPromo.budget}
          onChange={(e) =>
            setNewPromo({ ...newPromo, budget: e.target.value })
          }
          className="border p-2 rounded-lg"
        />
                  <button
            onClick={addPromo}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl"
          >
            Add Promo
          </button>
        </div>
      </div>

      {/* Promo List */}
      <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3">Active Promotions</h3>

          <input
            type="text"
            placeholder="Search by code, type, region..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset page on search
            }}
            className="border px-3 py-2 rounded-lg w-full max-w-sm mb-3"
          />

          <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">Code</th>
                <th className="px-3 py-2 border">Type</th>
                <th className="px-3 py-2 border">Min Order</th>
                <th className="px-3 py-2 border">Validity</th>
                <th className="px-3 py-2 border">Region</th>
                <th className="px-3 py-2 border">Usage</th>
                <th className="px-3 py-2 border">Budget</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
             {paginatedPromos.map((p) => (
                <tr key={p.id}>
                 <td className="px-3 py-2 border">
                  {p.code}
                  {isExpired(p) && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                      Expired
                    </span>
                  )}
                </td>
                 <td className="px-3 py-2 border">{p.type}</td>
                  <td className="px-3 py-2 border">₹{p.minOrder}</td>
                  <td className="px-3 py-2 border">
                    {p.validity?.start} to {p.validity?.end}
                  </td>
                  <td className="px-3 py-2 border">{p.region}</td>
                  <td className="px-3 py-2 border">{p.usage}</td>
                  <td className="px-3 py-2 border">₹{p.budget}</td>
                  <td className="px-3 py-2 border flex gap-2">
                   <button
                    disabled={isExpired(p)}
                    className={`p-1 rounded ${
                      isExpired(p)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-100 text-blue-700"
                    }`}
                    onClick={() => {
                      if (isExpired(p)) return;
                      setEditForm({
                    id: p.id,
                    promo_type: p.type,
                    min_order_amount: p.minOrder,
                    start_date: p.validity.start,
                    end_date: p.validity.end,
                    region: p.region,
                    usage_limit: p.usage,
                    budget: p.budget,
                  });
                    setEditError("");
                      setEditModalOpen(true);
                    }}
                  >
                  <Edit size={14} />
                  </button>
                  <button
                  disabled={isExpired(p)}
                  className={`p-1 rounded ${
                    isExpired(p)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-100 text-red-700"
                  }`}
                  onClick={() => {
                    if (isExpired(p)) return;
                    setPromoToDelete(p);
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash2 size={14} />
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-2 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        </div>
      </div>

{editModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-5 w-full max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Edit Promotion</h3>

      {/* Promo Type */}
      <select
        value={editForm.promo_type}
        onChange={(e) =>
          setEditForm({ ...editForm, promo_type: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      >
        <option value="discount">Discount</option>
        <option value="cashback">Cashback</option>
        <option value="free_delivery">Free Delivery</option>
      </select>

      {/* Min Order */}
      <input
        type="number"
        placeholder="Min Order Amount"
        value={editForm.min_order_amount}
        onChange={(e) =>
          setEditForm({ ...editForm, min_order_amount: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Start Date */}
      <input
        type="date"
        value={editForm.start_date}
        disabled={new Date(editForm.start_date) <= new Date()}
        onChange={(e) =>
          setEditForm({ ...editForm, start_date: e.target.value })
        }
        className={`w-full border rounded-lg px-3 py-2 ${
          new Date(editForm.start_date) <= new Date()
            ? "bg-gray-100 cursor-not-allowed"
            : ""
        }`}
      />

      {/* End Date */}
      <input
        type="date"
        value={editForm.end_date}
        onChange={(e) =>
          setEditForm({ ...editForm, end_date: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Region */}
      <input
        placeholder="Region (e.g. All, Vasind, Mumbai)"
        value={editForm.region}
        onChange={(e) =>
          setEditForm({ ...editForm, region: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Usage Limit */}
      <input
        type="number"
        placeholder="Usage Limit"
        value={editForm.usage_limit}
        onChange={(e) =>
          setEditForm({ ...editForm, usage_limit: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Budget */}
      <input
        type="number"
        placeholder="Budget"
        value={editForm.budget}
        onChange={(e) =>
          setEditForm({ ...editForm, budget: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-3">
        <button
          onClick={() => {
            setEditError("");
            setEditModalOpen(false);
          }}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            const promo = promos.find(p => p.id === editForm.id);

            if (
            !editForm.start_date ||
            !editForm.end_date ||
            new Date(editForm.end_date) < new Date(editForm.start_date)
          ) {
            setEditError("End date cannot be before start date");
            return;
          }

            const res = await editOffer({
              promotion_id: editForm.id,
              promo_type: editForm.promo_type,
              min_order_amount: Number(editForm.min_order_amount),
              start_date: editForm.start_date,
              end_date: editForm.end_date,
              region: editForm.region,
              usage_limit: Number(editForm.usage_limit),
              budget: Number(editForm.budget),
            });

            if (!res?.status) {
              setEditError(res?.message || "Update failed");
              return;
            }

            setPromos(prev =>
              prev.map(p =>
                p.id === editForm.id
                  ? {
                      ...p,
                      type: editForm.promo_type,
                      minOrder: editForm.min_order_amount,
                      region: editForm.region,
                      usage: editForm.usage_limit,
                      budget: editForm.budget,
                      validity: {
                        ...p.validity,
                        end: editForm.end_date,
                      },
                    }
                  : p
              )
            );

            setEditModalOpen(false);
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
          Save Changes
        </button>
      </div>

      {editError && (
        <p className="text-sm text-red-600">{editError}</p>
      )}
    </div>
  </div>
)}

{deleteModalOpen && promoToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-5 w-full max-w-sm space-y-4">
      <h3 className="text-lg font-semibold text-red-600">
        Deactivate Promotion
      </h3>

      <p className="text-sm text-gray-600">
        This will deactivate the promotion
        <strong> {promoToDelete.code}</strong>.
        <br />
        Customers will no longer be able to use it.
      </p>

      <div className="flex justify-end gap-3 pt-3">
        <button
          onClick={() => {
            setDeleteModalOpen(false);
            setPromoToDelete(null);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
           const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];

            const res = await editOffer({
              promotion_id: promoToDelete.id,
              end_date: yesterday,
            });

            if (!res?.status) {
              // optional inline error handling later
              return;
            }

            setPromos((prev) =>
              prev.map((x) =>
                x.id === promoToDelete.id
                  ? {
                      ...x,
                      validity: { ...x.validity, end: yesterday },
                    }
                  : x
              )
            );

            setDeleteModalOpen(false);
            setPromoToDelete(null);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Deactivate
        </button>
      </div>
    </div>
  </div>
)}
  </div>
  );
}
