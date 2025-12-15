import axios from "axios";

const API_URL = "http://localhost:8080/api/demandes";

class DemandeService {
  // 1️⃣ Récupérer toutes les demandes
  getAll() {
    return axios.get(API_URL).then(res => res.data);
  }

  // 2️⃣ Récupérer les demandes par statut
  getByStatut(statut) {
    return axios.get(`${API_URL}/statut/${statut}`).then(res => res.data);
  }

  // 3️⃣ Approuver une demande
  approuver(id, admin) {
    return axios.post(`${API_URL}/${id}/approuver`, admin).then(res => res.data);
  }

  // 4️⃣ Rejeter une demande
  rejeter(id, commentaire, admin) {
    const dto = { commentaire: commentaire, admin: admin };
    return axios.post(`${API_URL}/${id}/rejeter`, dto).then(res => res.data);
  }
}

export default new DemandeService();
