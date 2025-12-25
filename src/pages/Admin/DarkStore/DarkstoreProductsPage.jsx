import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Plus, Edit, Search, UserCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

/* ================= GLOBAL CATEGORIES ================= */
const CATEGORIES = [
  // Grocery
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

  // Meat & Dairy
  "Meat, Fish & Eggs",

  // Pharmacy & Health
  "Medicines & First Aid",
  "Thermometer, BP Monitor & More",
  "Sanitary Pads & Diapers",
  "Health Drinks & Protein Supplements",
  "Baby Cares",

  // Pet Care
  "Dog Food",
  "Cat Food",
  "Treats",
  "Litter",
  "Pet Grooming",
  "Pet Accessories",

  // Party & Celebration
  "Balloons & Party Decoration",
  //"Birthday Banners",
  "Candle Packs",
  "Disposable Plates & Cups",
  "Return Gifts",
  "Helium Balloons",
  "Celebration Cakes",

  // Printing & Stationery
  // "Print or Xerox (B/W, Color)",
  // "Photo Print",
  // "Banner / Flex Printing",
  // "Lamination",
  // "Spiral Binding",

  // Recharge & Utilities
  // "Mobile Recharge",
  // "DTH/Cable Recharge",
  // "Electricity Bill Pay",

  // Home Services
  // "Electrician / Plumber / Carpenter",
  // "Mobile Repair",
  // "AC / Cooler Repair",
  // "Water Purifier / Geyser Repair",
  // "Refrigerator / TV / Washing Machine Repair",
  // "Inverter & Battery Repair",
  // "Pest Control",
  // "Painting Services",

  // Salon & Personal Services
  // "Salon (Men)",
  // "Beauty & Salon (Women)",
  // "Mehendi Artists",
];

export default function DarkstoreProductsPage() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const profileRef = useRef(null);

  /* ================= STORE CODE ================= */
  const STORE_CODE_MAP = {
    1: "DS-01",
    2: "DS-02",
    3: "DS-03",
  };
  const storeCode = STORE_CODE_MAP[storeId] || "DS-XX";

  /* ================= STATE ================= */
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit
  
  const [priceError, setPriceError] = useState("");
 
