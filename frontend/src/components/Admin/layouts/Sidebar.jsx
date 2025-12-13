// src/components/Admin/layouts/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom"
import { MdDashboard, MdApartment, MdPeople, MdLocalPharmacy, MdReceiptLong, MdNoteAdd, MdLogout } from "react-icons/md"
import { useState } from "react"

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { id: "dashboard", icon: <MdDashboard size={24} />, label: "Dashboard", path: "/" },
    { id: "cabinets", icon: <MdApartment size={24} />, label: "Gestion Cabinets", path: "/cabinets" },
    { id: "users", icon: <MdPeople size={24} />, label: "Gestion Utilisateurs", path: "/utilisateurs" },
    { id: "medicaments", icon: <MdLocalPharmacy size={24} />, label: "Médicaments", path: "/medicaments" },
    { id: "invoices", icon: <MdReceiptLong size={24} />, label: "Factures", path: "/factures" },
    { id: "candidatures", icon: <MdNoteAdd size={24} />, label: "Candidatures", path: "/candidatures" },
  ]

  const getActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <aside className="w-72 bg-slate-900 text-white overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
        <span className="text-2xl font-bold">MediAdmin</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-slate-800 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-6 space-y-3 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
              getActivePath(item.path)
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {item.icon}
            <span className="text-base font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-slate-800">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
          <MdLogout size={24} />
          <span className="text-base font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}