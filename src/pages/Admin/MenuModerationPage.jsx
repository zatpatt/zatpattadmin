// src/pages/Admin/MenuModerationPage.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// List of keywords to auto-flag illegal items
const ILLEGAL_KEYWORDS = ["alcohol", "cigarette", "drugs", "tobacco", "weed"];

export default function MenuModerationPage() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Beverages",
      items: [
        {
          id: 101,
          name: "Cold Coffee",
          price: 120,
          approved: true,
          stock: true,
          visible: true,
          discount: 0,
          image: "https://via.placeholder.com/80",
          priceLog: [],
          illegal: false,
        },
        {
          id: 102,
          name: "Fresh Lime Soda",
          price: 80,
          approved: false,
          stock: true,
          visible: true,
          discount: 10,
          image: "https://via.placeholder.com/80",
          priceLog: [],
          illegal: false,
        },
      ],
    },
    {
      id: 2,
      name: "Snacks",
      items: [
        {
          id: 201,
          name: "Veg Sandwich",
          price: 90,
          approved: true,
          stock: false,
          visible: true,
          discount: 0,
          image: "https://via.placeholder.com/80",
          priceLog: [],
          illegal: false,
        },
      ],
    },
  ]);

  const [newCategory, setNewCategory] = useState("");

  // Utility: Check if name contains illegal keywords
  const checkIllegal = (name) => {
    return ILLEGAL_KEYWORDS.some((word) =>
      name.toLowerCase().includes(word.toLowerCase())
    );
  };

  // Update illegal status whenever categories change
  useEffect(() => {
    setCategories((prevCats) =>
      prevCats.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({
          ...item,
          illegal: checkIllegal(item.name),
        })),
      }))
    );
  }, []);

  // Add Category
  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([
      ...categories,
      { id: Date.now(), name: newCategory, items: [] },
    ]);
    setNewCategory("");
  };

  // Edit Category Name
  const editCategory = (id) => {
    const newName = prompt("Enter new category name");
    if (!newName) return;
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  // Delete Category
  const deleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  // Add Item
  const addItem = (catId) => {
    const name = prompt("Item name");
    if (!name) return;
    const price = parseFloat(prompt("Item price"));
    const discount = parseInt(prompt("Discount %", 0));
    const image = prompt("Item image URL") || "https://via.placeholder.com/80";

    setCategories(
      categories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              items: [
                ...cat.items,
                {
                  id: Date.now(),
                  name,
                  price,
                  approved: false,
                  stock: true,
                  visible: true,
                  discount,
                  image,
                  priceLog: [],
                  illegal: checkIllegal(name),
                },
              ],
            }
          : cat
      )
    );
  };

  // Edit Item
  const editItem = (catId, itemId) => {
    const cat = categories.find((c) => c.id === catId);
    const item = cat.items.find((i) => i.id === itemId);
    const name = prompt("Edit item name", item.name);
    if (!name) return;
    const price = parseFloat(prompt("Edit item price", item.price));
    const discount = parseInt(prompt("Discount %", item.discount));
    const image = prompt("Image URL", item.image);

    setCategories(
      categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId
                  ? {
                      ...i,
                      name,
                      price,
                      discount,
                      image,
                      illegal: checkIllegal(name),
                      priceLog: [...i.priceLog, i.price],
                    }
                  : i
              ),
            }
          : c
      )
    );
  };

  // Delete Item
  const deleteItem = (catId, itemId) => {
    setCategories(
      categories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c
      )
    );
  };

  // Toggle Approval
  const toggleApproval = (catId, itemId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              items: cat.items.map((i) =>
                i.id === itemId ? { ...i, approved: !i.approved } : i
              ),
            }
          : cat
      )
    );
  };

  // Toggle Stock
  const toggleStock = (catId, itemId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              items: cat.items.map((i) =>
                i.id === itemId ? { ...i, stock: !i.stock } : i
              ),
            }
          : cat
      )
    );
  };

  // Toggle Visibility
  const toggleVisibility = (catId, itemId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              items: cat.items.map((i) =>
                i.id === itemId ? { ...i, visible: !i.visible } : i
              ),
            }
          : cat
      )
    );
  };

  // Reorder Categories
  const moveCategory = (id, dir) => {
    const idx = categories.findIndex((c) => c.id === id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === categories.length - 1))
      return;
    const newCats = [...categories];
    const temp = newCats[idx + dir];
    newCats[idx + dir] = newCats[idx];
    newCats[idx] = temp;
    setCategories(newCats);
  };

  // Reorder Items
  const moveItem = (catId, itemId, dir) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id !== catId) return cat;
        const idx = cat.items.findIndex((i) => i.id === itemId);
        if ((dir === -1 && idx === 0) || (dir === 1 && idx === cat.items.length - 1))
          return cat;
        const newItems = [...cat.items];
        const temp = newItems[idx + dir];
        newItems[idx + dir] = newItems[idx];
        newItems[idx] = temp;
        return { ...cat, items: newItems };
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">🍔 Menu Management</h2>

      {/* CATEGORY ADD */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Plus size={18} /> Add New Category
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <button
            onClick={addCategory}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl"
          >
            Add
          </button>
        </div>
      </div>

      {/* CATEGORY LIST */}
      {categories.map((category) => (
        <div key={category.id} className="bg-white p-4 rounded-2xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ArrowUpDown size={16} />
              {category.name}
            </h3>
            <div className="flex gap-3">
              <button
                className="p-2 bg-blue-100 text-blue-600 rounded-lg flex items-center gap-1"
                onClick={() => editCategory(category.id)}
              >
                <Edit size={16} /> Edit
              </button>
              <button
                className="p-2 bg-red-100 text-red-600 rounded-lg flex items-center gap-1"
                onClick={() => deleteCategory(category.id)}
              >
                <Trash2 size={16} /> Delete
              </button>
              <div className="flex flex-col ml-2">
                <ArrowUp
                  size={16}
                  className="cursor-pointer text-gray-600"
                  onClick={() => moveCategory(category.id, -1)}
                />
                <ArrowDown
                  size={16}
                  className="cursor-pointer text-gray-600"
                  onClick={() => moveCategory(category.id, 1)}
                />
              </div>
            </div>
          </div>

          {/* ITEM LIST */}
          <div className="space-y-2">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 flex justify-between items-center"
              >
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      ₹{item.price}{" "}
                      {item.discount > 0 && (
                        <span className="text-green-600">({item.discount}% off)</span>
                      )}
                    </div>
                    <div className="mt-1 flex gap-2 text-xs">
                      <span
                        className={`px-2 py-1 rounded ${
                          item.approved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.approved ? "Approved" : "Pending Approval"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded ${
                          item.stock ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.stock ? "In Stock" : "Out of Stock"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded ${
                          item.visible ? "bg-gray-100 text-gray-700" : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.visible ? "Visible" : "Hidden"}
                      </span>
                      {item.illegal && (
                        <span className="px-2 py-1 rounded bg-red-200 text-red-800">
                          Illegal
                        </span>
                      )}
                    </div>
                    {item.priceLog.length > 0 && (
                      <div className="text-gray-400 text-xs mt-1">
                        Price changes: {item.priceLog.join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex gap-2">
                    <button
                      className={`p-2 rounded-lg ${
                        item.approved ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                      }`}
                      onClick={() => toggleApproval(category.id, item.id)}
                    >
                      {item.approved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button
                      className={`p-2 rounded-lg ${
                        item.stock ? "bg-gray-200 text-gray-700" : "bg-orange-100 text-orange-600"
                      }`}
                      onClick={() => toggleStock(category.id, item.id)}
                    >
                      {item.stock ? "✓" : "!"}
                    </button>
                    <button
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                      onClick={() => editItem(category.id, item.id)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 bg-red-100 text-red-600 rounded-lg"
                      onClick={() => deleteItem(category.id, item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <ArrowUp
                      size={16}
                      className="cursor-pointer text-gray-600"
                      onClick={() => moveItem(category.id, item.id, -1)}
                    />
                    <ArrowDown
                      size={16}
                      className="cursor-pointer text-gray-600"
                      onClick={() => moveItem(category.id, item.id, 1)}
                    />
                    <button
                      className={`px-2 py-1 rounded-lg text-xs ${
                        item.visible ? "bg-gray-200 text-gray-700" : "bg-orange-100 text-orange-700"
                      }`}
                      onClick={() => toggleVisibility(category.id, item.id)}
                    >
                      {item.visible ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* ADD ITEM */}
            <button
              className="mt-2 w-full py-2 border border-orange-400 text-orange-600 rounded-xl"
              onClick={() => addItem(category.id)}
            >
              + Add New Item
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
