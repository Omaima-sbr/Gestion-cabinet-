// frontend/src/services/DemandeService.jsx
import axios from "axios";

// Définir l'URL de base de ton backend
const API_URL = "http://localhost:8080/api/demandes";

const DemandeService = {

  // 1️⃣ Récupérer toutes les demandes
  getAllDemandes: async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes :", error);
      throw error;
    }
  },

  // 2️⃣ Récupérer les demandes par statut
  getDemandesByStatut: async (statut) => {
    try {
      const response = await axios.get(`${API_URL}/statut/${statut}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des demandes avec le statut ${statut} :`, error);
      throw error;
    }
  },

  // 3️⃣ Approuver une demande
  approuverDemande: async (id, admin) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/approuver`, admin);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'approbation de la demande ${id} :`, error);
      throw error;
    }
  },

  // 4️⃣ Rejeter une demande
  rejeterDemande: async (id, commentaire, admin) => {
    try {
      const dto = { commentaire: commentaire, admin: admin };
      const response = await axios.post(`${API_URL}/${id}/rejeter`, dto);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du rejet de la demande ${id} :`, error);
      throw error;
    }
  },
};

export default DemandeService;
