import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo"></div>
                <h2>.   . Welcome to your cabinet</h2>
            </div>

            <div className="navbar-right">
                <button className="logout-btn" onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>
        </header>
    );
};

export default Navbar;
