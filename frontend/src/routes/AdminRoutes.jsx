// AdminRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import AdminLayout from "../components/Admin/layouts/AdminLayout";
import Dashbord from "../components/Admin/pages/Dashbord";
import MedicalRequests from "../components/Admin/pages/MedicalRequests";
import MedicalManagement from "../components/Admin/pages/MedicalManagement";
import UserManagement from "../components/Admin/pages/UserManagement";
import MedecinManagement from "../components/Admin/pages/MedecinManagement";
import InvoicesManagement from "../components/Admin/pages/InvoicesManagement";

// Retourne un tableau de <Route>
const AdminRoutes = [
  <Route path="/admin" element={<AdminLayout />} key="admin">
    <Route index element={<Dashbord />} />
    <Route path="candidatures" element={<MedicalRequests />} />
    <Route path="cabinets" element={<MedicalManagement />} />
    <Route path="utilisateurs" element={<UserManagement />} />
    <Route path="medicaments" element={<MedecinManagement />} />
    <Route path="factures" element={<InvoicesManagement />} />
  </Route>
];

export default AdminRoutes;
