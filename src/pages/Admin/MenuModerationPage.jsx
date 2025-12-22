import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Trash2,
} from "lucide-react";

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

/* ---------------- MOCK DATA (5 RESTAURANTS, 10+ ITEMS) ---------------- */
const INITIAL_RESTAURANTS = [
  {
    id: 1,
    name: "Pizza Hut",
    city: "Mumbai",
    menu: [
      {
        category: "Pizzas",
        items: [
          {
            id: 101,
            name: "Margherita Pizza",
            price: 249,
            status: "pending",
            uploadedAt: Date.now() - 30 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
          {
            id: 102,
            name: "Beer Pizza",
            price: 399,
            status: "blocked",
            uploadedAt: Date.now() - 2 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Burger King",
    city: "Pune",
    menu: [
      {
        category: "Burgers",
        items: [
          {
            id: 201,
            name: "Veg Whopper",
            price: 179,
            status: "pending",
            uploadedAt: Date.now() - 26 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
          {
            id: 202,
            name: "Chicken Whopper",
            price: 219,
            status: "pending",
            uploadedAt: Date.now() - 4 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "McDonald's",
    city: "Delhi",
    menu: [
      {
        category: "Meals",
        items: [
          {
            id: 301,
            name: "McAloo Tikki",
            price: 59,
            status: "pending",
            uploadedAt: Date.now() - 28 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
          {
            id: 302,
            name: "Cigarette Combo",
            price: 99,
            status: "blocked",
            uploadedAt: Date.now() - 10 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Subway",
    city: "Bangalore",
    menu: [
      {
        category: "Sandwiches",
        items: [
          {
            id: 401,
            name: "Veggie Delight",
            price: 199,
            status: "pending",
            uploadedAt: Date.now() - 3 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
          {
            id: 402,
            name: "Chicken Teriyaki",
            price: 249,
            status: "pending",
            uploadedAt: Date.now() - 27 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Local Wine Shop",
    city: "Goa",
    menu: [
      {
        category: "Beverages",
        items: [
          {
            id: 501,
            name: "Red Wine Bottle",
            price: 899,
            status: "blocked",
            uploadedAt: Date.now() - 5 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
          {
            id: 502,
            name: "Whiskey Shot",
            price: 199,
            status: "blocked",
            uploadedAt: Date.now() - 40 * 60 * 60 * 1000,
            removed: false,
            auditLog: [],
          },
        ],
      },
    ],
  },
];

/* ================= COMPONENT ================= */
export default function MenuModerationPage() {
  const [restaurants, setRestaurants] = useState(INITIAL_RESTAURANTS);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  /* ---------------- HELPERS ---------------- */
  const isIllegal = (name) =>
    ILLEGAL_KEYWORDS.some((k) =>
      name.toLowerCase().includes(k)
    );

  /* ---------------- AUTO APPROVE SAFE ITEMS ---------------- */
  useEffect(() => {
    setRestaurants((prev) =>
      prev.map((r) => ({
        ...r,
        menu: r.menu.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => {
            if (
              item.status === "pending" &&
              !isIllegal(item.name)
            ) {
              return {
                ...item,
                status: "approved",
                auditLog: [
                  ...item.auditLog,
                  {
                    action: "auto_approved",
                    by: "System",
                    at: new Date().toLocaleString(),
                  },
                ],
              };
            }
            return item;
          }),
        })),
      }))
    );
  }, []);

  /* ---------------- FILTER RESTAURANTS ---------------- */
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) =>
      `${r.name} ${r.city}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [restaurants, search]);

  /* ---------------- REMOVE ITEM ONLY ---------------- */
  const removeItem = (catIdx, itemId) => {
    setSelected((prev) => ({
      ...prev,
      menu: prev.menu.map((cat, i) =>
        i !== catIdx
          ? cat
          : {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      removed: true,
                      auditLog: [
                        ...item.auditLog,
                        {
                          action: "removed",
                          by: "Admin",
                          at: new Date().toLocaleString(),
                        },
                      ],
                    }
                  : item
              ),
            }
      ),
    }));
  };

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
              onClick={() => setSelected(r)}
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

      {selected.menu.map((cat, catIdx) => (
        <div
          key={catIdx}
          className="bg-white p-4 rounded-xl shadow"
        >
          <h3 className="font-semibold mb-3">
            {cat.category}
          </h3>

          {cat.items.map((item) => {
            if (item.removed) return null;

            const hoursPassed =
              (Date.now() - item.uploadedAt) /
              (1000 * 60 * 60);
            const slaBreached =
              hoursPassed > SLA_HOURS;
            const illegal = isIllegal(item.name);

            return (
              <div
                key={item.id}
                className="border rounded-lg p-3 mb-3 flex justify-between"
              >
                <div>
                  <div className="font-medium">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    ₹{item.price}
                  </div>

                  <div className="flex gap-2 text-xs mt-1">
                    {slaBreached && (
                      <span className="text-red-600 flex items-center gap-1">
                        <Clock size={12} /> SLA Breached
                      </span>
                    )}

                    {illegal && (
                      <span className="text-red-600 flex items-center gap-1">
                        <ShieldAlert size={12} /> Restricted
                      </span>
                    )}

                    {!illegal && (
                      <span className="text-green-600">
                        Auto Approved
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      removeItem(catIdx, item.id)
                    }
                    className="p-2 bg-red-100 text-red-600 rounded"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
