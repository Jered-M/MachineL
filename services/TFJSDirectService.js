import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { NativeModules, Platform } from 'react-native';

const CLASSES = ['jered', 'gracia', 'Ben', 'Leo'];
const THRESHOLD = 0.70;
const IMG_SIZE = 224;

// Utiliser le module TFLite natif Android
const { TFLiteModule } = NativeModules;

let isInitialized = false;

/**
 * Service face recognition avec TFLite natif Android
 * Charge et utilise le vrai modèle face_model.tflite
 */
export const TFJSDirectService = {
  /**
   * Initialise le module TFLite natif
   */
  async initialize() {
    try {
      if (isInitialized) {
        console.log('✅ TFLite déjà initialisé');
        return true;
      }

      // TFLite n'est disponible que sur Android
      if (Platform.OS !== 'android') {
        console.warn('⚠️ TFLite disponible uniquement sur Android');
        return false;
      }

      if (!TFLiteModule) {
        throw new Error('TFLiteModule non disponible');
      }

      console.log('⏳ Chargement du modèle TFLite natif...');
      
      // Le modèle est maintenant dans android/app/src/main/assets/face_model.tflite
      const loaded = await TFLiteModule.loadModel('face_model.tflite');
      
      if (!loaded) {
        throw new Error('Impossible de charger le modèle');
      }

      console.log('✅ Modèle TFLite chargé');
      
      isInitialized = true;
      return true;

    } catch (error) {
      console.error('❌ Erreur initialisation TFLite:', error);
      isInitialized = false;
      return false;
    }
  },

  /**
   * Redimensionne l'image à 224x224
   */
  async resizeImage(photoUri) {
    try {
      console.log('🖼️ Redimensionnement image...');
      
      const resized = await ImageManipulator.manipulateAsync(
        photoUri,
        [{ resize: { width: IMG_SIZE, height: IMG_SIZE } }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log('✅ Image redimensionnée:', resized.uri);
      return resized.uri;
    } catch (error) {
      console.error('❌ Erreur resize:', error);
      throw error;
    }
  },

  /**
   * Reconnaissance faciale avec le vrai modèle TFLite
   */
  async recognizeFace(photoUri) {
    const startTime = Date.now();

    try {
      console.log('🎬 Reconnaissance faciale...');
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

      console.log('📤 Envoi au modèle TFLite...');
      
      // Appeler le modèle TFLite natif
      const scoresArray = await TFLiteModule.runInference(resizedUri);

      console.log('📊 Résultats bruts:', scoresArray);

      if (!scoresArray || !Array.isArray(scoresArray)) {
        throw new Error('Résultat invalide du modèle');
      }

      // Normaliser les scores (s'ils ne sont pas déjà en 0-1)
      let scores = scoresArray;
      
      // Vérifier si c'est des valeurs brutes ou normalisées
      const maxScore = Math.max(...scores);
      if (maxScore > 1.5) {
        // Probablement des logits, appliquer softmax
        scores = this.softmax(scores);
      }

      // Trouver la meilleure classe
      let maxConfidence = 0;
      let bestIndex = 0;

      for (let i = 0; i < scores.length; i++) {
        if (scores[i] > maxConfidence) {
          maxConfidence = scores[i];
          bestIndex = i;
        }
      }

      const person = CLASSES[bestIndex];
      const confidence = maxConfidence;
      const success = confidence >= THRESHOLD;

      const elapsed = Date.now() - startTime;

      console.log('✅ Reconnaissance faite en', elapsed, 'ms');
      console.log('👤 Personne:', person, `(${(confidence * 100).toFixed(2)}%)`);

      // Retourner les résultats
      return {
        success,
        person: success ? person : 'Inconnu',
        confidence: (confidence * 100).toFixed(2),
        message: success ? `Reconnu: ${person}` : 'Personne non reconnue',
        allResults: scores.map((score, idx) => ({
          name: CLASSES[idx],
          score: score.toFixed(4),
          percentage: ((score * 100).toFixed(2) + '%'),
          isMatch: idx === bestIndex
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
   * Applique la fonction softmax pour normaliser les scores
   */
  softmax(arr) {
    const maxVal = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - maxVal));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sumExps);
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
