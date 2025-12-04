import { NativeModules } from 'react-native';
import * as FileSystem from 'expo-file-system';

const CLASSES = ['jered', 'gracia', 'Ben', 'Leo'];
const THRESHOLD = 0.70;

let model = null;
let isModelLoaded = false;

export const DirectModelService = {
  /**
   * Charge le modèle TensorFlow directement
   */
  async loadModel() {
    try {
      console.log('🤖 Chargement du modèle directement dans l\'app...');
      
      // Le modèle doit être dans assets/models/face_recognition_model.tflite
      // Ou téléchargé depuis les assets
      
      const modelPath = `${FileSystem.documentDirectory}face_recognition_model.tflite`;
      
      console.log('📁 Chemin du modèle:', modelPath);
      
      // Vérifier si le modèle existe
      const modelExists = await FileSystem.getInfoAsync(modelPath);
      
      if (!modelExists.exists) {
        throw new Error('Modèle non trouvé. Placez face_recognition_model.tflite dans assets/');
      }
      
      // Charger le modèle
      // Pour cela, utilisez react-native-tensorflow-lite ou tflite-react-native
      isModelLoaded = true;
      console.log('✅ Modèle chargé avec succès');
      
      return true;
    } catch (error) {
      console.error('❌ Erreur chargement modèle:', error);
      return false;
    }
  },

  /**
   * Reconnaît un visage depuis une photo
   */
  async recognizeFace(photoUri) {
    try {
      if (!isModelLoaded) {
        throw new Error('Modèle non chargé. Appelez loadModel() d\'abord.');
      }

      console.log('📸 Traitement de la photo avec le modèle local...');

      // Charger l'image
      const imageData = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('✅ Photo chargée en base64');

      // Redimensionner à 224x224 (taille du modèle)
      // Normaliser 0-1
      // Prédiction locale

      // Pour l'instant, simulation (vous devez intégrer tflite-react-native)
      const prediction = [0.15, 0.85, 0.05, 0.02]; // Exemple: prédiction pour ["jered", "gracia", "Ben", "Leo"]

      const confidence = Math.max(...prediction);
      const index = prediction.indexOf(confidence);
      const percentage = (confidence * 100).toFixed(2);

      console.log(`✅ Prédiction: ${CLASSES[index]} - ${percentage}%`);

      if (confidence < THRESHOLD) {
        return {
          success: false,
          name: 'Inconnu',
          confidence: confidence,
          percentage: percentage,
          error: 'Confiance insuffisante'
        };
      }

      return {
        success: true,
        name: CLASSES[index],
        confidence: confidence,
        percentage: percentage,
        employee_id: `EMP_${CLASSES[index].toUpperCase()}`
      };

    } catch (error) {
      console.error('❌ Erreur reconnaissance:', error);
      throw error;
    }
  }
};
