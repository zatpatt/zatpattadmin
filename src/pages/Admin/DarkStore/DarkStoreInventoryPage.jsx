// //src\pages\Admin\DarkStore\DarkStoreInventoryPage.jsx
// import React, { useState } from "react";
// import BarcodeScanner from "../../../components/BarcodeScanner";
// import { INVENTORY_DB } from "./mockInventory";

// export default function DarkStoreInventoryPage() {
//   const [barcode, setBarcode] = useState("");
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState("");

//   const lookupSku = (code) => {
//     const item = INVENTORY_DB[code];
//     if (!item) {
//       setError("Item not found in inventory database.");
//       return;
//     }

//     setError("");
//     setItems((prev) => [
//       ...prev,
//       { barcode: code, ...item, qty: 1 },
//     ]);
//   };

//   const onScan = (code) => {
//     lookupSku(code);
//   };

//   const addManual = () => {
//     if (barcode.trim()) lookupSku(barcode.trim());
//     setBarcode("");
//   };

//   return (
//     <div className="p-6 space-y-6 max-w-4xl mx-auto">

//       <h1 className="text-xl font-bold">Dark Store Inventory</h1>

//       {/* Scanner */}
//       <div className="bg-white p-4 rounded-xl shadow space-y-2">
//         <h2 className="font-semibold">Barcode Scan</h2>
//         <BarcodeScanner onScan={onScan} />
//       </div>

//       {/* Manual Entry */}
//       <div className="bg-white p-4 rounded-xl shadow space-y-2">
//         <h2 className="font-semibold">Manual Barcode Entry</h2>
//         <div className="flex gap-2">
//           <input
//             className="border px-3 py-2 rounded-lg w-full"
//             placeholder="Enter barcode"
//             value={barcode}
//             onChange={(e) => setBarcode(e.target.value)}
//           />
//           <button
//             onClick={addManual}
//             className="px-4 bg-orange-500 text-white rounded-lg"
//           >
//             Add
//           </button>
//         </div>
//         {error && <p className="text-red-500 text-xs">{error}</p>}
//       </div>

//       {/* Batch Items */}
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h2 className="font-semibold mb-2">Batch Scanned Items</h2>

//         {items.length === 0 ? (
//           <p className="text-gray-500 text-sm">
//             No items scanned yet.
//           </p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="text-gray-500 border-b">
//               <tr>
//                 <th className="py-2">SKU</th>
//                 <th>Item</th>
//                 <th>Qty</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((i, idx) => (
//                 <tr key={idx} className="border-b">
//                   <td className="py-2 font-mono">{i.sku}</td>
//                   <td>{i.name}</td>
//                   <td>{i.qty}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Future Action */}
//       {items.length > 0 && (
//         <button className="w-full py-3 bg-green-600 text-white rounded-xl">
//           Save Inventory Update
//         </button>
//       )}
//     </div>
//   );
// }
