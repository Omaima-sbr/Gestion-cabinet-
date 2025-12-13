import { MdNotifications, MdSettings } from "react-icons/md"

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-slate-900">Tableau de Bord Administrateur</h1>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <MdNotifications size={24} />
        </button>
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <MdSettings size={24} />
        </button>
        <div className="w-10 h-10 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"></div>
      </div>
    </header>
  )
}