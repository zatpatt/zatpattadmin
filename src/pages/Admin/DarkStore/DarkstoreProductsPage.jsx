//src\pages\Admin\DarkStore\DarkstoreProductsPage.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Search,
  UserCircle,
  Upload,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

/* ================= GLOBAL CATEGORIES ================= */
const CATEGORIES = [
  "Fruits & Vegetables",
  "Bread & Bakery",
  "Atta, Rice, Oils & Dals",
  "Masala & Dry Fruits",
  "Breakfast, Sauces & Cereals",
  "Packaged Food",
  "Tea, Coffee & More",
  "Munchies",
  "Sweet Cravings",
  "Biscuits & Cookie",
  "Cold Drink & Juices",
  "Ice Creams & More",
  "Frozen Food",
  "Meat, Fish & Eggs",
  "Medicines & First Aid",
  "Sanitary Pads & Diapers",
  "Baby Cares",
  "Dog Food",
  "Cat Food",
  "Pet Accessories",
  "Balloons & Party Decoration",
  "Disposable Plates & Cups",
  "Celebration Cakes",
];

export default function DarkstoreProductsPage() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const profileRef = useRef(null);


  /* ================= STATE ================= */
 const [storeProducts, setStoreProducts] = useState({});

  const [storeInfo, setStoreInfo] = useState(null);
  const [showEditStore, setShowEditStore] = useState(false);
  const [storeForm, setStoreForm] = useState({});

  /* ================= STORE FORM ERRORS ================= */
  const [storeErrors, setStoreErrors] = useState({});

  /* ================= STORE FORM VALIDATION ================= */
  const isStoreFormValid = useMemo(() => {
    return Object.keys(storeErrors).length === 0;
  }, [storeErrors]);

/* ================= STORE (DERIVED) ================= */
  const storeCode = storeInfo?.store_code || "";
  const storeName = storeInfo?.store_name || "";

  const [auditLogs, setAuditLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add");

  const [priceError, setPriceError] = useState("");

  /* ================= STAFF ================= */
  const [storeStaff, setStoreStaff] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [showEditStaff, setShowEditStaff] = useState(false);
  const [storeActive, setStoreActive] = useState(true);
  const [editingStaff, setEditingStaff] = useState(null);
  const staff = storeStaff[storeId] || [];

 /* ==================== CSV EXPORT & IMPORT ================= */

  const importCSV = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const rows = e.target.result.split("\n").slice(1);

    const imported = rows
      .map((r) => {
        const [name, category, mrp, price, stock, description, status] =
          r.split(",");

  const finalStatus =
  Number(stock) === 0 ? "draft" : status || "draft";

return {
  id: Date.now() + Math.random(),
  name,
  category,
  mrp: Number(mrp),
  price: Number(price),
  stock: Number(stock),
  description,
  status: finalStatus,
  active: finalStatus === "live",
};
    })
      .filter(Boolean);

    setStoreProducts((prev) => ({
      ...prev,
      [storeId]: [...(prev[storeId] || []), ...imported],
    }));
  };
  reader.readAsText(file);
};

const exportCSV = () => {
  const headers =
    "name,category,mrp,price,stock,description,status\n";
  const rows = (storeProducts[storeId] || [])
    .map(
      (p) =>
        `${p.name},${p.category},${p.mrp},${p.price},${p.stock},${p.description},${p.status}`
    )
    .join("\n");

  const blob = new Blob([headers + rows], {
    type: "text/csv",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `store_${storeId}_products.csv`;
  a.click();
};

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

  const getTodayName = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });

// ⚠️ TECH DEBT
// Same logic exists in DarkstoreListPage (isStoreOpenNow)
// Later centralize into utils/storeTiming.js
  const isWithinStoreTiming = (timings = []) => {
  const today = getTodayName();
  const todayTiming = timings.find((t) => t.day === today);

  // ❌ Holiday or no timing
  if (!todayTiming || !todayTiming.is_open) return false;

  const now = new Date();

  const [sh, sm] = todayTiming.start.split(":").map(Number);
  const [eh, em] = todayTiming.end.split(":").map(Number);

  const start = new Date();
  start.setHours(sh, sm, 0, 0);

  const end = new Date();
  end.setHours(eh, em, 0, 0);

  // Overnight handling
  if (end <= start) end.setDate(end.getDate() + 1);

  return now >= start && now <= end;
};

