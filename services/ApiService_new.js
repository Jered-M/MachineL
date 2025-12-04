// Configuration de l'API Flask locale
const API_URL = 'http://10.0.2.2:5000';

export const ApiService = {
  /**
   * Envoie une image au modèle pour reconnaissance faciale
   * @param {string} photoUri - URI de la photo capturée
   * @returns {Promise<object>} Résultats du modèle
   */
  async recognizeFace(photoUri) {
    try {
      console.log('📸 Traitement de la photo:', photoUri);

      // Créer un FormData pour envoyer le fichier
      const formData = new FormData();
      
      // Récupérer le fichier depuis l'URI
      const response = await fetch(photoUri);
      const blob = await response.blob();
      
      // Ajouter le fichier au FormData
      formData.append('image', blob, 'photo.jpg');
      
      console.log('📤 Envoi du fichier à l\'API...');
      
      // Envoyer à l'API
      const apiResponse = await fetch(`${API_URL}/recognize-file`, {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      console.log('✅ Réponse API reçue:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la reconnaissance:', error);
      throw error;
    }
  },

  /**
   * Vérifie la connexion à l'API
   */
  async checkConnection() {
    try {
      console.log('Vérification de la connexion à l\'API...');
      const response = await fetch(`${API_URL}/health`);
      const isOk = response.ok;
      console.log('Connexion API:', isOk ? '✅ OK' : '❌ Erreur');
      return isOk;
    } catch (error) {
      console.error('❌ Impossible de se connecter à l\'API:', error);
      return false;
    }
  },

  /**
   * Change l'URL de l'API
   */
  setApiUrl(url) {
    console.log('URL API changée en:', url);
  },
};
