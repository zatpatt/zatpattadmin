// // src/pages/Admin/DarkStore/PincodeStoreMappingPage.jsx
// import React, { useState } from "react";

// const MOCK_MAPPINGS = [
//   { pincode: "400053", city: "Mumbai", primaryStore: "DS001", fallbackStore: "DS002" },
//   { pincode: "400058", city: "Mumbai", primaryStore: "DS001", fallbackStore: null },
//   { pincode: "400601", city: "Thane", primaryStore: "DS002", fallbackStore: null },
// ];

// export default function PincodeStoreMappingPage() {
//   const [mappings] = useState(MOCK_MAPPINGS);
//   const [search, setSearch] = useState("");

//   const filtered = mappings.filter(
//     (m) =>
//       m.pincode.includes(search) ||
//       m.city.toLowerCase().includes(search.toLowerCase()) ||
//       m.primaryStore.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-4 max-w-6xl mx-auto space-y-4">
//       <h1 className="text-2xl font-bold">Pincode → Dark Store Mapping</h1>

//       <div className="bg-white rounded-2xl shadow p-4 space-y-3">
//         <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
//           <input
//             className="w-full sm:w-64 border border-gray-300 rounded-xl px-3 py-2 text-sm"
//             placeholder="Search by pincode, city or store ID..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <button
//             onClick={() => alert("In future: bulk upload CSV of pincode mappings")}
//             className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold"
//           >
//             Bulk Upload (CSV)
//           </button>
//         </div>

//         <table className="w-full text-sm">
//           <thead>
//             <tr className="text-left text-gray-500 border-b">
//               <th className="py-2">Pincode</th>
//               <th className="py-2">City</th>
//               <th className="py-2">Primary Store</th>
//               <th className="py-2">Fallback Store</th>
//               <th className="py-2 text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((m) => (
//               <tr key={m.pincode} className="border-b last:border-none">
//                 <td className="py-2">{m.pincode}</td>
//                 <td className="py-2">{m.city}</td>
//                 <td className="py-2">{m.primaryStore}</td>
//                 <td className="py-2">{m.fallbackStore || "-"}</td>
//                 <td className="py-2 text-right">
//                   <button
//                     className="text-xs text-orange-600 font-medium"
//                     onClick={() => alert(`In future: edit mapping for ${m.pincode}`)}
//                   >
//                     Edit →
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filtered.length === 0 && (
//           <p className="text-center text-gray-500 text-sm py-6">
//             No mappings found for this search.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
