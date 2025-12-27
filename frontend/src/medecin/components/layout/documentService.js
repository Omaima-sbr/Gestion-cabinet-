// src/services/documentService.js
import { authService } from '../../services/authService';

class DocumentService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
    }

    /**
     * Charge un document et le convertit en Data URL
     * @param {string} documentPath - Chemin du document (peut être une URL complète ou relative)
     * @returns {Promise<string>} Data URL (base64)
     */
    async loadAsDataUrl(documentPath) {
        if (!documentPath) {
            throw new Error('Aucun chemin de document fourni');
        }

        console.log('🔍 [DocumentService] Chargement:', documentPath);

        try {
            // Si c'est une URL complète Supabase ou localhost, extraire juste le nom du fichier
            let fileName = documentPath;

            if (documentPath.includes('supabase.co') || documentPath.includes('localhost:8080')) {
                // Extraire le nom du fichier depuis l'URL
                const urlParts = documentPath.split('/');
                fileName = urlParts[urlParts.length - 1];
                console.log('📎 [DocumentService] Nom de fichier extrait:', fileName);
            }

            // Construire l'URL de l'API
            const apiUrl = `${this.baseURL}/admin/documents/view?path=${encodeURIComponent(fileName)}`;
            console.log('🌐 [DocumentService] URL API:', apiUrl);

            // Récupérer le token
            const token = authService.getToken();
            if (!token) {
                throw new Error('Token non disponible');
            }

            // Faire la requête avec le token
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ [DocumentService] Erreur HTTP:', response.status, errorText);
                throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
            }

            // Récupérer le blob
            const blob = await response.blob();
            console.log('📦 [DocumentService] Blob reçu:', blob.type, blob.size, 'bytes');

            // Convertir en Data URL
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    console.log('✅ [DocumentService] Conversion en Data URL réussie');
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    console.error('❌ [DocumentService] Erreur conversion blob');
                    reject(new Error('Erreur lors de la conversion en Data URL'));
                };
                reader.readAsDataURL(blob);
            });

        } catch (error) {
            console.error('❌ [DocumentService] Erreur:', error);
            throw error;
        }
    }

    /**
     * Obtient l'URL complète pour afficher un document
     * @param {string} documentPath - Chemin du document
     * @returns {string} URL complète avec token
     */
    getViewUrl(documentPath) {
        if (!documentPath) return null;

        let fileName = documentPath;
        if (documentPath.includes('supabase.co') || documentPath.includes('localhost:8080')) {
            const urlParts = documentPath.split('/');
            fileName = urlParts[urlParts.length - 1];
        }

        const token = authService.getToken();
        return `${this.baseURL}/admin/documents/view?path=${encodeURIComponent(fileName)}&token=${token}`;
    }
}

export default new DocumentService();