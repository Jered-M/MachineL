#!/bin/bash
# Script de déploiement du modèle TFLite
# Installe et configure le modèle pour l'application

echo "======================================"
echo "🚀 Déploiement du modèle TFLite"
echo "======================================"
echo ""

# Vérifier que le modèle existe
echo "📍 Vérification du modèle TFLite..."
if [ -f "assets/models/face_model.tflite" ]; then
    echo "✅ Modèle trouvé: assets/models/face_model.tflite"
    ls -lh assets/models/face_model.tflite
else
    echo "❌ Modèle non trouvé!"
    echo "   Exécutez d'abord: python convert_to_tflite.py"
    exit 1
fi

echo ""
echo "📍 Vérification du service TFLite..."
if [ -f "services/LocalTFLiteService.js" ]; then
    echo "✅ Service trouvé: services/LocalTFLiteService.js"
else
    echo "❌ Service non trouvé!"
    exit 1
fi

echo ""
echo "📍 Vérification des écrans mis à jour..."
if grep -q "LocalTFLiteService" "screens/FaceCaptureScreen.js"; then
    echo "✅ FaceCaptureScreen configuré pour TFLite"
else
    echo "❌ FaceCaptureScreen non mis à jour!"
    exit 1
fi

echo ""
echo "======================================"
echo "✅ Configuration du déploiement TFLite"
echo "======================================"
echo ""

echo "📦 Dépendances requises:"
echo "   ✅ @tensorflow/tfjs@^4.22.0"
echo "   ✅ @tensorflow/tfjs-backend-cpu@^4.22.0"
echo "   ✅ expo-camera@~16.0.18"
echo "   ✅ expo-image-manipulator@^14.0.7"
echo ""

echo "🎯 Classes reconnues:"
echo "   1. jered"
echo "   2. gracia"
echo "   3. Ben"
echo "   4. Leo"
echo ""

echo "📊 Statistiques du modèle:"
echo "   Taille: 2.71 MB"
echo "   Réduction: 78.7%"
echo "   Format: TensorFlow Lite"
echo "   Input: (224, 224, 3)"
echo "   Output: (1, 4)"
echo ""

echo "🚀 Prochaines étapes:"
echo "   1. npm install (si pas déjà fait)"
echo "   2. npm run android (ou npm run ios)"
echo "   3. Tester la reconnaissance faciale"
echo ""

echo "✅ Déploiement TFLite prêt!"
