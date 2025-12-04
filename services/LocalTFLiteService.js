import * as FileSystem from 'expo-file-system';

const CLASSES = ['jered', 'gracia', 'Ben', 'Leo'];
const THRESHOLD = 0.70;
const API_URL = 'https://ml-api-3jf9.onrender.com'; // API Render

let isConnected = false;

/**
 * Service utilisant l'API Flask avec le modèle H5 réel
 */
export const LocalTFLiteService = {
  /**
   * Initialise et teste la connexion à l'API
   */
  async initialize() {
    try {
      console.log('🔗 Test connexion API:', API_URL);
      
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API disponible:', data);
        isConnected = true;
        return true;
      }
    } catch (error) {
      console.error('❌ API non disponible:', error.message);
      isConnected = false;
      return false;
    }
  },

  /**
   * Reconnaissance faciale via API Flask
   */
  async recognizeFace(photoUri) {
    const startTime = Date.now();
    
    try {
      console.log('🎬 Reconnaissance faciale...');
      console.log('📍 Photo URI:', photoUri);

      if (!isConnected) {
        console.warn('⚠️ API pas connectée, initialisation...');
        await this.initialize();
      }

      if (!isConnected) {
        throw new Error('API Flask non disponible. Assurez-vous que le serveur est en cours d\'exécution sur ' + API_URL);
      }

      // Lire l'image en base64
      console.log('📖 Lecture image...');
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('📤 Envoi vers API...');
      
      // Envoyer à l'API
      const response = await fetch(`${API_URL}/recognize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      const elapsed = Date.now() - startTime;
      console.log('✅ Reconnaissance fait en', elapsed, 'ms');
      console.log('📄 Résultat API:', result);

      // Transformer le résultat pour être compatible
      return {
        success: result.success,
        person: result.person,
        confidence: result.confidence,
        message: result.message,
        allResults: result.scores ? CLASSES.map((name, idx) => ({
          name,
          score: result.scores[idx],
          percentage: ((result.scores[idx] * 100).toFixed(2) + '%')
        })) : []
      };

    } catch (error) {
      console.error('❌ Erreur:', error);
      
      return {
        success: false,
        message: error.message || 'Erreur reconnaissance',
        error: true,
        confidence: 0,
        person: null
      };
    }
  },

  /**
   * Nettoyage
   */
  cleanup() {
    console.log('🧹 Nettoyage');
  },

  /**
   * Retourne les classes
   */
  getClasses() {
    return CLASSES;
  },

  /**
   * Retourne le statut
   */
  getStatus() {
    return {
      connected: isConnected,
      apiUrl: API_URL,
      classes: CLASSES,
      threshold: THRESHOLD
    };
  }
};
