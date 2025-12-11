import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onMenuToggle, isSidebarOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button
                    className="navbar-menu-toggle"
                    onClick={onMenuToggle}
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? '✕' : '☰'}
                </button>
                <h1 className="navbar-title">Cabinet Médical</h1>
            </div>

            <div className="navbar-center">
                {/* Espace pour recherche ou autres éléments */}
            </div>

            <div className="navbar-right">
                <button className="navbar-btn" title="Notifications">
                    <span>🔔</span>
                </button>

                <div className="navbar-user">
                    <div className="navbar-avatar">
                        {user?.login?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="navbar-user-info">
                        <div className="navbar-user-name">{user?.login || 'Utilisateur'}</div>
                        <div className="navbar-user-role">
                            {user?.role === 'SECRETAIRE' ? 'Secrétaire' :
                                user?.role === 'MEDECIN' ? 'Médecin' :
                                    user?.role === 'ADMINISTRATEUR' ? 'Administrateur' :
                                        'Utilisateur'}
                        </div>
                    </div>
                </div>

                <button
                    className="navbar-btn navbar-logout"
                    onClick={handleLogout}
                    title="Déconnexion"
                >
                    <span>🚪</span>
                    <span className="logout-text">Déconnexion</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;