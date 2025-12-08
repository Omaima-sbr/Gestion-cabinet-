import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import apiService from '../../services/apiService.js';
import './Sidebar.css';

const Sidebar = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const count = await apiService.messagerie.countMessagesNonLus();
                setUnreadCount(count || 0);
            } catch (error) {
                console.error('Erreur lors de la récupération des messages non lus:', error);
                setUnreadCount(0);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const menu = [
        {
            label: "Dashboard",
            path: "/secretaire",
            icon: "📊",
            description: "Vue d'ensemble"
        },
        {
            label: "Patients",
            path: "/secretaire/patients",
            icon: "🧑‍⚕️",
            description: "Gestion des patients"
        },
        {
            label: "Rendez-vous",
            path: "/secretaire/rendez-vous",
            icon: "📅",
            description: "Calendrier"
        },
        {
            label: "Messagerie",
            path: "/secretaire/messagerie",
            icon: "💬",
            description: "Messages",
            badge: unreadCount
        },
        {
            label: "Factures",
            path: "/secretaire/factures",
            icon: "💳",
            description: "Facturation"
        },
        {
            label: "Paramètres",
            path: "/secretaire/parametres",
            icon: "⚙️",
            description: "Configuration"
        },
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img
                        src="/defaultLogo.png"
                        alt="Logo"
                        className="logo-image"
                    />

                    {/* Texte affiché seulement si non-collapsé */}
                    {!isCollapsed && (
                        <span className="logo-text">Cabinet Médical</span>
                    )}
                </div>
            </div>

            <button
                className="sidebar-toggle"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Développer" : "Réduire"}
            >
                {isCollapsed ? '→' : '←'}
            </button>

            <nav className="sidebar-menu">
                {menu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/secretaire"}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                        title={isCollapsed ? item.label : ''}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        {!isCollapsed && (
                            <div className="sidebar-content">
                                <span className="sidebar-label">{item.label}</span>
                                <span className="sidebar-description">{item.description}</span>
                            </div>
                        )}
                        {item.badge > 0 && (
                            <span className="sidebar-badge">{item.badge}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                {!isCollapsed && (
                    <div className="sidebar-user">
                        <div className="user-avatar">👤</div>
                        <div className="user-info">
                            <div className="user-name">Secrétaire</div>
                            <div className="user-role">Administrateur</div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;