const DEFAULT_TIMINGS = WEEK_DAYS.map((d) => ({
  day: d,
  is_open: true,
  start: "08:00",
  end: "22:00",
}));

  /* ================= INIT STAFF (PER STORE) ================= */
  useEffect(() => {
  setStoreStaff((prev) => {
    if (prev[storeId]) return prev;

    return {
      ...prev,
      [storeId]:
        storeId === "1"
          ? [
              {
                id: 1,
                name: "Rahul Sharma",
                role: "Manager",
                image: "",
                shiftStart: "08:00",
                shiftEnd: "16:00",
                active: true,
              },
              {
                id: 2,
                name: "Amit Patil",
                role: "Packer",
                image: "",
                shiftStart: "08:00",
                shiftEnd: "16:00",
                active: true,
              },
            ]
          : [
              {
                id: 3,
                name: "Neha Singh",
                role: "Manager",
                image: "",
                shiftStart: "10:00",
                shiftEnd: "18:00",
                active: true,
              },
              {
                id: 4,
                name: "Suresh Yadav",
                role: "Picker",
                image: "",
                shiftStart: "14:00",
                shiftEnd: "22:00",
                active: true,
              },
            ],
    };
  });
}, [storeId]);

useEffect(() => {
  const allStores = JSON.parse(localStorage.getItem("darkstores")) || [];
  const found = allStores.find(
    (s) => String(s.id) === String(storeId)
  );

  if (found) {
  setStoreInfo(found);
  setStoreForm({
    ...found,
    timings: found.timings?.length
      ? found.timings
      : DEFAULT_TIMINGS,
  });
}
}, [storeId]);


  /* ================= SHIFT LOGIC ================= */
  // const isInShift = (start, end) => {
  //   const now = new Date();
  //   const [sh, sm] = start.split(":").map(Number);
  //   const [eh, em] = end.split(":").map(Number);

  //   const s = new Date();
  //   s.setHours(sh, sm, 0, 0);

  //   const e = new Date();
  //   e.setHours(eh, em, 0, 0);
  //   if (e <= s) e.setDate(e.getDate() + 1);

  //   return now >= s && now <= e;
  // };

  const [now, setNow] = useState(new Date());

  const isInShift = (start, end) => {
  if (!start || !end) return false;

  const now = new Date();

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const shiftStart = new Date();
  shiftStart.setHours(sh, sm, 0, 0);

  const shiftEnd = new Date();
  shiftEnd.setHours(eh, em, 0, 0);

  // Handle overnight shift (e.g. 22:00 → 06:00)
  if (shiftEnd <= shiftStart) {
    shiftEnd.setDate(shiftEnd.getDate() + 1);
  }

  return now >= shiftStart && now <= shiftEnd;
};

/* ================= SHIFT HELPERS ================= */

// Convert "HH:mm" → minutes
const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// // Check overlap between two shifts
// const isOverlap = (aStart, aEnd, bStart, bEnd) => {
//   const aS = toMinutes(aStart);
//   const aE = toMinutes(aEnd);
//   const bS = toMinutes(bStart);
//   const bE = toMinutes(bEnd);

//   return Math.max(aS, bS) < Math.min(aE, bE);
// };

const isStoreTimingOpen = useMemo(() => {
  return isWithinStoreTiming(storeForm.timings || []);
}, [storeForm.timings, now]);

 const staffStatus = useMemo(
  () =>
    staff.map((s) => {
      const inShift = isInShift(s.shiftStart, s.shiftEnd);

      return {
        ...s,
        online: s.active && inShift,
      };
    }),
  [staff, now] // 👈 IMPORTANT
);

/* ================= SHIFT OVERLAPS ================= */

// const shiftOverlaps = useMemo(() => {
//   const overlaps = [];

//   for (let i = 0; i < staff.length; i++) {
//     for (let j = i + 1; j < staff.length; j++) {
//       if (
//         staff[i].active &&
//         staff[j].active &&
//         isOverlap(
//           staff[i].shiftStart,
//           staff[i].shiftEnd,
//           staff[j].shiftStart,
//           staff[j].shiftEnd
//         )
//       ) {
//         overlaps.push(`${staff[i].name} & ${staff[j].name}`);
//       }
//     }
//   }

//   return overlaps;
// }, [staff]);

/* ================= NEXT STAFF ================= */

const nextStaff = useMemo(() => {
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const upcoming = staff
    .filter((s) => s.active)
    .map((s) => ({
      ...s,
      startMin: toMinutes(s.shiftStart),
    }))
    .filter((s) => s.startMin > nowMin)
    .sort((a, b) => a.startMin - b.startMin);

  return upcoming[0] || null;
}, [staff, now]);

