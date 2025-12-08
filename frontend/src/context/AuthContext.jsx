import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Ignorer le token pour le test
        setLoading(false);
    }, []);

    const login = async (loginData) => {
        // Ignorer la requête réelle, créer un utilisateur fictif
        const fakeUser = {
            id: 1,
            name: 'Test User',
            email: loginData.email || 'test@example.com',
            role: 'SECRETAIRE' // Change le rôle si nécessaire : 'MEDECIN', 'ADMINISTRATEUR'
        };

        // Stocker dans localStorage pour simuler un login
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify(fakeUser));

        setUser(fakeUser);

        // Redirection selon le rôle
        if (fakeUser.role === 'SECRETAIRE') {
            navigate('/secretaire');
        } else if (fakeUser.role === 'MEDECIN') {
            navigate('/medecin');
        } else if (fakeUser.role === 'ADMINISTRATEUR') {
            navigate('/admin');
        }

        return { success: true };
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
