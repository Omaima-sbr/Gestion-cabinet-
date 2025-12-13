import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/dashboard";

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Injection automatique du token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Gestion erreur 401 = token expiré
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const DashboardService = {
  // ✅ Récupérer les stats globales et résumé mensuel
  getDashboardData: async () => {
    try {
      const response = await api.get("/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du dashboard:", error);
      throw error;
    }
  },

  // ✅ Récupérer le résumé mensuel pour les graphiques
  getMonthlySummary: async () => {
    try {
      const response = await api.get("/monthly-summary");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du résumé mensuel:", error);
      throw error;
    }
  },
};

export default DashboardService;
