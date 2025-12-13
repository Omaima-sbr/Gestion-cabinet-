import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Acceuil from './pages/acceuil';
import Form from './pages/Form';

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

                {/* Redirection pour les routes non trouvées */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}