// src/medecin/services/dashboardService.js
import { api } from './authService';

const dashboardService = {
    /**
     * Récupère toutes les données du dashboard médecin
     */
    getDashboardData: async () => {
        try {
            console.log('🔄 [Dashboard] Appel API: GET /medecin/dashboard');
            
            // DEBUG: Vérifier le token avant l'appel
            const token = localStorage.getItem('token');
            console.log('🔑 [Dashboard] Token disponible:', token ? 'OUI' : 'NON');
            console.log('📤 [Dashboard] Headers actuels:', api.defaults.headers);
            
            const response = await api.get('/medecin/dashboard');
            console.log('✅ [Dashboard] Données reçues:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ [Dashboard] Erreur détaillée:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url,
                headers: error.config?.headers
            });
            
            // Si c'est une erreur 403, vérifier l'authentification
            if (error.response?.status === 403) {
                console.error('🚫 Accès interdit - Vérifiez:');
                console.error('1. Le token est-il valide?');
                console.error('2. L\'utilisateur a-t-il le rôle MEDECIN?');
                console.error('3. Le backend autorise-t-il cette route?');
                
                // Vérifier l'état de l'authentification
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                console.error('👤 Utilisateur actuel:', user);
            }
            
            throw error;
        }
    },

    /**
     * Marque une notification comme lue
     */
    markNotificationAsRead: async (notificationId) => {
        try {
            console.log(`🔄 [Dashboard] Marquage notification ${notificationId} comme lue`);
            const response = await api.put(`/medecin/dashboard/notifications/${notificationId}/read`);
            console.log(`✅ [Dashboard] Notification ${notificationId} marquée comme lue`);
            return response.data;
        } catch (error) {
            console.error('❌ [Dashboard] Erreur markNotificationAsRead:', {
                error: error.message,
                status: error.response?.status
            });
            throw error;
        }
    },

    /**
     * Marque toutes les notifications comme lues
     */
    markAllNotificationsAsRead: async () => {
        try {
            console.log('🔄 [Dashboard] Marquage de toutes les notifications comme lues');
            const response = await api.put('/medecin/dashboard/notifications/read-all');
            console.log('✅ [Dashboard] Toutes les notifications marquées comme lues');
            return response.data;
        } catch (error) {
            console.error('❌ [Dashboard] Erreur markAllNotificationsAsRead:', error);
            throw error;
        }
    },

    /**
     * Met à jour le statut d'un rendez-vous
     */
    updateAppointmentStatus: async (appointmentId, status) => {
        try {
            console.log(`🔄 [Dashboard] Mise à jour RDV ${appointmentId} vers ${status}`);
            const response = await api.put(`/medecin/dashboard/appointments/${appointmentId}/status`, {
                status
            });
            console.log(`✅ [Dashboard] Statut RDV ${appointmentId} mis à jour`);
            return response.data;
        } catch (error) {
            console.error('❌ [Dashboard] Erreur updateAppointmentStatus:', error);
            throw error;
        }
    },

    /**
 * Termine le patient en cours
 */
completeCurrentPatient: async () => {
    try {
        console.log('🔄 [Dashboard] Terminaison du patient en cours');
        const response = await api.put('/medecin/dashboard/current-patient/complete');
        
        console.log('🔄 [Dashboard] Terminaison du patient en cours');
        console.log('📤 [Dashboard] Envoi requête PUT /medecin/dashboard/current-patient/complete');
        
        console.log('✅ [Dashboard] Patient en cours terminé avec succès');
        return response.data;
    } catch (error) {
        console.error('❌ [Dashboard] Erreur completeCurrentPatient:', {
            error: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
},

    /**
     * Démarre une consultation (change le statut à EN_COURS)
     */
    startConsultation: async (appointmentId) => {
        try {
            console.log(`🔄 [Dashboard] Démarrage consultation pour RDV ${appointmentId}`);
            await dashboardService.updateAppointmentStatus(appointmentId, 'EN_COURS');
            console.log(`✅ [Dashboard] Consultation démarrée pour RDV ${appointmentId}`);
        } catch (error) {
            console.error('❌ [Dashboard] Erreur startConsultation:', error);
            throw error;
        }
    },

    /**
     * NOUVEAU: Vérifier l'authentification avant les appels
     */
    checkAuth: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('🔍 [Dashboard] Vérification auth:', {
            hasToken: !!token,
            userRole: user.role,
            expectedRole: 'MEDECIN'
        });
        
        if (!token) {
            throw new Error('Non authentifié - Token manquant');
        }
        
        if (user.role !== 'MEDECIN') {
            throw new Error(`Rôle incorrect: ${user.role} (attendu: MEDECIN)`);
        }
        
        return true;
    }
};

export default dashboardService;