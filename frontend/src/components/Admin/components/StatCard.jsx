// src/components/Admin/components/StatCard.jsx

export default function StatCard({ title, value, change, icon, color = "blue" }) {
  const iconColors = {
    blue: "text-blue-500",
    green: "text-green-500",
    orange: "text-orange-500",
    purple: "text-purple-500",
  }

  const changeColor = change.startsWith("+") ? "text-green-600" : "text-red-600"

  return (
    <div className="bg-white p-10 rounded-lg shadow-sm border border-slate-200 min-h-40">
      {/* Header: Title et Icon */}
      <div className="flex items-start justify-between mb-12">
        <p className="text-sm text-slate-600 font-medium">{title}</p>
        <div className={`text-2xl ${iconColors[color]}`}>{icon}</div>
      </div>

      {/* Footer: Value et Change */}
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-slate-900">{value}</p>
        <p className={`text-sm font-semibold ${changeColor}`}>{change}</p>
      </div>
    </div>
  )
}