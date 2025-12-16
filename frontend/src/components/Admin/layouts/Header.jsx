// src/components/Admin/layouts/Header.jsx
import { useState, useEffect } from "react";

export default function Header({ user }) {
  const [gradientPosition, setGradientPosition] = useState(0);

  // Animation subtile du gradient
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 0.5) % 360); // Plus lent
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Initiales de l'utilisateur si pas d'avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-white/10" // Réduit de h-20 à h-16, px-8 à px-6
      style={{
        background: `linear-gradient(${gradientPosition}deg, rgba(12, 26, 54, 0.95), rgba(30, 58, 138, 0.95), rgba(30, 64, 175, 0.95))`,
        transition: "background 2s linear",
      }}
    >
      {/* Titre avec design amélioré */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-white tracking-wide drop-shadow-lg"> {/* Réduit de text-2xl à text-xl */}
          MediAdmin
        </h1>
        <p className="text-blue-100/80 text-xs font-medium mt-0.5"> {/* Réduit de text-sm à text-xs */}
          Tableau de Bord Administratif
        </p>
      </div>

      {/* Avatar dynamique avec halo amélioré */}
      <div className="relative group">
        <div className="flex items-center gap-3"> {/* Réduit de gap-4 à gap-3 */}
          <div className="text-right hidden md:block">
            <p className="text-white font-semibold text-sm">{user?.name || "Administrateur"}</p> {/* Ajouté text-sm */}
            <p className="text-blue-100/70 text-xs">{user?.role || "Super Admin"}</p> {/* Réduit de text-sm à text-xs */}
          </div>
          
          <div className="relative w-12 h-12 rounded-full cursor-pointer overflow-hidden"> {/* Réduit de w-14 h-14 à w-12 h-12 */}
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover border-2 border-white/80 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" // Réduit border-3 à border-2
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white to-blue-100 text-blue-800 font-bold text-lg uppercase shadow-xl border-2 border-white/80 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"> {/* Réduit text-xl à text-lg */}
                {initials}
              </div>
            )}

            {/* Halo animé amélioré */}
            <span className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-30 blur-lg animate-pulse-slow pointer-events-none"></span> {/* Réduit -inset-2 à -inset-1.5 */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-md animate-pulse pointer-events-none"></span> {/* Réduit blur-lg à blur-md */}
            
            {/* Indicateur en ligne */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-md"></div> {/* Réduit w-4 h-4 à w-3 h-3 */}
          </div>
        </div>

        {/* Tooltip amélioré */}
        <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 pointer-events-none"> {/* Réduit mt-4 à mt-2 */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-700/50 backdrop-blur-sm"> {/* Réduit text-sm à text-xs, rounded-xl à rounded-lg */}
            <div className="font-semibold mb-0.5">{user?.name || "Utilisateur"}</div>
            <div className="text-slate-300 text-xs">{user?.email || "admin@mediadmin.com"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}