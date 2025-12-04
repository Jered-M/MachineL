import * as tf from '@tensorflow/tfjs';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const CLASSES = ['jered', 'gracia', 'Ben', 'Leo'];
const IMG_SIZE = 224;
const THRESHOLD = 0.70;

let model = null;
let isModelLoaded = false;

export const LocalTFJSService = {
  async loadModel() {
    try {
      if (isModelLoaded && model) {
        console.log('✅ Modèle déjà chargé');
        return true;
      }

      console.log('🚀 Chargement du modèle à l\'initialisation...');
      console.log('🤖 Chargement du modèle TensorFlow.js...');

      // Initialiser TensorFlow.js avec le backend CPU
      console.log('⚙️ Initialisation backend CPU...');
      await tf.setBackend('cpu');
      await tf.ready();
      console.log('✅ Backend CPU activé');

      console.log('📦 Chargement des fichiers du modèle...');
      
      // URL du modèle servi par Expo
      // Le serveur Expo sur port 8081 sert automatiquement les assets statiques
      const modelUrl = 'http://localhost:8081/assets/models/model.json';
      
      console.log('📂 URL du modèle:', modelUrl);
      console.log('📂 Chargement via HTTP...');
      
      // Charger le modèle directement via tf.io.http
      model = await tf.loadLayersModel(tf.io.http(modelUrl, {
        requestInit: { 
          credentials: 'omit',
          headers: {
            'Accept': 'application/json'
          }
        }
      }));
      
      isModelLoaded = true;

      console.log('✅ Modèle chargé avec succès');
      console.log('📊 Modèle info:');
      console.log('   Shape entrée:', model.inputs[0].shape);
      console.log('   Shape sortie:', model.outputs[0].shape);
      console.log('   Nombre de couches:', model.layers.length);
      
      return true;

    } catch (error) {
      console.error('❌ Erreur chargement modèle:', error.message);
      console.error('Stack:', error.stack);
      isModelLoaded = false;
      throw error;
    }
  },

  async preprocessImage(photoUri) {
    try {
      console.log('📸 Prétraitement de l\'image...');
      
      // Redimensionner l'image à 224x224
      const resized = await ImageManipulator.manipulateAsync(
        photoUri,
        [{ resize: { width: IMG_SIZE, height: IMG_SIZE } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log('✅ Image redimensionnée');

      // Lire l'image et convertir en tensor
      const base64 = await FileSystem.readAsStringAsync(resized.uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      console.log('✅ Image convertie en Base64');

      // Créer un tensor à partir de l'image
      const img = await tf.browser.fromPixels(
        { data: Uint8Array.from(atob(base64), c => c.charCodeAt(0)), width: IMG_SIZE, height: IMG_SIZE, depth: 3 },
        3
      );

      console.log('✅ Tensor créé');

      // Normaliser
      let tensor = img.div(255.0);
      tensor = tensor.expandDims(0);

      console.log('✅ Image prétraitée');

      return tensor;
    } catch (error) {
      console.error('❌ Erreur prétraitement:', error.message);
      throw error;
    }
  },

  async recognizeFace(photoUri) {
    try {
      if (!isModelLoaded) {
        throw new Error('Modèle non chargé. Appelez loadModel() d\'abord');
      }

      console.log('📸 Reconnaissance faciale...');
      
      const input = await this.preprocessImage(photoUri);
      
      console.log('🧠 Inférence du modèle...');
      const predictions = await model.predict(input);
      const output = await predictions.data();

      const arr = Array.from(output);
      const confidence = Math.max(...arr);
      const classIndex = arr.indexOf(confidence);

      // Nettoyer
      input.dispose();
      predictions.dispose();

      console.log('✅ Inférence complète');
      console.log('   Classe:', CLASSES[classIndex]);
      console.log('   Confiance:', (confidence * 100).toFixed(2) + '%');

      if (confidence < THRESHOLD) {
        return {
          success: false,
          name: 'Inconnu',
          percentage: (confidence * 100).toFixed(2),
        };
      }

      return {
        success: true,
        name: CLASSES[classIndex],
        percentage: (confidence * 100).toFixed(2),
      };
    } catch (error) {
      console.error('❌ Erreur reconnaissance:', error.message);
      throw error;
    }
  },

  async unloadModel() {
    if (model) {
      model.dispose();
      model = null;
      isModelLoaded = false;
      console.log('✅ Modèle déchargé');
    }
  },

  getModelInfo() {
    if (!model) return null;
    return {
      inputShape: model.inputs[0].shape,
      outputShape: model.outputs[0].shape,
      layersCount: model.layers.length,
      loaded: isModelLoaded
    };
  }
};