/* ================= FUTURE COVERAGE ================= */

const hasFutureCoverage = Boolean(nextStaff);

/* ================= PRODUCTS ================= */

useEffect(() => {
  setStoreProducts((prev) => {
    if (prev[storeId]) return prev;

    return {
      ...prev,
      [storeId]: [
        {
          id: Date.now(),
          name: "Aashirvaad Atta 5kg",
          category: "Atta, Rice, Oils & Dals",
          mrp: 450,
          price: 399,
          stock: 25,
          description: "Premium quality wheat flour",
          status: "live",
          active: true,
        },
      ],
    };
  });
}, [storeId]);

/* ✅ MUST COME BEFORE EFFECTS */
const hasStockAvailable = useMemo(() => {
  const list = storeProducts[storeId] || [];
  return list.some((p) => p.stock > 0 && p.active);
}, [storeProducts, storeId]);

/* ================= STORE ACTIVE CALC ================= */

useEffect(() => {
  const hasOnlineStaff = staffStatus.some((s) => s.online);

  const finalActive = Boolean(
    storeInfo?.is_active &&
    isStoreTimingOpen &&
    hasOnlineStaff &&
    hasStockAvailable
  );

  setStoreActive(finalActive);
}, [
  staffStatus,
  isStoreTimingOpen,
  hasStockAvailable,
  storeInfo,
]);

  /* ================= FORM ================= */
  const EMPTY_PRODUCT_FORM = {
  id: null,
  name: "",
  category: "",
  image: "",
  imagePreview: "",
  mrp: "",
  price: "",
  stock: "",
  description: "",
  status: "draft", // default draft
 };

  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);

  const handleProductImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const preview = URL.createObjectURL(file);

  setForm((prev) => ({
    ...prev,
    image: file,          // backend later
    imagePreview: preview // frontend preview
  }));
};

  /* ================= SAVE PRODUCT ================= */
 const saveProduct = () => {
  if (Number(form.mrp) <= Number(form.price)) {
    setPriceError("MRP must be greater than Selling Price");
    return;
  }

  const stock = Number(form.stock);

  const finalStatus = stock === 0 ? "draft" : form.status;

  const payload = {
    ...form,
    id: mode === "add" ? Date.now() : form.id,
    mrp: Number(form.mrp),
    price: Number(form.price),
    stock,
    status: finalStatus,
    active: finalStatus === "live",
  };

  setStoreProducts((prev) => {
    const list = prev[storeId] || [];
    return {
      ...prev,
      [storeId]:
        mode === "add"
          ? [...list, payload]
          : list.map((p) => (p.id === payload.id ? payload : p)),
    };
  });

  setForm(EMPTY_PRODUCT_FORM);
  setPriceError("");
  setShowModal(false);
};

  /* ================= FILTER ================= */

 const products = storeProducts[storeId] || [];

  const visibleProducts = useMemo(() => {
  return products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      categoryFilter ? p.category === categoryFilter : true
    )
    .sort((a, b) => {
  // 1️⃣ Low stock group first
  const aLow = a.stock < 10;
  const bLow = b.stock < 10;
  if (aLow !== bLow) return aLow ? -1 : 1;

  // 2️⃣ Alphabetical (A → Z) inside each group
  return a.name.localeCompare(b.name);
});
}, [products, search, categoryFilter]);

const handleStaffImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const preview = URL.createObjectURL(file);

  setEditingStaff((prev) => ({
    ...prev,
    image: preview,
    imageFile: file, // backend later
  }));
};

const normalizeProduct = (p) => {
  const status = p.stock === 0 ? "draft" : p.status;
  return {
    ...p,
    status,
    active: status === "live",
  };
};

useEffect(() => {
  setStoreProducts((prev) => ({
    ...prev,
    [storeId]: (prev[storeId] || []).map((p) => ({
      ...p,
      status: p.stock === 0 ? "draft" : p.status,
      active: p.status === "live" && p.stock > 0,
    })),
  }));
}, [storeId]);

useEffect(() => {
  const timer = setInterval(() => {
    setNow(new Date());
  }, 60 * 1000); // every 1 minute

  return () => clearInterval(timer);
}, []);

/* ================= STORE FORM VALIDATION ================= */

/* ================= FIELD LEVEL VALIDATION ================= */

