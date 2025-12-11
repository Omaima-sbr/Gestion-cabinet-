import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/login';

const LoginPage = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(true);

    // Si l'utilisateur est déjà connecté, rediriger immédiatement
    useEffect(() => {
        if (user) {
            console.log('👤 Utilisateur connecté détecté, redirection...');
            const roleRoutes = {
                'SECRETAIRE': '/secretaire',
                'MEDECIN': '/medecin',
                'ADMINISTRATEUR': '/admin'
            };

            const redirectPath = roleRoutes[user.role] || '/';
            console.log(`🔀 Redirection vers: ${redirectPath}`);
            navigate(redirectPath, { replace: true });
        }
    }, [user, navigate]);

    const handleLoginSuccess = async (userData) => {
        console.log('✅ LoginPage - Données reçues:', userData);

        try {
            // Mettre à jour le contexte d'authentification
            console.log('🔄 Appel de login() du contexte...');
            const savedUser = await login(userData);
            console.log('✅ login() terminé, user sauvegardé:', savedUser);

            // ✅ REDIRECTION IMMÉDIATE ICI (ne pas attendre le useEffect)
            const roleRoutes = {
                'SECRETAIRE': '/secretaire',
                'MEDECIN': '/medecin',
                'ADMINISTRATEUR': '/admin'
            };

            const redirectPath = roleRoutes[savedUser.role] || '/';
            console.log(`🔀 Redirection immédiate vers: ${redirectPath}`);
            navigate(redirectPath, { replace: true });

        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour du contexte:', error);
            alert('Erreur lors de la connexion. Veuillez réessayer.');
        }
    };

    const handleClose = () => {
        console.log('❌ Fermeture du modal');
        setShowModal(false);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
            {showModal && (
                <LoginModal
                    onClose={handleClose}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </div>
    );
};

export default LoginPage;