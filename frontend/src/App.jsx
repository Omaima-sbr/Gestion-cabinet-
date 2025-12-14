import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/acceuil';
import MedecinRoutes from "../routes/MedecinRoutes";

function App() {
    return (
        <Router>
            <Routes>
                {/* Page d'accueil avec login */}
                <Route path="/" element={<Home />} />
                
                {/* Routes médecin avec sous-routes */}
                <Route path="/medecin/*" element={<MedecinRoutes />} />
                
                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;