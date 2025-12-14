// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/Admin/layouts/AdminLayout";
import Dashbord from "./components/Admin/pages/Dashbord";
import MedicalRequests from "./components/Admin/pages/MedicalRequests";
import MedicalManagement from "./components/Admin/pages/MedicalManagement";
import UserManagement from "./components/Admin/pages/UserManagement";
import MedecinManagement from "./components/Admin/pages/MedecinManagement";
import InvoicesManagement from "./components/Admin/pages/InvoicesManagement";

import Acceuil from "./components/Admin/pages/acceuil";
import Form from "./components/Admin/pages/Form";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Acceuil />} />
        <Route path="/inscription" element={<Form />} />

        {/* Routes admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashbord />} />
          <Route path="candidatures" element={<MedicalRequests />} />
          <Route path="cabinets" element={<MedicalManagement />} />
          <Route path="utilisateurs" element={<UserManagement />} />
          <Route path="medicaments" element={<MedecinManagement />} />
          <Route path="factures" element={<InvoicesManagement />} />
        </Route>

        {/* Redirection pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
