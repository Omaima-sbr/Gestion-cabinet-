// App.jsx (version simplifiée)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './components/pages/LoginPage';
import SecretaryRoutes from '../routes/SecretaryRoutes';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

import './App.css';

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="app">
            {user ? (
                <>
                    <Navbar />
                    <div className="app-container">
                        <Sidebar />
                        <main className="main-content">
                            <Routes>
                                <Route path="/secretaire/*" element={<SecretaryRoutes />} />
                                <Route path="/" element={<Navigate to="/secretaire" replace />} />
                                <Route path="*" element={<Navigate to="/secretaire" replace />} />
                            </Routes>
                        </main>
                    </div>
                </>
            ) : (
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            )}
        </div>
    );
}

export default App;