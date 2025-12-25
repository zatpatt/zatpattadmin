// //src\pages\Admin\DarkStore\DarkStoreAnalytics.jsx
// import React from "react";

// const storeStats = [
//   { store: "Vasind", orders: 320, stockValue: 125000 },
//   { store: "Shahapur", orders: 180, stockValue: 83000 },
// ];

// export default function DarkStoreAnalytics() {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow">
//       <h2 className="text-lg font-semibold mb-4">Dark Store Performance</h2>

//       <table className="w-full text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3">Store</th>
//             <th className="p-3">Orders Today</th>
//             <th className="p-3">Inventory Value (₹)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {storeStats.map(s => (
//             <tr key={s.store} className="border-t">
//               <td className="p-3">{s.store}</td>
//               <td className="p-3">{s.orders}</td>
//               <td className="p-3">₹ {s.stockValue}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
