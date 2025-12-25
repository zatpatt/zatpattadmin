// // src/pages/Admin/DarkStore/DarkStoresPage.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const MOCK_STORES = [
//   {
//     id: "DS001",
//     name: "Zatpatt Darkstore - Andheri",
//     city: "Mumbai",
//     is_active: true,
//     pincodes: 12,
//   },
// ];

// export default function DarkStoresPage() {
//   const navigate = useNavigate();
//   const [stores] = useState(MOCK_STORES);

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Darkstores</h1>
//         <button
//           onClick={() => navigate("/admin/dark-stores/create")}
//           className="bg-orange-500 text-white px-4 py-2 rounded-xl"
//         >
//           + Add Darkstore
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow">
//         <table className="w-full text-sm">
//           <thead className="border-b text-gray-500">
//             <tr>
//               <th className="p-3">ID</th>
//               <th>Name</th>
//               <th>City</th>
//               <th>Status</th>
//               <th className="text-right p-3">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stores.map((s) => (
//               <tr key={s.id} className="border-b">
//                 <td className="p-3">{s.id}</td>
//                 <td>{s.name}</td>
//                 <td>{s.city}</td>
//                 <td>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs ${
//                       s.is_active
//                         ? "bg-green-100 text-green-700"
//                         : "bg-gray-100 text-gray-500"
//                     }`}
//                   >
//                     {s.is_active ? "Active" : "Inactive"}
//                   </span>
//                 </td>
//                 <td className="p-3 text-right">
//                   <button
//                     onClick={() => navigate(`/admin/dark-stores/${s.id}`)}
//                     className="text-orange-600 text-xs"
//                   >
//                     Manage →
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
