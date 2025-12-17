import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/alertes";

// 1. Créer une instance Axios configurée
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. L'INTERCEPTEUR pour ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Rediriger vers la page de connexion ou rafraîchir le token
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

class NotificationService {
  // Récupérer les notifications non lues
  async getUnreadNotifications() {
    try {
      const response = await api.get("/non-lues");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      
      // Gestion spécifique des erreurs
      if (error.response) {
        console.error("Statut:", error.response.status);
        console.error("Data:", error.response.data);
      }
      
      return [];
    }
  }

  // Récupérer le nombre de notifications non lues
  async getUnreadCount() {
    try {
      const response = await api.get("/count-non-lues");
      return response.data;
    } catch (error) {
      console.error("Erreur lors du comptage des notifications:", error);
      
      if (error.response && error.response.status === 401) {
        console.warn("Token expiré ou invalide");
      }
      
      return 0;
    }
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId) {
    try {
      await api.put(`/${notificationId}/marquer-lu`);
      return true;
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
      return false;
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(notificationIds) {
    try {
      const promises = notificationIds.map(id => 
        api.put(`/${id}/marquer-lu`)
      );
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications:", error);
      return false;
    }
  }

  // Optionnel : Fonction pour vérifier la connexion
  
}

export default new NotificationService();