#!/usr/bin/env python3
"""
Convertisseur simple et direct H5 vers TensorFlow.js
"""

import os
import json
import tensorflow as tf
from pathlib import Path

print("=" * 70)
print("🚀 Conversion du modèle H5 vers TensorFlow.js")
print("=" * 70)
print()

# Paramètres
h5_file = "face.h5"
output_dir = "./assets/models"

# Vérifier le fichier H5
if not Path(h5_file).exists():
    print(f"❌ Erreur: {h5_file} non trouvé")
    exit(1)

print(f"📥 Chargement du modèle: {h5_file}")

# Charger le modèle
try:
    model = tf.keras.models.load_model(h5_file)
    print("✅ Modèle chargé")
    print()
    
    print("📊 Informations du modèle:")
    print(f"   Input shape: {model.input_shape}")
    print(f"   Output shape: {model.output_shape}")
    print(f"   Couches: {len(model.layers)}")
    print(f"   Paramètres: {model.count_params():,}")
    print()
    
    # Créer le répertoire de sortie
    os.makedirs(output_dir, exist_ok=True)
    
    # Utiliser tensorflowjs_converter via subprocess
    print(f"🔄 Conversion en TensorFlow.js...")
    print(f"   Output: {output_dir}")
    print()
    
    from tensorflowjs.converters.converter import convert
    
    # Convertir directement le fichier H5
    convert(
        input_path=h5_file,
        output_path=output_dir,
        input_format='keras'
    )
    
    print()
    print("✅ Conversion réussie!")
    print()
    
    # Vérifier les fichiers
    print("📂 Fichiers générés:")
    for file in Path(output_dir).glob("*"):
        size = file.stat().st_size
        if size > 1024*1024:
            print(f"   ✅ {file.name} ({size/(1024*1024):.2f} MB)")
        elif size > 1024:
            print(f"   ✅ {file.name} ({size/1024:.2f} KB)")
        else:
            print(f"   ✅ {file.name} ({size} bytes)")
    
    print()
    print("=" * 70)
    print("✅ Succès! Le modèle est prêt pour deployment")
    print("=" * 70)
    
except Exception as e:
    print(f"❌ Erreur: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
