// Gestionnaire de stockage des valeurs flottantes
let storedValues = [];

export const StorageManager = {
  // Ajouter une valeur flottante aléatoire
  addRandomValue: () => {
    const randomValue = Math.random() * 100; // Valeur entre 0 et 100
    storedValues.push(randomValue);
    return randomValue;
  },

  // Ajouter une valeur spécifique
  addValue: (value) => {
    if (typeof value === 'number') {
      storedValues.push(value);
      return value;
    }
    return null;
  },

  // Obtenir toutes les valeurs stockées
  getAllValues: () => {
    return [...storedValues];
  },

  // Obtenir le nombre de valeurs stockées
  getCount: () => {
    return storedValues.length;
  },

  // Calculer la moyenne des valeurs
  getAverage: () => {
    if (storedValues.length === 0) return 0;
    const sum = storedValues.reduce((acc, val) => acc + val, 0);
    return sum / storedValues.length;
  },

  // Obtenir le minimum
  getMin: () => {
    if (storedValues.length === 0) return null;
    return Math.min(...storedValues);
  },

  // Obtenir le maximum
  getMax: () => {
    if (storedValues.length === 0) return null;
    return Math.max(...storedValues);
  },

  // Réinitialiser le stockage
  reset: () => {
    storedValues = [];
  },

  // Générer N valeurs aléatoires et les stocker
  generateMultipleRandomValues: (count = 5) => {
    const values = [];
    for (let i = 0; i < count; i++) {
      values.push(StorageManager.addRandomValue());
    }
    return values;
  },
};
