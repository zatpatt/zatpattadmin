import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  ShieldAlert,
  Clock
} from "lucide-react";
import {
  listMenuBook,
  detailMenuBook,
  editMenuBook,
} from "../../services/menuModerationApi";


/* ---------------- CONFIG ---------------- */
const SLA_HOURS = 24;
const ILLEGAL_KEYWORDS = [
  "alcohol",
  "beer",
  "wine",
  "whiskey",
  "cigarette",
  "tobacco",
  "weed",
  "drugs",
];

/* ================= COMPONENT ================= */
export default function MenuModerationPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
const [menuSearch, setMenuSearch] = useState("");

  /* ---------------- HELPERS ---------------- */
  const isIllegal = (name) =>
    ILLEGAL_KEYWORDS.some((k) =>
      name.toLowerCase().includes(k)
    );

  /* ============= Fetch restaurant + menu list (LEVEL-1) ============ */
  useEffect(() => {
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await listMenuBook();
      if (res?.status) {
        // group by merchant
        const grouped = {};
        res.data.forEach((item) => {
          if (!grouped[item.merchant_id]) {
            grouped[item.merchant_id] = {
              id: item.merchant_id,
              name: item.merchant_name,
              menu: [],
            };
          }

          grouped[item.merchant_id].menu.push(item);
        });

        setRestaurants(Object.values(grouped));
      }
    } finally {
      setLoading(false);
    }
  };

  fetchMenus();
}, []);
  
 
  /* ---------------- FILTER RESTAURANTS ---------------- */
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) =>
      `${r.name} ${r.city}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [restaurants, search]);


 const toggleAllowed = async (item) => {
  const newValue = !item.is_available;

  setLoading(true);
  const res = await editMenuBook({
    menu_book_id: item.menu_book_id,
    is_available: newValue,
  });
  setLoading(false);

  if (!res?.status) return;

  // ✅ Update UI instantly
  setSelected((prev) => ({
    ...prev,
    menu: prev.menu.map((m) =>
      m.menu_book_id === item.menu_book_id
        ? { ...m, is_available: newValue }
        : m
    ),
  }));
};
 
 const filteredMenu = useMemo(() => {
  if (!selected) return [];

  let list = [...selected.menu];

  // 🔍 SEARCH
  if (menuSearch.trim()) {
    const q = menuSearch.toLowerCase();
    list = list.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category_name.toLowerCase().includes(q)
    );
  }

  return list;
}, [selected, menuSearch]);

  /* ================= LEVEL 1 — RESTAURANTS ================= */
  if (!selected) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          🍴 Menu Moderation
        </h2>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurant or city..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {filteredRestaurants.map((r) => (
          <div
            key={r.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >
            <div>
              <div className="font-semibold text-lg">
                {r.name}
              </div>
              <div className="text-sm text-gray-500">
                {r.city}
              </div>
            </div>

            <button
              onClick={async () => {
              setLoading(true);
              const res = await detailMenuBook({
                merchant_id: r.id,
              });

              if (res?.status) {
                setSelected({
                  ...r,
                  menu: res.data,
                });
              }
              setLoading(false);
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Review Menu
            </button>
          </div>
        ))}
      </div>
    );
  }

  /* ================= LEVEL 2 — MENU REVIEW ================= */
return (
  <div className="max-w-7xl mx-auto p-6 space-y-4">
    <button
      onClick={() => setSelected(null)}
      className="flex items-center gap-2 text-sm text-blue-600"
    >
      <ArrowLeft size={16} /> Back
    </button>

    <h2 className="text-xl font-semibold">
      {selected.name} — Menu Review
    </h2>

{/* 🔍 SEARCH & SORT BAR */}
<div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
  {/* Search */}
  <div className="relative w-full md:max-w-sm">
    <Search
      size={16}
      className="absolute left-3 top-3 text-gray-400"
    />
    <input
      value={menuSearch}
      onChange={(e) => setMenuSearch(e.target.value)}
      placeholder="Search menu item or category..."
      className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
    />
  </div>
 </div>

    {/* ===== BACKEND MENU LIST (FLAT STRUCTURE) ===== */}
    <div className="bg-white p-4 rounded-xl shadow">
   {filteredMenu.map((item, idx) => {
      const illegal = isIllegal(item.label);

        return (
          <div
  key={idx}
  className={`border rounded-lg p-4 mb-3 flex justify-between items-start
    ${item.is_available ? "bg-white" : "bg-gray-50 opacity-70"}
  `}
>
  {/* LEFT SIDE */}
  <div className="space-y-1">
    <div className="font-medium text-gray-800">
      {item.label}
    </div>

    <div className="text-sm text-gray-500">
      ₹{item.menu_price} • {item.category_name}
    </div>

    <div className="flex gap-2 text-xs mt-1">
      {illegal && (
        <span className="text-orange-600 flex items-center gap-1">
          <ShieldAlert size={12} /> Restricted
        </span>
      )}

      {!item.is_available && (
        <span className="text-gray-500">
          Not Allowed
        </span>
      )}

      {item.is_available && (
        <span className="text-orange-600">
          Allowed
        </span>
      )}
    </div>
  </div>

  {/* RIGHT SIDE – TOGGLE */}
  <button
    onClick={() => toggleAllowed(item)}
    className={`relative inline-flex h-5 w-11 items-center rounded-full transition
      ${item.is_available ? "bg-orange-500" : "bg-gray-300"}
    `}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition
        ${item.is_available ? "translate-x-6" : "translate-x-1"}
      `}
    />
  </button>
</div>
      );
      })}
    </div>
  </div>
);
}
