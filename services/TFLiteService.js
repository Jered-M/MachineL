import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { NativeModules } from 'react-native';

const CLASSES = ['jered', 'gracia', 'Ben', 'Leo'];
const THRESHOLD = 0.70;
const IMG_SIZE = 224;

const { TFLiteModule } = NativeModules;

let isInitialized = false;

/**
 * Service TFLite natif - utilise le module React Native TFLite
 */
export const TFLiteService = {
  /**
   * Initialise le module TFLite
   */
  async initialize() {
    try {
      if (isInitialized) {
        console.log('✅ TFLite déjà initialisé');
        return true;
      }

      if (!TFLiteModule) {
        throw new Error('TFLiteModule non disponible - Android requis');
      }

      console.log('⏳ Initialisation TFLite...');
      
      // Le modèle est chargé au boot par le module Android
      console.log('✅ TFLite Module disponible');
      
      isInitialized = true;
      return true;

    } catch (error) {
      console.error('❌ Erreur initialisation:', error);
      isInitialized = false;
      return false;
    }
  },

  /**
   * Redimensionne l'image
   */
  async resizeImage(photoUri) {
    try {
      console.log('🖼️ Redimensionnement...');
      
      const resized = await ImageManipulator.manipulateAsync(
        photoUri,
        [{ resize: { width: IMG_SIZE, height: IMG_SIZE } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log('✅ Image redimensionnée:', resized.uri);
      return resized.uri;
    } catch (error) {
      console.error('❌ Erreur resize:', error);
      throw error;
    }
  },

  /**
   * Reconnaissance avec TFLite
   */
  async recognizeFace(photoUri) {
    const startTime = Date.now();

    try {
      console.log('🎬 Reconnaissance TFLite...');
      console.log('📍 Photo:', photoUri);

      if (!isInitialized) {
        console.log('⏳ Initialisation...');
        const ok = await this.initialize();
        if (!ok) {
          throw new Error('Impossible d\'initialiser TFLite');
        }
      }

      if (!TFLiteModule) {
        throw new Error('TFLiteModule non disponible');
      }

      // Redimensionner l'image
      const resizedUri = await this.resizeImage(photoUri);

      console.log('📤 Envoi à TFLite...');
      
      // Appeler le modèle TFLite natif
      const scores = await TFLiteModule.runInference(resizedUri);

      console.log('📊 Scores bruts:', scores);

      if (!scores || scores.length !== 4) {
        throw new Error('Résultat invalide du modèle');
      }

      // Convertir en tableau si nécessaire
      const scoresArray = Array.isArray(scores) ? scores : Object.values(scores);

      // Trouver la meilleure classe
      let maxScore = 0;
      let maxIndex = 0;

      for (let i = 0; i < scoresArray.length; i++) {
        if (scoresArray[i] > maxScore) {
          maxScore = scoresArray[i];
          maxIndex = i;
        }
      }

      const person = CLASSES[maxIndex];
      const confidence = maxScore;
      const success = confidence >= THRESHOLD;

      const elapsed = Date.now() - startTime;

      console.log('✅ Fait en', elapsed, 'ms');
      console.log('👤', person, `${(confidence * 100).toFixed(2)}%`);

      return {
        success,
        person: success ? person : 'Inconnu',
        confidence: (confidence * 100).toFixed(2),
        message: success ? `Reconnu: ${person}` : 'Personne non reconnue',
        allResults: scoresArray.map((score, idx) => ({
          name: CLASSES[idx],
          score: score.toFixed(4),
          percentage: ((score * 100).toFixed(2) + '%'),
          isMatch: idx === maxIndex
        }))
      };

    } catch (error) {
      console.error('❌ Erreur:', error);
      
      return {
        success: false,
        person: 'Erreur',
        confidence: 0,
        message: `Erreur: ${error.message}`,
        allResults: CLASSES.map(name => ({
          name,
          score: '0.0000',
          percentage: '0.00%',
          isMatch: false
        }))
      };
    }
  },

  /**
   * Nettoie
   */
  async cleanup() {
    try {
      if (TFLiteModule) {
        console.log('🧹 Cleanup TFLite...');
        await TFLiteModule.close();
        isInitialized = false;
      }
    } catch (error) {
      console.error('⚠️ Erreur cleanup:', error);
    }
  }
};
