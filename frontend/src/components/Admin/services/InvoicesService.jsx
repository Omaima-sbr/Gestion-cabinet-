import axios from "axios";

// URL de ton backend Spring Boot
const API_URL = "http://localhost:8080/api/admin-factures";

class InvoicesService {
  // Récupérer toutes les factures
  getAll() {
    // On retourne directement res.data pour avoir le tableau
    return axios.get(API_URL).then((res) => res.data);
  }

  // Mettre à jour facture (montant + période)
  update(id, data) {
    return axios.put(`${API_URL}/${id}`, data).then((res) => res.data);
  }

  // Marquer comme payée
  markAsPaid(id) {
    return axios.post(`${API_URL}/${id}/payer`).then((res) => res.data);
  }
}

export default new InvoicesService();
