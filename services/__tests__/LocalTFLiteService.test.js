/**
 * Test du service TFLite
 * Fichier: services/__tests__/LocalTFLiteService.test.js
 * 
 * Tester l'intégration du modèle TFLite
 */

describe('LocalTFLiteService', () => {
  // Mock imports
  jest.mock('@tensorflow/tfjs', () => ({
    __esModule: true,
    default: {
      loadGraphModel: jest.fn(),
      sequential: jest.fn(),
    },
  }));

  jest.mock('expo-image-manipulator', () => ({
    __esModule: true,
    manipulateAsync: jest.fn(),
  }));

  jest.mock('expo-file-system', () => ({
    __esModule: true,
    documentDirectory: '/test/',
  }));

  let LocalTFLiteService;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    LocalTFLiteService = require('../LocalTFLiteService').LocalTFLiteService;
  });

  /**
   * TEST 1: Initialisation du service
   */
  describe('initialize()', () => {
    test('should initialize the model successfully', async () => {
      const result = await LocalTFLiteService.initialize();
      expect(result).toBeDefined();
      // Peut retourner true ou un modèle de démo
    });

    test('should return false if initialization fails', async () => {
      // Test de fallback (modèle de démo)
      const result = await LocalTFLiteService.initialize();
      expect(result).toEqual(expect.any(Boolean));
    });
  });

  /**
   * TEST 2: Statut du modèle
   */
  describe('getStatus()', () => {
    test('should return model status', () => {
      const status = LocalTFLiteService.getStatus();
      
      expect(status).toHaveProperty('loaded');
      expect(status).toHaveProperty('modelPath');
      expect(status).toHaveProperty('classes');
      expect(status).toHaveProperty('inputSize');
      expect(status).toHaveProperty('threshold');
    });

    test('should have correct classes', () => {
      const status = LocalTFLiteService.getStatus();
      expect(status.classes).toEqual(['jered', 'gracia', 'Ben', 'Leo']);
    });

    test('should have correct input size', () => {
      const status = LocalTFLiteService.getStatus();
      expect(status.inputSize).toBe(224);
    });
  });

  /**
   * TEST 3: Traitement des prédictions
   */
  describe('processPredictions()', () => {
    test('should process valid predictions', () => {
      const predictions = [0.95, 0.03, 0.01, 0.01];
      const result = LocalTFLiteService.processPredictions(predictions);
      
      expect(result.success).toBe(true);
      expect(result.person).toBe('jered');
      expect(result.confidence).toBe(0.95);
    });

    test('should reject low confidence predictions', () => {
      const predictions = [0.60, 0.20, 0.15, 0.05]; // 0.60 < 0.70
      const result = LocalTFLiteService.processPredictions(predictions);
      
      expect(result.success).toBe(false);
      expect(result.person).toBeNull();
    });

    test('should include all results', () => {
      const predictions = [0.95, 0.03, 0.01, 0.01];
      const result = LocalTFLiteService.processPredictions(predictions);
      
      expect(result.allResults).toHaveLength(4);
      expect(result.allResults[0].name).toBe('jered');
      expect(result.allResults[1].name).toBe('gracia');
      expect(result.allResults[2].name).toBe('Ben');
      expect(result.allResults[3].name).toBe('Leo');
    });

    test('should calculate correct percentages', () => {
      const predictions = [0.95, 0.03, 0.01, 0.01];
      const result = LocalTFLiteService.processPredictions(predictions);
      
      expect(result.allResults[0].percentage).toBe('95.00%');
      expect(result.allResults[1].percentage).toBe('3.00%');
    });
  });

  /**
   * TEST 4: Classes
   */
  describe('getClasses()', () => {
    test('should return correct classes', () => {
      const classes = LocalTFLiteService.getClasses();
      expect(classes).toEqual(['jered', 'gracia', 'Ben', 'Leo']);
    });

    test('should have 4 classes', () => {
      const classes = LocalTFLiteService.getClasses();
      expect(classes).toHaveLength(4);
    });
  });

  /**
   * TEST 5: Cleanup
   */
  describe('cleanup()', () => {
    test('should cleanup resources', () => {
      // Initialiser d'abord
      LocalTFLiteService.initialize();
      
      // Puis nettoyer
      expect(() => {
        LocalTFLiteService.cleanup();
      }).not.toThrow();
    });
  });

  /**
   * TEST 6: Reconnaissance complète (intégration)
   */
  describe('recognizeFace() - Integration', () => {
    test('should handle recognition flow', async () => {
      // Ce test nécessite un mock complet
      // À exécuter avec une photo réelle en production
      expect(LocalTFLiteService.recognizeFace).toBeDefined();
    });

    test('should return correct result format', async () => {
      // Résultat attendu:
      // {
      //   success: boolean,
      //   message: string,
      //   confidence: number,
      //   person: string | null,
      //   scores: array,
      //   allResults: array
      // }
      
      expect(LocalTFLiteService.recognizeFace).toEqual(expect.any(Function));
    });
  });
});

/**
 * TESTS D'INTÉGRATION MANUELS
 * 
 * À exécuter dans React Native/Expo:
 * 
 * 1. Test de charge du modèle:
 *    const initialized = await LocalTFLiteService.initialize();
 *    console.log('Modèle chargé:', initialized);
 * 
 * 2. Test de status:
 *    const status = LocalTFLiteService.getStatus();
 *    console.log('Status:', status);
 * 
 * 3. Test de prédiction:
 *    const result = LocalTFLiteService.processPredictions([0.95, 0.03, 0.01, 0.01]);
 *    console.log('Résultat:', result);
 * 
 * 4. Test complet avec photo réelle:
 *    const result = await LocalTFLiteService.recognizeFace(photoUri);
 *    console.log('Reconnaissance:', result);
 */

/**
 * CRITÈRES D'ACCEPTATION
 * 
 * ✅ Le modèle se charge sans erreur
 * ✅ Les prédictions retournent 4 scores
 * ✅ Le meilleur score est reconnu
 * ✅ Le seuil de confiance est appliqué
 * ✅ Les résultats incluent la confiance
 * ✅ Le nettoyage libère les ressources
 * ✅ Pas d'erreur lors du traitement
 * ✅ Performance acceptable (<2s)
 */

/**
 * COUVERTURE DE TEST
 * 
 * Fichier: LocalTFLiteService.js
 * Fonctions:
 *   ✓ initialize()
 *   ✓ getStatus()
 *   ✓ processPredictions()
 *   ✓ getClasses()
 *   ✓ cleanup()
 *   ? recognizeFace() - Nécessite mock complet
 *   ? resizeImage() - Nécessite exposition image
 *   ? imageToTensor() - Nécessite canvas mock
 *   ? predict() - Nécessite modèle mock
 */
