import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import StatCard from "../components/StatCard";
import { MdTrendingUp, MdWarning, MdPeople, MdAttachMoney } from "react-icons/md";
import DashboardService from "../services/DashboardService";

export default function Dashbord() {
  const [dashboardData, setDashboardData] = useState({
    totalCabinets: 0,
    activeUsers: 0,
    pendingAdminFactures: 0,
    totalRevenue: "0 MAD",
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // ⚡ Charger les données du dashboard au montage
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await DashboardService.getDashboardData();
        setDashboardData({
          totalCabinets: data.totalCabinets,
          activeUsers: data.activeUsers,
          pendingAdminFactures: data.pendingAdminFactures,
          totalRevenue: data.totalRevenue,
        });

        // Adapter monthlyData pour les graphiques (factures = adminFactures)
        const formattedMonthlyData = (data.monthlyData || []).map((m) => ({
          month: m.month,
          cabinets: m.cabinets,
          utilisateurs: m.utilisateurs,
          factures: m.adminFactures,
        }));
        setMonthlyData(formattedMonthlyData);

        setRecentActivities(data.recentActivities || []);
      } catch (error) {
        console.error("Erreur lors de la récupération du dashboard :", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Stats Cards - Single Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Cabinets"
          value={dashboardData.totalCabinets}
          change="+8% ce mois"
          icon={<MdTrendingUp size={24} />}
          color="blue"
        />
        <StatCard
          title="Utilisateurs Actifs"
          value={dashboardData.activeUsers}
          change="+12% ce mois"
          icon={<MdPeople size={24} />}
          color="green"
        />
        <StatCard
          title="Factures en Attente"
          value={dashboardData.pendingAdminFactures}
          change="-3% ce mois"
          icon={<MdWarning size={24} />}
          color="orange"
        />
        <StatCard
          title="Revenus Totaux"
          value={dashboardData.totalRevenue}
          change="+15% ce mois"
          icon={<MdAttachMoney size={24} />}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Monthly Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Croissance Mensuelle
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cabinets" fill="#3b82f6" />
              <Bar dataKey="utilisateurs" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Revenus Mensuels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="factures"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: "#a855f7", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Activités Récentes
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-slate-200 last:border-b-0"
            >
              <div>
                <p className="font-medium text-slate-900 text-sm">{activity.action}</p>
                <p className="text-xs text-slate-500">{activity.detail}</p>
              </div>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
