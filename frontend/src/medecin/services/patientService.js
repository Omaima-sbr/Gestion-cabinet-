// patientService.js - Service pour la gestion des patients
import { api } from './authService'; 

const patientService = {
    // Rechercher des patients
    searchPatients: async (query) => {
        try {
            console.log(`🔄 [Patients] Recherche: "${query}"`);
            
            const response = await api.get(`/patients/medsearch?q=${encodeURIComponent(query)}`);
            console.log(`✅ [Patients] ${Array.isArray(response.data) ? response.data.length : 0} résultats`);
            return response.data;
        } catch (error) {
            console.error('❌ [Patients] Erreur recherche patients:', {
                message: error.message,
                status: error.response?.status
            });
            
            // Retourner un tableau vide plutôt que de lancer une exception
            return [];
        }
    },

    // Récupérer un patient par ID
    getPatientById: async (id) => {
        try {
            console.log(`🔄 [Patients] Récupération patient ID: ${id}`);
            
            const response = await api.get(`/patients/${id}`);
            console.log('✅ [Patients] Patient reçu:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ [Patients] Erreur récupération patient:', {
                message: error.message,
                status: error.response?.status
            });
            throw error;
        }
    },
    
    // NOUVEAU: Récupérer tous les patients
    getAllPatients: async () => {
        try {
            console.log('🔄 [Patients] Récupération de tous les patients');
            
            const response = await api.get('/patients/all');  // ← CHANGEMENT ICI
            console.log(`✅ [Patients] ${Array.isArray(response.data) ? response.data.length : 0} patients`);
            return response.data;
        } catch (error) {
            console.error('❌ [Patients] Erreur getAllPatients:', error);
            return [];
        }
    },
    
    // NOUVEAU: Créer un patient
    createPatient: async (patientData) => {
        try {
            console.log('🔄 [Patients] Création nouveau patient');
            
            const response = await api.post('/patients', patientData);
            console.log('✅ [Patients] Patient créé:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ [Patients] Erreur création patient:', error);
            throw error;
        }
    },
    
    // NOUVEAU: Mettre à jour un patient
    updatePatient: async (id, patientData) => {
        try {
            console.log(`🔄 [Patients] Mise à jour patient ID: ${id}`);
            
            const response = await api.put(`/patients/${id}`, patientData);
            console.log('✅ [Patients] Patient mis à jour:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ [Patients] Erreur mise à jour patient:', error);
            throw error;
        }
    }
    
};        


export default patientService;