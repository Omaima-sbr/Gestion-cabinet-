import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiBriefcase, FiPackage, FiFileText, FiClipboard, FiLogOut, FiMenu } from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { id: "dashboard", icon: <FiHome />, label: "Dashboard", path: "/" },
    { id: "cabinets", icon: <FiBriefcase />, label: "Gestion Cabinets", path: "/cabinets" },
    { id: "users", icon: <FiUsers />, label: "Gestion Utilisateurs", path: "/utilisateurs" },
    { id: "medicaments", icon: <FiPackage />, label: "Médicaments", path: "/medicaments" },
    { id: "invoices", icon: <FiFileText />, label: "Factures", path: "/factures", badge: "12" },
    { id: "candidatures", icon: <FiClipboard />, label: "Candidatures", path: "/candidatures" },
  ];

  const getActivePath = (path) => location.pathname === path;

  return (
    <aside className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-all duration-300 ${isOpen ? "w-72" : "w-24"} shadow-xl`}>
      {/* Logo + Toggle */}
      <div className="h-24 flex items-center justify-between px-6 border-b border-slate-700/50 relative overflow-hidden">
        {isOpen && (
          <>
            <div className="z-10">
              <span className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                MediAdmin
              </span>
              <p className="text-blue-300/60 text-sm mt-2 font-medium">Administration Professionnelle</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
          </>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-10 p-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg group"
        >
          <FiMenu size={28} className="group-hover:rotate-180 transition-transform duration-300" />
        </button>
      </div>

      {/* Menu Items avec plus d'espace */}
      <nav className="flex-1 flex flex-col gap-4 p-6">
        {menuItems.map((item) => {
          const isActive = getActivePath(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                relative flex items-center gap-5 px-6 py-4 rounded-xl transition-all duration-200 text-base font-medium
                ${isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50"
                }
                ${hoveredItem === item.id && !isActive ? 'transform translate-x-1' : ''}
              `}
            >
              {/* Effet de fond animé pour l'état actif */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl animate-pulse"></div>
              )}
              
              <div className={`text-2xl transition-transform duration-200 ${hoveredItem === item.id ? 'scale-105' : ''}`}>
                {item.icon}
              </div>
              
              {isOpen && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-base font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              
              {/* Indicateur d'état actif */}
              {isActive && isOpen && (
                <div className="absolute right-5 w-2 h-3/4 bg-gradient-to-b from-white to-blue-100 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout avec plus d'espace */}
      <div className="p-6 border-t border-slate-700/50">
        <button
          onClick={() => navigate("/logout")}
          className="group relative flex items-center gap-5 w-full px-6 py-4 rounded-xl text-slate-300 hover:text-white transition-all duration-200 overflow-hidden text-base font-medium"
        >
          {/* Fond de dégradé au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          <FiLogOut className="text-2xl group-hover:scale-105 transition-transform duration-200" />
          {isOpen && (
            <>
              <span className="flex-1 text-left">Déconnexion</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-red-300 rounded-full animate-pulse"></div>
              </div>
            </>
          )}
        </button>
        
        {isOpen && (
          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm">Version 2.1.0</p>
            <p className="text-slate-500 text-xs mt-1">© 2024 MediAdmin</p>
          </div>
        )}
      </div>
    </aside>
  );
}