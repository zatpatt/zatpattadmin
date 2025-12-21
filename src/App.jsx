// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminRoutes from "./pages/Admin/adminRoutes";
import AdminLoginPage from "./pages/Admin/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Admin Login SHOULD NOT be inside /admin/* */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
//import OrdersList from './components/OrdersList';

// function App() {
//   return (
//     <div className="App">
//       <OrdersList />
//     </div>
//   );
// }

// export default App;