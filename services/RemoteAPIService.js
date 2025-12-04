/**
 * Service pour appeler l'API Flask distante
 * API sur http://localhost:5000 (PC local)
 * Modèle: face.h5 (TensorFlow)
 */

class RemoteAPIService {
  constructor() {
    // L'adresse IP du PC local (à adapter selon votre réseau)
    // Pour développement local: 127.0.0.1 ou localhost
    // Sur réseau: 192.168.x.x ou utiliser l'adresse IP réelle
    this.API_BASE_URL = 'https://machinel.onrender.com/'; // À remplacer par votre IP
    this.FALLBACK_URL = 'http://127.0.0.1:5000';
    this.LOCAL_URL = 'http://localhost:5000';
    
    this.timeout = 30000; // 30 secondes
    this.isConnected = false;
    
    this.initialize();
  }

  async initialize() {
    console.log('🔄 Initialisation RemoteAPIService...');
    
    // Tenter de se connecter à l'API
    try {
      await this.checkConnection();
      console.log('✅ Connecté à l\'API');
    } catch (error) {
      console.warn('⚠️ Impossible de se connecter à l\'API:', error.message);
    }
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/health`, {
        method: 'GET',
        timeout: this.timeout,
      });
      
      if (response.status === 200) {
        const data = await response.json();
        this.isConnected = true;
        return data;
      } else {
        this.isConnected = false;
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      this.isConnected = false;
      throw error;
    }
  }

  async setAPIUrl(url) {
    console.log(`🔗 Changement d'URL API: ${url}`);
    this.API_BASE_URL = url;
    
    try {
      await this.checkConnection();
      console.log('✅ Connecté avec succès');
      return true;
    } catch (error) {
      console.error('❌ Impossible de se connecter:', error.message);
      return false;
    }
  }

  /**
   * Reconnaître un visage à partir d'une image
   * @param {string} imageBase64 - Image en base64
   * @returns {Promise<{success, name, confidence, percentage, error}>}
   */
  async recognizeFace(imageBase64) {
    if (!imageBase64) {
      throw new Error('Aucune image fournie');
    }

    try {
      console.log('🔍 Envoi de l\'image pour reconnaissance...');
      
      const response = await fetch(`${this.API_BASE_URL}/recognize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Réponse API:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur reconnaissance:', error.message);
      throw new Error(`Erreur API: ${error.message}`);
    }
  }

  /**
   * Enregistrer un nouveau visage
   * @param {string} name - Nom de la personne
   * @param {string} imageBase64 - Image en base64
   * @returns {Promise<{success, message, filename, path, error}>}
   */
  async registerFace(name, imageBase64) {
    if (!name || !imageBase64) {
      throw new Error('Nom et image requis');
    }

    try {
      console.log(`💾 Enregistrement du visage de ${name}...`);
      
      const response = await fetch(`${this.API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          image: imageBase64,
        }),
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Visage enregistré:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur enregistrement:', error.message);
      throw new Error(`Erreur API: ${error.message}`);
    }
  }

  /**
   * Récupérer la liste des employés
   * @returns {Promise<{success, employees}>}
   */
  async getEmployees() {
    try {
      console.log('📋 Récupération de la liste des employés...');
      
      const response = await fetch(`${this.API_BASE_URL}/employees`, {
        method: 'GET',
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Employés:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur:', error.message);
      throw new Error(`Erreur API: ${error.message}`);
    }
  }

  /**
   * Obtenir le statut de la connexion
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      apiUrl: this.API_BASE_URL,
      timeout: this.timeout,
    };
  }
}

// Instance singleton
const remoteAPIService = new RemoteAPIService();

export default remoteAPIService;
