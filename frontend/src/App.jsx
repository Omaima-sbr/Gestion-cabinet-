import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/acceuil';
import LoginPage from './components/pages/LoginPage';
import SecretaryRoutes from '../routes/SecretaryRoutes';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';
import DebugAuth from './components/debug/DebugAuth';

import './App.css';
import './ProtectedLayout.css'; // CSS séparé pour les routes protégées

function App() {
    const { user, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    console.log('🎯 App.jsx - État actuel:', { user: user?.login, role: user?.role, loading });

    if (loading) {
        console.log('⏳ Chargement en cours...');
        return <LoadingSpinner />;
    }

    console.log('✅ Chargement terminé, user:', user);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Layout pour les routes protégées avec navbar et sidebar
    const ProtectedLayout = ({ children, role }) => (
        <div className="protected-layout">
            <Navbar
                onMenuToggle={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
            />
            <div className="app-container">
                <Sidebar
                    isMobileOpen={isSidebarOpen}
                    onClose={closeSidebar}
                />
                <main className="main-content" onClick={closeSidebar}>
                    {children}
                </main>
            </div>
        </div>
    );

    return (
        <div className="app">
            <DebugAuth />
            <Routes>
                {/* Page d'accueil publique - SANS layout protégé */}
                <Route
                    path="/"
                    element={
                        user ? (
                            <Navigate to={`/${user.role.toLowerCase()}`} replace />
                        ) : (
                            <Home />
                        )
                    }
                />

                {/* Page de login - SANS layout protégé */}
                <Route
                    path="/login"
                    element={
                        user ? (
                            <Navigate to={`/${user.role.toLowerCase()}`} replace />
                        ) : (
                            <LoginPage />
                        )
                    }
                />

                {/* Routes protégées - AVEC layout protégé */}
                {user ? (
                    <>
                        {/* Routes Secrétaire */}
                        <Route
                            path="/secretaire/*"
                            element={
                                user.role === 'SECRETAIRE' ? (
                                    <ProtectedLayout role="SECRETAIRE">
                                        <SecretaryRoutes />
                                    </ProtectedLayout>
                                ) : (
                                    <Navigate to={`/${user.role.toLowerCase()}`} replace />
                                )
                            }
                        />

                        {/* Routes Médecin */}
                        <Route
                            path="/medecin/*"
                            element={
                                user.role === 'MEDECIN' ? (
                                    <ProtectedLayout role="MEDECIN">
                                        <div className="page-container">
                                            <div className="page-header">
                                                <h1 className="page-title">Espace Médecin</h1>
                                                <p className="page-subtitle">Routes à implémenter</p>
                                            </div>
                                        </div>
                                    </ProtectedLayout>
                                ) : (
                                    <Navigate to={`/${user.role.toLowerCase()}`} replace />
                                )
                            }
                        />

                        {/* Routes Admin */}
                        <Route
                            path="/admin/*"
                            element={
                                user.role === 'ADMINISTRATEUR' ? (
                                    <ProtectedLayout role="ADMINISTRATEUR">
                                        <div className="page-container">
                                            <div className="page-header">
                                                <h1 className="page-title">Espace Administrateur</h1>
                                                <p className="page-subtitle">Routes à implémenter</p>
                                            </div>
                                        </div>
                                    </ProtectedLayout>
                                ) : (
                                    <Navigate to={`/${user.role.toLowerCase()}`} replace />
                                )
                            }
                        />

                        {/* Redirection par défaut */}
                        <Route
                            path="*"
                            element={<Navigate to={`/${user.role.toLowerCase()}`} replace />}
                        />
                    </>
                ) : (
                    // Rediriger vers login si non authentifié
                    <Route path="*" element={<Navigate to="/login" replace />} />
                )}
            </Routes>
        </div>
    );
}

export default App;