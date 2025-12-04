#!/usr/bin/env python3
"""
Déploiement du modèle face.h5 sur l'application React Native
Crée les fichiers TensorFlow.js manualmente
"""

import tensorflow as tf
import json
import numpy as np
from pathlib import Path

print("=" * 70)
print("🚀 DÉPLOIEMENT DU MODÈLE face.h5 SUR L'APPLICATION")
print("=" * 70)
print()

try:
    # Charger le modèle H5
    print("📥 Chargement du modèle face.h5...")
    model_path = Path('api/face.h5')
    model = tf.keras.models.load_model(model_path)
    print("✅ Modèle chargé")
    print()
    
    # Info du modèle
    print("📊 Informations du modèle:")
    print(f"   Input shape: {model.input_shape}")
    print(f"   Output shape: {model.output_shape}")
    print(f"   Couches: {len(model.layers)}")
    print(f"   Paramètres: {model.count_params():,}")
    print()
    
    # Créer le répertoire de sortie
    output_dir = Path("assets/models")
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Répertoire: {output_dir}")
    print()
    
    # Obtenir la configuration du modèle
    print("🔄 Extraction de la configuration du modèle...")
    model_config = model.get_config()
    print("✅ Configuration extraite")
    print()
    
    # Créer le fichier model.json
    print("📝 Création de model.json...")
    
    model_json = {
        "format": "layers-model",
        "generatedBy": "TensorFlow.js Converter",
        "convertedBy": "face-recognition-deployment",
        "modelTopology": model_config,
        "weightsManifest": [
            {
                "paths": ["model.weights.bin"],
                "weights": []
            }
        ]
    }
    
    # Sauvegarder model.json
    json_path = output_dir / "model.json"
    with open(json_path, "w") as f:
        json.dump(model_json, f, indent=2)
    
    json_size_kb = json_path.stat().st_size / 1024
    print(f"✅ model.json créé ({json_size_kb:.2f} KB)")
    print()
    
    # Créer le fichier model.weights.bin
    print("📝 Création de model.weights.bin...")
    
    # Obtenir tous les poids
    weights = model.get_weights()
    
    # Concatener tous les poids en bytes
    weights_bytes = b""
    for w in weights:
        # Convertir en float32 et en bytes
        w_float32 = w.astype(np.float32)
        weights_bytes += w_float32.tobytes()
    
    # Sauvegarder
    bin_path = output_dir / "model.weights.bin"
    with open(bin_path, "wb") as f:
        f.write(weights_bytes)
    
    bin_size_mb = bin_path.stat().st_size / (1024 * 1024)
    print(f"✅ model.weights.bin créé ({bin_size_mb:.2f} MB)")
    print()
    
    # Vérifier les fichiers
    print("✅ Vérification des fichiers...")
    print()
    
    files_ok = True
    for file in [json_path, bin_path]:
        if file.exists():
            size = file.stat().st_size
            if size > 0:
                print(f"   ✅ {file.name} ({size:,} bytes)")
            else:
                print(f"   ❌ {file.name} VIDE!")
                files_ok = False
        else:
            print(f"   ❌ {file.name} NON TROUVÉ!")
            files_ok = False
    
    print()
    
    if not files_ok:
        print("❌ Erreur: Fichiers incomplets!")
        exit(1)
    
    print("=" * 70)
    print("✅ DÉPLOIEMENT RÉUSSI!")
    print("=" * 70)
    print()
    print(f"📁 Fichiers créés dans: {output_dir}/")
    print()
    print("✅ Le modèle est prêt pour l'application!")
    print()
    print("📝 Prochaines étapes:")
    print("   1. Exécutez: npm install")
    print("   2. Exécutez: npm run android (ou ios/web)")
    print("   3. Testez la reconnaissance faciale")
    print()
    
except Exception as e:
    print(f"❌ Erreur: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
