// Configuration des chemins des modèles pour Expo
// Cette approche évite les problèmes avec require() dans le métabundler

export const MODEL_CONFIG = {
  modelJsonPath: '../../assets/models/model.json',
  weightsPath: '../../assets/models/model.weights.bin',
  
  // Obtenir les URIs correctes pour le runtime Expo
  getModelUri: () => {
    // En environnement Expo, les assets statiques sont accessibles via ce pattern
    return require('../assets/models/model.json');
  },
  
  getWeightsUri: () => {
    return require('../assets/models/model.weights.bin');
  }
};
