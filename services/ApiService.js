// Configuration de l'API Flask locale
// Sur émulateur Android: http://10.0.2.2:5000
// Sur appareil physique: http://192.168.X.X:5000 (remplacez par votre IP)
const API_URL = 'http://10.0.2.2:5000';

export const ApiService = {
  /**
   * Envoie une image au modèle pour reconnaissance faciale
   * @param {string} photoUri - URI de la photo capturée (file:// ou blob:)
   * @returns {Promise<object>} Résultats du modèle
   */
  async recognizeFace(photoUri) {
    try {
      console.log('📸 URI Photo reçue:', photoUri);

      // Créer un FormData pour envoyer le fichier
      const formData = new FormData();
      
      // Fetch la photo depuis l'URI
      console.log('🔍 Récupération du blob...');
      const response = await fetch(photoUri);
      
      if (!response.ok) {
        throw new Error(`Impossible de récupérer la photo: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('✅ Blob créé, taille:', blob.size, 'bytes');
      
      // Ajouter le blob au FormData
      formData.append('image', blob, 'photo.jpg');
      
      console.log('📤 Envoi du fichier à l\'API:', `${API_URL}/recognize-file`);
      
      // Envoyer à l'API
      const apiResponse = await fetch(`${API_URL}/recognize-file`, {
        method: 'POST',
        body: formData,
      });

      console.log('📬 Réponse API reçue, status:', apiResponse.status);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`API Error ${apiResponse.status}: ${errorText}`);
      }

      const result = await apiResponse.json();
      console.log('✅ Résultat JSON:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Erreur lors de la reconnaissance:', error.message);
      throw error;
    }
  },

  /**
   * Vérifie la connexion à l'API
   */
  async checkConnection() {
    try {
      console.log('🔗 Vérification de la connexion à l\'API...');
      const response = await fetch(`${API_URL}/health`);
      const isOk = response.ok;
      console.log('✅ Connexion API:', isOk ? 'OK' : 'Erreur');
      return isOk;
    } catch (error) {
      console.error('❌ Impossible de se connecter à l\'API:', error.message);
      return false;
    }
  },
};
