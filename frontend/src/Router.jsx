import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Acceuil from './pages/acceuil';
import Form from './pages/Form';
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
/**
 * ROUTEUR PRINCIPAL DE L'APPLICATION
 * Gère la navigation entre la page d'accueil et le formulaire d'inscription
 */
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Page d'accueil */}
                <Route path="/" element={<Acceuil />} />

                {/* Page de formulaire d'inscription */}
                <Route path="/inscription" element={<Form />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Redirection pour les routes non trouvées */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}