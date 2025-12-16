import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/dashboard";

// ✅ Instance axios configurée
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 INTERCEPTOR REQUEST: Injection automatique du token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("🔑 Token JWT envoyé:", token.substring(0, 20) + "...");
        } else {
            console.warn("⚠️ Aucun token JWT trouvé dans localStorage");
        }
        return config;
    },
    (error) => {
        console.error("❌ Erreur dans l'interceptor request:", error);
        return Promise.reject(error);
    }
);

// 🔄 INTERCEPTOR RESPONSE: Gestion erreur 401 (token expiré/invalide)
api.interceptors.response.use(
    (response) => {
        console.log("✅ Réponse API réussie:", response.config.url);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error("❌ 401 Unauthorized - Token invalide ou expiré");
            localStorage.removeItem("token");
            window.location.href = "/login"; // ⚠️ Ajustez selon votre route de login
        } else if (error.response?.status === 403) {
            console.error("❌ 403 Forbidden - Accès refusé (rôle insuffisant)");
            alert("Accès refusé : Vous n'avez pas les permissions nécessaires.");
        } else {
            console.error("❌ Erreur API:", error.response?.status, error.message);
        }
        return Promise.reject(error);
    }
);

const DashboardService = {
    /**
     * ✅ Récupérer toutes les stats du dashboard
     * (statistiques globales + résumé mensuel + activités récentes)
     */
    getDashboardData: async () => {
        try {
            const response = await api.get("/stats");
            console.log("📊 Données dashboard récupérées:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Erreur lors de la récupération du dashboard:", error);
            throw error;
        }
    },

    /**
     * ⚠️ OPTIONNEL: Méthode pour le résumé mensuel seul
     * (À créer côté backend si vous voulez un endpoint séparé)
     */
    getMonthlySummary: async () => {
        try {
            const response = await api.get("/monthly-summary");
            console.log("📈 Résumé mensuel récupéré:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Erreur lors de la récupération du résumé mensuel:", error);
            throw error;
        }
    },
};

export default DashboardService;