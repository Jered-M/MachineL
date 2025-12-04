// Configuration des chemins d'assets pour le modèle
// Cette approche évite les problèmes avec require() et Asset.fromModule() pour les fichiers .bin/.json

export const ASSET_PATHS = {
  // Chemin relatif au répertoire assets
  modelJson: 'models/model.json',
  modelWeights: 'models/model.weights.bin',
  
  // URL de base servie par Expo (lors du développement)
  assetBase: 'file:///android_asset/files/',
};
