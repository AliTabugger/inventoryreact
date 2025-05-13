import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./LoginPage";
import DashboardLayout from "./DashboardLayout";
import DashboardHome from "./DashboardHome";
import PartsManagement from "./PartsManagement";
import CategoriesManagement from "./CategoriesManagement";
import SuppliersManagement from "./SuppliersManagement";
import "bootstrap/dist/css/bootstrap.min.css";
import SalesPage from "./SalesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/parts" element={<PartsManagement />} />
            <Route
              path="/dashboard/categories"
              element={<CategoriesManagement />}
            />
            <Route
              path="/dashboard/suppliers"
              element={<SuppliersManagement />}
            />
            <Route path="/dashboard/sales" element={<SalesPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
