import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Acceuil from './pages/acceuil';
import Form from './pages/Form';
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";

// Importez votre fichier de routes Admin (ajustez le chemin selon votre structure)
import AdminRoutes from '../routes/AdminRoutes';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Page d'accueil */}
                <Route path="/" element={<Acceuil />} />

                {/* Formulaire d'inscription */}
                <Route path="/inscription" element={<Form />} />

                {/* Authentification */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* 👇 AJOUTEZ CECI : Intégration des routes Admin */}
                {/* Le "/*" permet à AdminRoutes de gérer les sous-chemins (ex: /admin/dashboard) */}
                <Route path="/admin/*" element={<AdminRoutes />} />
                {/* Redirection pour les routes non trouvées (DOIT ÊTRE EN DERNIER) */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}