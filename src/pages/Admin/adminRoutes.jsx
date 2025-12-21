//src\pages\Admin\adminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminLayout from "./AdminLayout";

/* === CORE PAGES === */
import DashboardPage from "./DashboardPage";
import OrdersPage from "./OrdersPage";
import MerchantsPage from "./Merchants/MerchantsPage";
import DeliveryPartnersPage from "./DeliveryPartnersPage";
import RefundsPage from "./RefundsPage";
import PromotionsPage from "./PromotionsPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import CustomerListPage from "./Customers/CustomerListPage";
import CustomerDetailsPage from "./Customers/CustomerDetailsPage";
import MerchantDetailPage from "./Merchants/MerchantDetailPage";
import AddMerchantPage from "./Merchants/AddMerchantPage";
import MerchantMenuApprovalPage from "./Merchants/MerchantMenuApprovalPage";
import MerchantSettlementsPage from "./Merchants/MerchantSettlementsPage";
import MerchantRatingsPage from "./Merchants/MerchantRatingsPage";
import MerchantCategoriesPage from "./Merchants/MerchantCategoriesPage";
import MenuModerationPage from "./MenuModerationPage"; // index.jsx resolves
import FinancePage from "./FinancePage"; // import the new tabbed finance page
import ComplaintsPage from "./ComplaintsPage";
import SystemPage from "./SystemPage"; // <-- import the new page
import AnalyticsPage from "./AnalyticsPage"; // <-- add this
import SupportTicketsPage from "./SupportTicketsPage"; // <-- import SupportTicketsPage

/* === DARK STORE CONTEXT === */
import { DarkStoreProvider } from "./DarkStore/DarkStoreContext";

/* === DARK STORE PAGES === */
import DarkStoreInventoryPage from "./DarkStore/DarkStoreInventoryPage";
import PickingPackingPage from "./DarkStore/PickingPackingPage";
import DarkStoreAnalytics from "./DarkStore/DarkStoreAnalytics";
import DarkStoresPage from "./DarkStore/DarkStoresPage";
import CreateDarkStorePage from "./DarkStore/CreateDarkStorePage";
import DarkStoreDetailPage from "./DarkStore/DarkStoreDetailPage";
import PincodeStoreMappingPage from "./DarkStore/PincodeStoreMappingPage"

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <DarkStoreProvider>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="delivery" element={<DeliveryPartnersPage />} />
        <Route path="menu" element={<MenuModerationPage />} />
        <Route path="refunds" element={<RefundsPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="customers/:id" element={<CustomerDetailsPage />} />
        <Route path="merchants" element={<MerchantsPage />} />
        <Route path="merchants/add" element={<AddMerchantPage />} />
        <Route path="merchant/:id" element={<MerchantDetailPage />} />
        <Route path="merchants/menu-approval" element={<MerchantMenuApprovalPage />} />
        <Route path="merchants/settlements" element={<MerchantSettlementsPage />} />
        <Route path="merchants/ratings" element={<MerchantRatingsPage />} />
        <Route path="merchants/categories" element={<MerchantCategoriesPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="/system" element={<SystemPage />} /> {/* THIS */}
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="support" element={<SupportTicketsPage />} />
        <Route path="dark-stores" element={<DarkStoresPage />} />
        <Route path="dark-stores/new" element={<CreateDarkStorePage />} />
        <Route path="dark-stores/:storeId" element={<DarkStoreDetailPage />} />
        <Route path="pincodes" element={<PincodeStoreMappingPage />} />
        <Route path="dark-stores/analytics" element={<DarkStoreAnalytics />} />
        <Route path="dark-stores/:storeId/picking" element={<PickingPackingPage />} />
        <Route path="dark-stores/:storeId/inventory" element={<DarkStoreInventoryPage />} />
      </Routes>
      </DarkStoreProvider>
    </AdminLayout>
  );
}