const validateStoreForm = (data) => {
  const errors = {};

  const required = [
    "area",
    "address",
    "landmark",
    "city",
    "pincode",
    "lat",
    "lng",
    "service_radius_km",
    "warehouse_size_sqft",
    "daily_capacity",
    "sla_minutes",
  ];

  // Required check
  required.forEach((f) => {
    if (!data[f] || String(data[f]).trim() === "") {
      errors[f] = "Required";
    }
  });

  // Pincode: exactly 6 digits
  if (data.pincode && !/^\d{6}$/.test(data.pincode)) {
    errors.pincode = "Pincode must be 6 digits";
  }

  // Latitude range
  if (data.lat && (Number(data.lat) < -90 || Number(data.lat) > 90)) {
    errors.lat = "Latitude must be between -90 and 90";
  }

  // Longitude range
  if (data.lng && (Number(data.lng) < -180 || Number(data.lng) > 180)) {
    errors.lng = "Longitude must be between -180 and 180";
  }

  return errors;
};

useEffect(() => {
  setStoreErrors(validateStoreForm(storeForm));
}, [storeForm]);

useEffect(() => {
  if (!storeInfo) return;

  const allStores =
    JSON.parse(localStorage.getItem("darkstores")) || [];

  const updated = allStores.map((s) =>
    String(s.id) === String(storeId)
      ? {
          ...s,
          computed_active: storeActive,
          offline_reason: !storeInfo.is_active
            ? "manual"
            : !isStoreTimingOpen
            ? "timing"
            : !staffStatus.some((x) => x.online)
            ? "staff"
            : !hasStockAvailable
            ? "stock"
            : null,
        }
      : s
  );

  localStorage.setItem("darkstores", JSON.stringify(updated));
}, [
  storeActive,
  isStoreTimingOpen,
  staffStatus,
  hasStockAvailable,
  storeInfo,
  storeId,
]);


  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/darkstores")}
          className="p-2 bg-gray-100 rounded"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-bold">
          Manage Store – {storeName}
        </h2>
        
       <span
        className={`ml-3 px-3 py-1 text-xs rounded-full ${
          storeActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {storeActive
          ? "Store Online"
          : !isStoreTimingOpen
          ? "Closed (Outside Store Timings)"
          : "Store Offline"}
      </span>

        <button
          onClick={() => setShowEditStore(true)}
          className="ml-3 px-3 py-1.5 border border-orange-500 text-orange-500 rounded text-sm flex items-center gap-1"
        >
          <Edit size={14} />
          Edit Store Details
        </button>

      {/* WARNINGS */}
{!storeActive && storeInfo?.offline_reason && (
  <div className="flex flex-col ml-4 space-y-1 text-xs">
    {storeInfo.offline_reason === "staff" && (
      <p className="text-orange-600">
        🔒 No staff online
      </p>
    )}

    {storeInfo.offline_reason === "timing" && (
      <p className="text-red-600">
        ⏰ Outside store timings
      </p>
    )}

    {storeInfo.offline_reason === "stock" && (
      <p className="text-red-600">
        📦 All products out of stock
      </p>
    )}

    {storeInfo.offline_reason === "manual" && (
      <p className="text-gray-600">
        🛑 Disabled by admin
      </p>
    )}
  </div>
)}

        {/* STAFF */}
        <div className="ml-auto relative" ref={profileRef}>
          <button onClick={() => setShowProfile((v) => !v)}>
            <UserCircle size={36} className="text-orange-500" />
          </button>

          {showProfile && (
           <div
           className="fixed top-47 right-12 w-80 bg-white border rounded-2xl shadow-2xl p-4 z-50"
           >
              <h4 className="font-semibold mb-2">Store Staff</h4>
              {staffStatus.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setEditingStaff(s);
                  setShowEditStaff(true);
                  setShowProfile(false);
                }}
                className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-orange-50 p-2 rounded"
              >
                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                  {s.image && (
                    <img src={s.image} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-gray-500">
                    {s.role} • {s.shiftStart}-{s.shiftEnd}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    s.online
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s.online ? "Online" : "Offline"}
                </span>
              </div>
            ))}
            <button
          onClick={() => {
            setEditingStaff({
              id: Date.now(),
              name: "",
              role: "Packer",
              image: "",
              shiftStart: "09:00",
              shiftEnd: "17:00",
              active: true,
              punchedIn: false,
            });
            setShowEditStaff(true);
            setShowProfile(false);
          }}
          className="mt-2 w-full border border-orange-500 text-orange-500 py-2 rounded"
        >
          Add Staff
        </button>
        </div>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-2 text-gray-400" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product"
            className="pl-8 border rounded px-2 py-1.5"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded px-2"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* ACTION BUTTONS */}
        <div className="ml-auto flex gap-2 items-center">
          {/* IMPORT CSV */}
          <label className="px-4 py-2 border border-orange-500 text-orange-500 rounded cursor-pointer text-sm">
            Import CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  importCSV(e.target.files[0]);
                  e.target.value = "";
                }
              }}
            />
          </label>

          {/* EXPORT CSV */}
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-gray-200 rounded text-sm"
          >
            Export CSV
          </button>

          {/* ADD PRODUCT */}
          <button
            onClick={() => {
              setMode("add");
              setForm(EMPTY_PRODUCT_FORM);
              setPriceError("");
              setShowModal(true);
            }}
            className="px-4 py-2 rounded text-white bg-orange-500 flex items-center gap-1"
          >
            Add Product
          </button>
        </div>
        </div>

     {/* PRODUCT LIST */}
<div className="space-y-3">
  {visibleProducts.map((p) => (
    <div
      key={p.id}
      className="border rounded-xl p-4 flex justify-between items-start bg-white"
    >
      {/* LEFT SIDE – PRODUCT INFO */}
      <div className="flex gap-4">
        {/* IMAGE */}
        <div className="w-16 h-16 bg-gray-100 rounded border overflow-hidden flex items-center justify-center">
          {p.imagePreview ? (
            <img
              src={p.imagePreview}
              alt={p.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}
        </div>

        {/* DETAILS */}
        <div className="space-y-1">
          <h4 className="font-semibold text-sm">{p.name}</h4>

          <p className="text-xs text-gray-500">
            {p.description || "No description"}
          </p>

          <p className="text-xs text-gray-400">{p.category}</p>

          <p className="text-sm">
            <span className="line-through text-gray-400 mr-2">
              ₹{p.mrp}
            </span>
            <span className="text-orange-500 font-semibold">
              ₹{p.price}
            </span>
          </p>

          <p className="text-xs text-gray-700">
            Stock: {p.stock}
            {p.stock < 10 && (
              <span className="ml-2 text-red-600">
                ⚠ Low Stock (below 10)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE – ACTIONS */}
      <div className="flex items-center gap-3">
        {/* TOGGLE */}
        <button
          disabled={p.stock === 0}
          onClick={() =>
            setStoreProducts((prev) => ({
              ...prev,
              [storeId]: prev[storeId].map((x) =>
                x.id === p.id
                  ? {
                      ...x,
                      status: x.active ? "draft" : "live",
                      active: !x.active,
                    }
                  : x
              ),
            }))
          }
          className={`w-11 h-6 rounded-full relative transition ${
            p.active ? "bg-orange-500" : "bg-gray-300"
          } ${p.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
              p.active ? "translate-x-5" : ""
            }`}
          />
        </button>

        {/* EDIT */}
        <Edit
          className="text-orange-500 cursor-pointer"
          onClick={() => {
            setForm({ ...p, imagePreview: p.imagePreview || "" });
            setMode("edit");
            setShowModal(true);
          }}
        />
      </div>
    </div>
  ))}
</div>

      {/* ADD / EDIT PRODUCT POPUP */}
      {showModal && (
  <div className="fixed inset-0 bg-black/40 z-50">
    <div className="flex items-center justify-center px-4">

          <div className="bg-white p-5 rounded-xl w-full max-w-md space-y-3">
            <h3 className="font-semibold">
              {mode === "add" ? "Add Product" : "Edit Product"}
            </h3>

          {/* STORE CODE (READ ONLY) */}
          <div className="bg-gray-50 border rounded px-3 py-2">
            <p className="text-xs text-gray-500">Store Code</p>
            <p className="font-semibold text-gray-800">
              {storeForm.store_code}
            </p>
          </div>

            {/* PRODUCT IMAGE */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden border">
                {form.imagePreview && (
                  <img
                    src={form.imagePreview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                )}
              </div>

              <label className="cursor-pointer text-sm text-orange-600 flex items-center gap-2">
                <Upload size={14} />
                Upload Product Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProductImageUpload}
                />
              </label>
            </div>

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex gap-2">
              <input
                placeholder="MRP"
                type="number"
                value={form.mrp}
                onChange={(e) => {
                  setForm({ ...form, mrp: e.target.value });
                  setPriceError(
                    Number(e.target.value) <= Number(form.price)
                      ? "MRP must be greater than Selling Price"
                      : ""
                  );
                }}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                placeholder="Selling Price"
                type="number"
                value={form.price}
                onChange={(e) => {
                  setForm({ ...form, price: e.target.value });
                  setPriceError(
                    Number(form.mrp) <= Number(e.target.value)
                      ? "MRP must be greater than Selling Price"
                      : ""
                  );
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {priceError && (
              <p className="text-sm text-red-600">{priceError}</p>
            )}

            <input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => {
              const stock = Number(e.target.value);

              setForm({
                ...form,
                stock,
                status: stock === 0 ? "draft" : form.status,
              });
            }}
            className="w-full border px-3 py-2 rounded"
            />

           <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            className="w-full border px-3 py-2 rounded"
          >
            <option value="draft">Draft (Hidden)</option>
            <option value="live" disabled={Number(form.stock) === 0}>
              Live (Visible)
            </option>
          </select>
           <div className="flex justify-end gap-3 pt-2">
            <button
            onClick={() => {
              setForm(EMPTY_PRODUCT_FORM);
              setPriceError("");
              setShowModal(false);
            }}
            className="px-4 py-2 bg-gray-200 rounded"
          >
          Cancel
          </button>
              <button
                onClick={saveProduct}
                disabled={!!priceError}
                className={`px-4 py-2 rounded text-white ${
                  priceError ? "bg-gray-400" : "bg-orange-500"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* ================= EDIT STAFF MODAL ================= */}
{showEditStaff && editingStaff && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-md p-5 space-y-4">
      <h3 className="text-lg font-semibold">Edit Staff</h3>

      {/* IMAGE */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
          {editingStaff.image && (
            <img
              src={editingStaff.image}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <label className="cursor-pointer text-sm text-orange-600 flex items-center gap-2">
          <Upload size={14} />
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleStaffImageUpload}
          />
        </label>
      </div>

      {/* NAME */}
      <input
        value={editingStaff.name}
        onChange={(e) =>
          setEditingStaff({ ...editingStaff, name: e.target.value })
        }
        placeholder="Staff Name"
        className="w-full border px-3 py-2 rounded"
      />

      {/* ROLE */}
      <select
        value={editingStaff.role}
        onChange={(e) =>
          setEditingStaff({ ...editingStaff, role: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      >
        <option>Manager</option>
        <option>Packer</option>
        <option>Picker</option>
      </select>

      {/* SHIFT */}
      <div className="flex gap-2 items-center">
        <Clock size={16} className="text-gray-400" />
        <input
          type="time"
          value={editingStaff.shiftStart}
          onChange={(e) =>
            setEditingStaff({
              ...editingStaff,
              shiftStart: e.target.value,
            })
          }
          className="border px-2 py-1 rounded"
        />
        <span>to</span>
        <input
          type="time"
          value={editingStaff.shiftEnd}
          onChange={(e) =>
            setEditingStaff({
              ...editingStaff,
              shiftEnd: e.target.value,
            })
          }
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* ACTIVE */}
      <button
        onClick={() =>
          setEditingStaff({
            ...editingStaff,
            active: !editingStaff.active,
          })
        }
        className={`px-3 py-1 rounded text-sm ${
          editingStaff.active
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {editingStaff.active ? "Active" : "Inactive"}
      </button>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-3">
        <button
          onClick={() => setShowEditStaff(false)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => {
           setStoreStaff((prev) => {
            const list = prev[storeId] || [];
            const exists = list.some((s) => s.id === editingStaff.id);

            return {
              ...prev,
              [storeId]: exists
                ? list.map((s) =>
                    s.id === editingStaff.id ? editingStaff : s
                  )
                : [...list, editingStaff],
            };
          });
          setShowEditStaff(false);
          setEditingStaff(null);
        }}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

{showEditStore && storeForm && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-md rounded-xl shadow-xl max-h-[85vh] flex flex-col">

    {/* ===== HEADER ===== */}
      <div className="px-6 py-4 border-b">
      <h3 className="text-lg font-semibold">
        Edit Store Details
      </h3>
    </div>

    {/* ===== BODY (SCROLLABLE, NO SCROLLBAR) ===== */}
    <div className="px-6 py-4 space-y-4 overflow-y-auto scrollbar-hide flex-1">

      {/* LOCATION DETAILS */}
      <h4 className="font-medium text-gray-700">
        📍 Location Details
      </h4>

     <input
      placeholder="Area"
      value={storeForm.area || ""}
      onChange={(e) =>
        setStoreForm({
          ...storeForm,
          area: e.target.value.trimStart(),
        })
      }
      className={`w-full px-3 py-2 rounded border ${
        storeErrors.area ? "border-red-500" : "border-gray-300"
      }`}
    />
    {storeErrors.area && (
      <p className="text-xs text-red-600">{storeErrors.area}</p>
    )}

      <input
      placeholder="Address"
      value={storeForm.address || ""}
      onChange={(e) =>
        setStoreForm({ ...storeForm, address: e.target.value })
      }
      className={`w-full px-3 py-2 rounded border ${
        storeErrors.address ? "border-red-500" : "border-gray-300"
      }`}
    />
    {storeErrors.address && (
      <p className="text-xs text-red-600">{storeErrors.address}</p>
    )}

      <input
      placeholder="Landmark"
      value={storeForm.landmark || ""}
      onChange={(e) =>
        setStoreForm({ ...storeForm, landmark: e.target.value })
      }
      className={`w-full px-3 py-2 rounded border ${
        storeErrors.landmark ? "border-red-500" : "border-gray-300"
      }`}
    />
    {storeErrors.landmark && (
      <p className="text-xs text-red-600">{storeErrors.landmark}</p>
    )}

      <div className="flex gap-2">
        <input
        placeholder="City"
        value={storeForm.city || ""}
        onChange={(e) =>
          setStoreForm({ ...storeForm, city: e.target.value })
        }
        className={`w-full px-3 py-2 rounded border ${
          storeErrors.city ? "border-red-500" : "border-gray-300"
        }`}
      />
      {storeErrors.city && (
        <p className="text-xs text-red-600">{storeErrors.city}</p>
      )}

       <input
      placeholder="Pincode"
      value={storeForm.pincode || ""}
      onChange={(e) =>
        setStoreForm({ ...storeForm, pincode: e.target.value })
      }
      className={`w-full px-3 py-2 rounded border ${
        storeErrors.pincode ? "border-red-500" : "border-gray-300"
      }`}
    />
    {storeErrors.pincode && (
      <p className="text-xs text-red-600">{storeErrors.pincode}</p>
    )}

      </div>

      <div className="flex gap-2">
       <input
      placeholder="Latitude"
      value={storeForm.lat || ""}
      onChange={(e) =>
        setStoreForm({ ...storeForm, lat: e.target.value })
      }
      className={`w-full px-3 py-2 rounded border ${
        storeErrors.lat ? "border-red-500" : "border-gray-300"
      }`}
    />
    {storeErrors.lat && (
      <p className="text-xs text-red-600">{storeErrors.lat}</p>
    )}

        <input
      placeholder="Longitude"
      value={storeForm.lng || ""}
      onChange={(e) =>
        setStoreForm({ ...storeForm, lng: e.target.value })
      }
      className={`w-full px-3 py-2 rounded border ${
        storeErrors.lng ? "border-red-500" : "border-gray-300"
      }`}
    />
    {storeErrors.lng && (
      <p className="text-xs text-red-600">{storeErrors.lng}</p>
    )}

      </div>

      {/* STORE DETAILS */}
      <h4 className="font-medium text-gray-700 pt-2">
        🏬 Store Details
      </h4>

      <div className="grid grid-cols-2 gap-2">
        <input
      type="number"
      placeholder="Service Radius (km)"
      value={storeForm.service_radius_km || ""}
      onChange={(e) =>
        setStoreForm({ ...storeForm, service_radius_km: e.target.value })
      }
      className={`px-3 py-2 rounded border ${
        storeErrors.service_radius_km ? "border-red-500" : "border-gray-300"
      }`}
    />
    {storeErrors.service_radius_km && (
      <p className="text-xs text-red-600">
        {storeErrors.service_radius_km}
      </p>
    )}

        <input
      type="number"
      placeholder="Warehouse Size (sqft)"
      value={storeForm.warehouse_size_sqft || ""}
      onChange={(e) =>
        setStoreForm({
          ...storeForm,
          warehouse_size_sqft: e.target.value,
        })
      }
      className={`px-3 py-2 rounded border ${
        storeErrors.warehouse_size_sqft ? "border-red-500" : "border-gray-300"
      }`}
    />
    {storeErrors.warehouse_size_sqft && (
      <p className="text-xs text-red-600">
        {storeErrors.warehouse_size_sqft}
      </p>
    )}

        <input
        type="number"
        placeholder="Daily Order Capacity"
        value={storeForm.daily_capacity || ""}
        onChange={(e) =>
          setStoreForm({ ...storeForm, daily_capacity: e.target.value })
        }
        className={`px-3 py-2 rounded border ${
          storeErrors.daily_capacity ? "border-red-500" : "border-gray-300"
        }`}
      />
      {storeErrors.daily_capacity && (
        <p className="text-xs text-red-600">
          {storeErrors.daily_capacity}
        </p>
      )}

        <input
        type="number"
        placeholder="SLA (minutes)"
        value={storeForm.sla_minutes || ""}
        onChange={(e) =>
          setStoreForm({ ...storeForm, sla_minutes: e.target.value })
        }
        className={`px-3 py-2 rounded border ${
          storeErrors.sla_minutes ? "border-red-500" : "border-gray-300"
        }`}
      />
      {storeErrors.sla_minutes && (
        <p className="text-xs text-red-600">
          {storeErrors.sla_minutes}
        </p>
      )}
    </div>

    {/* STORE TIMINGS */}
<h4 className="font-medium text-gray-700 pt-3">
  ⏰ Store Timings
</h4>

<div className="space-y-2">
  {storeForm.timings?.map((t, idx) => (
    <div
      key={t.day}
      className="flex items-center gap-3 border rounded px-3 py-2"
    >
      {/* DAY */}
      <div className="w-24 text-sm font-medium">
        {t.day}
      </div>

      {/* WORKING CHECKBOX */}
      <label className="flex items-center gap-1 text-sm">
        <input
          type="checkbox"
          checked={t.is_open}
          onChange={(e) => {
            const updated = [...storeForm.timings];
            updated[idx] = {
              ...updated[idx],
              is_open: e.target.checked,
              start: e.target.checked ? "08:00" : "",
              end: e.target.checked ? "22:00" : "",
            };
            setStoreForm({
              ...storeForm,
              timings: updated,
            });
          }}
        />
        Working
      </label>

      {/* START TIME */}
      <input
        type="time"
        value={t.start}
        disabled={!t.is_open}
        onChange={(e) => {
          const updated = [...storeForm.timings];
          updated[idx] = {
            ...updated[idx],
            start: e.target.value,
          };
          setStoreForm({
            ...storeForm,
            timings: updated,
          });
        }}
        className={`border px-2 py-1 rounded ${
          !t.is_open ? "opacity-40 cursor-not-allowed" : ""
        }`}
      />

      <span>to</span>

      {/* END TIME */}
      <input
        type="time"
        value={t.end}
        disabled={!t.is_open}
        onChange={(e) => {
          const updated = [...storeForm.timings];
          updated[idx] = {
            ...updated[idx],
            end: e.target.value,
          };
          setStoreForm({
            ...storeForm,
            timings: updated,
          });
        }}
        className={`border px-2 py-1 rounded ${
          !t.is_open ? "opacity-40 cursor-not-allowed" : ""
        }`}
      />

      {/* HOLIDAY LABEL */}
      {!t.is_open && (
        <span className="text-xs text-red-500 ml-2">
          Holiday
        </span>
      )}
    </div>
  ))}
</div>
</div>

{/* ===== FOOTER (STICKY BUTTONS) ===== */}
{/* ACTIONS */}
      <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
        <button
          onClick={() => setShowEditStore(false)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          disabled={!isStoreFormValid}
         onClick={() => {
    const allStores =
      JSON.parse(localStorage.getItem("darkstores")) || [];

    const updated = allStores.map((s) =>
      s.id === storeForm.id
        ? {
            ...s,
            area: storeForm.area,
            address: storeForm.address,
            landmark: storeForm.landmark,
            city: storeForm.city,
            pincode: storeForm.pincode,
            lat: storeForm.lat,
            lng: storeForm.lng,
            service_radius_km: storeForm.service_radius_km,
            warehouse_size_sqft: storeForm.warehouse_size_sqft,
            daily_capacity: storeForm.daily_capacity,
            sla_minutes: storeForm.sla_minutes,
            timings: storeForm.timings,
          }
        : s
    );

    localStorage.setItem("darkstores", JSON.stringify(updated));
    setStoreInfo(storeForm);
    setShowEditStore(false);
  }}
          className={`px-4 py-2 rounded text-white ${
            isStoreFormValid
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
   </div>
  );
}