/* ================= STAFF STATE (FIX) ================= */
  const [staff, setStaff] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditStaff, setShowEditStaff] = useState(false);
  const [shiftWarnings, setShiftWarnings] = useState([]);

  const [storeActive, setStoreActive] = useState(true);

  /* ================= INIT STAFF ================= */
  useEffect(() => {
    setStaff([
      {
        id: 1,
        name: "Rahul Sharma",
        role: "Manager",
        shiftStart: "08:00",
        shiftEnd: "16:00",
        active: true,
      },
      {
        id: 2,
        name: "Amit Patil",
        role: "Packer",
        shiftStart: "08:00",
        shiftEnd: "16:00",
        active: true,
      },
      {
        id: 3,
        name: "Suresh Yadav",
        role: "Packer",
        shiftStart: "16:00",
        shiftEnd: "00:00",
        active: true,
      },
      {
        id: 4,
        name: "Neha Singh",
        role: "Picker",
        shiftStart: "16:00",
        shiftEnd: "00:00",
        active: false,
      },
    ]);
  }, []);

  /* ================= SHIFT CHECK ================= */
  const isInShift = (start, end) => {
  const now = new Date();

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  // Today window
  const todayStart = new Date();
  todayStart.setHours(sh, sm, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(eh, em, 0, 0);

  if (todayEnd <= todayStart) {
    todayEnd.setDate(todayEnd.getDate() + 1);
  }

  // Yesterday window (for morning shifts)
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const yesterdayEnd = new Date(todayEnd);
  yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

  return (
    (now >= todayStart && now <= todayEnd) ||
    (now >= yesterdayStart && now <= yesterdayEnd)
  );
};

// Convert HH:MM to minutes
const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const detectShiftConflicts = (staffList) => {
  const conflicts = [];

  for (let i = 0; i < staffList.length; i++) {
    for (let j = i + 1; j < staffList.length; j++) {
      const a = staffList[i];
      const b = staffList[j];

      if (a.role !== b.role) continue;
      if (!a.active || !b.active) continue;

      const aS = toMin(a.shiftStart);
      const aE = toMin(a.shiftEnd === "00:00" ? "24:00" : a.shiftEnd);

      const bS = toMin(b.shiftStart);
      const bE = toMin(b.shiftEnd === "00:00" ? "24:00" : b.shiftEnd);

      const overlap = aS < bE && aE > bS;

      if (overlap) {
        conflicts.push({
          role: a.role,
          staff: [a.name, b.name],
        });
      }
    }
  }

  return conflicts;
};

  /* ================= DERIVED STAFF STATUS ================= */
  const staffStatus = useMemo(() => {
    return staff.map((s) => ({
      ...s,
      online: s.active && isInShift(s.shiftStart, s.shiftEnd),
    }));
  }, [staff]);

  useEffect(() => {
  const anyoneOnline = staffStatus.some((s) => s.online);

  setStoreActive(anyoneOnline);
}, [staffStatus]);

  /* ================= OUTSIDE CLICK CLOSE ================= */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  

  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    imageFile: null,
    imagePreview: "",
    mrp: "",
    price: "",
    stock: "",
    description: "",
    active: true,
  });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [formCategoryOpen, setFormCategoryOpen] = useState(false);

  /* ================= MOCK DATA (PER STORE) ================= */
  useEffect(() => {
    if (storeId === "1") {
      setProducts([
        {
          id: 1,
          name: "Aashirvaad Atta 5kg",
          category: "Staples",
          mrp: 450,
          price: 399,
          stock: 25,
          active: true,
          imagePreview: "",
        },
        {
          id: 2,
          name: "Tata Salt 1kg",
          category: "Staples",
          mrp: 28,
          price: 25,
          stock: 40,
          active: true,
          imagePreview: "",
        },
        {
          id: 3,
          name: "Fortune Oil 1L",
          category: "Household",
          mrp: 180,
          price: 165,
          stock: 0,
          active: false,
          imagePreview: "",
        },
      ]);
    } else {
      setProducts([
        {
          id: 4,
          name: "Amul Milk 1L",
          category: "Dairy",
          mrp: 64,
          price: 60,
          stock: 20,
          active: true,
          imagePreview: "",
        },
        {
          id: 5,
          name: "Eggs 12 Pack",
          category: "Dairy",
          mrp: 84,
          price: 78,
          stock: 6,
          active: true,
          imagePreview: "",
        },
      ]);
    }
  }, [storeId]);
  
 const [, forceTick] = useState(0);

useEffect(() => {
  const i = setInterval(() => {
    forceTick((t) => t + 1);
  }, 60000);
  return () => clearInterval(i);
}, []);
 
useEffect(() => {
  setShiftWarnings(detectShiftConflicts(staff));
}, [staff]);

  /* ================= SEARCH + FILTER + RANKING ================= */
  const visibleProducts = useMemo(() => {
    return products
      .filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((p) =>
        categoryFilter ? p.category === categoryFilter : true
      )
      .sort((a, b) => {
        if (a.active !== b.active) return b.active - a.active;
        if (a.stock !== b.stock) return b.stock - a.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, search, categoryFilter]);

  /* ================= TOGGLE ACTIVE ================= */
  const toggleProduct = (id) => {
  if (!storeActive) {
    alert("Store is offline. Enable staff first.");
    return;
  }

  setProducts((prev) =>
    prev.map((p) =>
      p.id === id ? { ...p, active: !p.active } : p
    )
  );
};

  /* ================= OPEN MODALS ================= */
  const openAdd = () => {
    setMode("add");
    setFormCategoryOpen(false);
    setForm({
      id: null,
      name: "",
      category: "",
      imageFile: null,
      imagePreview: "",
      mrp: "",
      price: "",
      stock: "",
      description: "",
      active: true,
    });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setMode("edit");
    setForm({ ...product, imageFile: null });
    setShowModal(true);
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  /* ================= SAVE ================= */
  const saveProduct = () => {
  if (
    !form.name ||
    !form.category ||
    !form.price ||
    form.stock === ""
  ) {
    alert("Please fill all required fields");
    return;
  }

  if (Number(form.mrp) <= Number(form.price)) {
    setPriceError("MRP must be greater than Selling Price");
    return;
  }

  const payload = {
    ...form,
    mrp: Number(form.mrp),
    price: Number(form.price),
    stock: Number(form.stock),
  };

  if (mode === "add") {
    setProducts((prev) => [
      ...prev,
      { ...payload, id: Date.now() },
    ]);
  } else {
    setProducts((prev) =>
      prev.map((p) => (p.id === form.id ? payload : p))
    );
  }

  setShowModal(false);
};

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
     <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/darkstores")}
          className="p-2 rounded-lg bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-xl font-bold">
          Manage Products – Store {storeCode}
        </h2>
      
      <div className="flex items-center gap-2">
  <span
    className={`px-3 py-1 text-xs rounded-full ${
      storeActive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {storeActive ? "Store Online" : "Store Offline (No Staff Online)"}
  </span>
</div>

     <div className="relative ml-auto" ref={profileRef}>
          <button onClick={() => setShowProfile((v) => !v)}>
            <UserCircle size={36} className="text-orange-500" />
          </button>

          {!storeActive && (
            <div className="mt-2 text-xs text-red-600">
              ⚠ Store offline due to no staff online
            </div>
          )}

          {showProfile && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg p-4 z-50">
              <h4 className="font-semibold mb-3">Store Staff</h4>

              {staffStatus.map((s) => (
                <div key={s.id} className="flex justify-between mb-2">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-gray-500">
                      {s.role} • {s.shiftStart}–{s.shiftEnd}
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

              {!s.online && s.active && (
                <span className="ml-2 text-xs text-orange-500">
                  Shift ended
                </span>
              )}
              </div>
              ))}

              <button
                onClick={() => {
                  setShowProfile(false);
                  setShowEditStaff(true);
                }}
                className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg"
              >
                Edit Staff
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH + FILTER */}
     <div className="flex flex-wrap gap-2 items-center">
      <div className="relative">
      <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
        <input
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
        </div>

      <div className="relative">
  <button
    onClick={() => setCategoryOpen((v) => !v)}
    className="border rounded-md px-2 py-1.5 text-sm bg-white min-w-[220px] flex justify-between items-center"
  >
    <span>
      {categoryFilter || "All Categories"}
    </span>
    <span className="text-gray-400">▾</span>
  </button>

  {categoryOpen && (
    <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto">
      <div
        onClick={() => {
          setCategoryFilter("");
          setCategoryOpen(false);
        }}
        className="px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer"
      >
        All Categories
      </div>

      {CATEGORIES.map((c) => (
        <div
          key={c}
          onClick={() => {
            setCategoryFilter(c);
            setCategoryOpen(false);
          }}
          className="px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer"
        >
          {c}
        </div>
      ))}
    </div>
  )}
</div>

        <div className="flex-1" />

        <button
  onClick={openAdd}
  disabled={!storeActive}
  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white ${
    storeActive
      ? "bg-orange-500"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  <Plus size={18} /> Add Product
</button>
    </div>

      {/* PRODUCT LIST */}
      <div className="space-y-3">
        {visibleProducts.map((p) => (
          <div
            key={p.id}
            className="border rounded-xl p-4 flex justify-between items-center"
          >
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded border bg-gray-100 overflow-hidden">
                {p.imagePreview ? (
                  <img
                    src={p.imagePreview}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xs text-gray-400 flex items-center justify-center h-full">
                    No Image
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-xs text-gray-500">
                  Category: <b>{p.category}</b>
                </p>
                <p className="text-sm text-gray-500">
                  <span className="line-through mr-2">₹{p.mrp}</span>
                  <span className="text-green-600 font-semibold">
                    ₹{p.price}
                  </span>
                </p>
                <p className="text-sm">
                  Stock: <b>{p.stock}</b>
                  {p.stock === 0 && (
                    <span className="ml-2 text-red-600 text-xs">
                      (Out of stock)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleProduct(p.id)}
                className={`w-12 h-6 rounded-full relative transition ${
                  p.active ? "bg-orange-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                    p.active ? "translate-x-6" : ""
                  }`}
                />
              </button>

              <Edit
                className="text-orange-500 cursor-pointer"
                onClick={() => openEdit(p)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-md space-y-3">
            <h3 className="text-lg font-semibold">
              {mode === "add" ? "Add Product" : "Edit Product"}
            </h3>

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />

          <div className="relative">
  <button
    type="button"
    onClick={() => setFormCategoryOpen((v) => !v)}
    className="w-full border rounded-md px-2 py-1.5 text-sm bg-white flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-orange-500"
  >
    <span className={form.category ? "" : "text-gray-400"}>
      {form.category || "Select Category"}
    </span>
    <span className="text-gray-400">▾</span>
  </button>

  {formCategoryOpen && (
    <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow max-h-48 overflow-y-auto">
      {CATEGORIES.map((c) => (
        <div
          key={c}
          onClick={() => {
            setForm({ ...form, category: c });
            setFormCategoryOpen(false);
          }}
          className="px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer"
        >
          {c}
        </div>
      ))}
    </div>
  )}
</div>

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded border"
              />
            )}

            <div className="flex gap-3">
              <input
              placeholder="MRP"
              type="number"
              value={form.mrp}
              onChange={(e) => {
                const mrp = Number(e.target.value);
                const price = Number(form.price);

                setForm({ ...form, mrp: e.target.value });

                if (price && mrp <= price) {
                  setPriceError("MRP must be greater than Selling Price");
                } else {
                  setPriceError("");
                }
              }}
              className="w-full border rounded px-3 py-2"
            />
             <input
              placeholder="Selling Price"
              type="number"
              value={form.price}
              onChange={(e) => {
                const price = Number(e.target.value);
                const mrp = Number(form.mrp);

                setForm({ ...form, price: e.target.value });

                if (mrp && price >= mrp) {
                  setPriceError("Selling Price must be less than MRP");
                } else {
                  setPriceError("");
                }
              }}
              className="w-full border rounded px-3 py-2"
            />
            </div>
{priceError && (
  <p className="text-sm text-red-600 mt-1">
    {priceError}
  </p>
)}

            <input
              placeholder="Stock Quantity"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
              onClick={saveProduct}
              disabled={!!priceError}
              className={`px-4 py-2 rounded-lg text-white ${
                priceError
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500"
              }`}
            >
              Save
            </button>
            </div>
          </div>
        </div>
      )}
      
      {/* EDIT STAFF MODAL */}
      {showEditStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-5 space-y-4">
            <h3 className="text-lg font-semibold">Edit Store Staff</h3>

            {staff.map((s) => (
              <div key={s.id} className="border p-3 rounded space-y-2">
                <input
                  value={s.name}
                  onChange={(e) =>
                    setStaff((prev) =>
                      prev.map((x) =>
                        x.id === s.id ? { ...x, name: e.target.value } : x
                      )
                    )
                  }
                  className="border px-2 py-1 w-full"
                />

                <div className="flex gap-2">
                  <input
                    type="time"
                    value={s.shiftStart}
                    onChange={(e) =>
                      setStaff((prev) =>
                        prev.map((x) =>
                          x.id === s.id ? { ...x, shiftStart: e.target.value } : x
                        )
                      )
                    }
                    className="border px-2 py-1"
                  />
                  <input
                    type="time"
                    value={s.shiftEnd}
                    onChange={(e) =>
                      setStaff((prev) =>
                        prev.map((x) =>
                          x.id === s.id ? { ...x, shiftEnd: e.target.value } : x
                        )
                      )
                    }
                    className="border px-2 py-1"
                  />
                {shiftWarnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm text-yellow-800">
                <b>Shift Conflicts:</b>
                <ul className="list-disc ml-5 mt-1">
                  {shiftWarnings.map((c, i) => (
                    <li key={i}>
                      {c.role}: {c.staff.join(" & ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
              <button
                    onClick={() =>
                      setStaff((prev) =>
                        prev.map((x) =>
                          x.id === s.id ? { ...x, active: !x.active } : x
                        )
                      )
                    }
                    className={`px-3 rounded ${
                      s.active ? "bg-green-100" : "bg-gray-200"
                    }`}
                  >
                    {s.active ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditStaff(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
  const conflicts = detectShiftConflicts(staff);

  setShiftWarnings(conflicts);

  if (conflicts.length) {
    alert("⚠ Shift conflicts detected. Please review.");
    return;
  }

  alert("Staff saved successfully (backend later)");
  setShowEditStaff(false);
}}
              className="px-4 py-2 bg-orange-500 text-white rounded"
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
