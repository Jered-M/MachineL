#!/usr/bin/env python3
"""
Script pour extraire et entraîner le modèle depuis ML.ipynb
Crée un fichier face_recognition_model.h5 prêt pour conversion
"""

import subprocess
import os
import sys
from pathlib import Path

def run_notebook_locally():
    """
    Exécute le notebook ML.ipynb localement sans Colab
    Crée le modèle face_recognition_model.h5
    """
    print("=" * 60)
    print("🚀 Préparation du modèle depuis ML.ipynb")
    print("=" * 60)
    print()
    
    print("⚠️  Important:")
    print("   Ce script exécutera le notebook ML.ipynb localement.")
    print("   Assurez-vous que :")
    print("   1. Vos données sont accessibles (dataset/faces)")
    print("   2. TensorFlow est installé")
    print("   3. Vous avez assez d'espace disque (~100MB)")
    print()
    
    # Chercher le notebook
    notebook_path = Path('ML.ipynb')
    if not notebook_path.exists():
        print(f"❌ Notebook non trouvé : {notebook_path}")
        print()
        print("📁 Fichiers trouvés :")
        for file in Path('.').glob('*.ipynb'):
            print(f"   - {file}")
        return False
    
    print(f"✅ Notebook trouvé : {notebook_path}")
    print()
    
    # Option 1 : Utiliser nbconvert + jupyter
    print("📝 Conversion du notebook en script Python...")
    
    try:
        # Convertir notebook en script Python
        cmd = ['jupyter', 'nbconvert', '--to', 'script', 'ML.ipynb']
        print(f"   Exécution: {' '.join(cmd)}")
        
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print("✅ Conversion réussie")
        
        # Le script généré s'appelle ML.py
        if Path('ML.py').exists():
            print()
            print("⚠️  Important :")
            print("   Veuillez éditer ML.py avant exécution :")
            print("   1. Remplacez les chemins Colab par des chemins locaux")
            print("   2. Supprimez les commandes !pip install")
            print("   3. Modifiez dataset_path")
            print()
            print("📝 Exemple de modification :")
            print('   # Avant: dataset_path = "/content/drive/MyDrive/machineL/face"')
            print('   # Après: dataset_path = "./data/faces"')
            print()
            print("   Puis exécutez : python ML.py")
            print()
        
        return True
        
    except FileNotFoundError:
        print("⚠️  jupyter nbconvert non trouvé")
        print()
        return False
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur: {e}")
        print(f"   stderr: {e.stderr}")
        return False

def create_minimal_model():
    """
    Crée un modèle minimal pour démonstration/test
    """
    print("=" * 60)
    print("🧠 Création d'un modèle minimal pour test")
    print("=" * 60)
    print()
    
    code = """
import tensorflow as tf
import numpy as np
from tensorflow.keras.applications import MobileNetV2

# Créer un modèle MobileNetV2 pour 4 classes
base = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base.trainable = False

model = tf.keras.Sequential([
    base,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.4),
    tf.keras.layers.Dense(4, activation='softmax')  # 4 classes: jered, gracia, Ben, Leo
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

print("✅ Modèle créé avec succès")
print(f"   Input shape: {model.input_shape}")
print(f"   Output shape: {model.output_shape}")

# Sauvegarder le modèle
model.save('face_recognition_model.h5')
print("✅ Modèle sauvegardé: face_recognition_model.h5")
print(f"   Taille: {os.path.getsize('face_recognition_model.h5') / (1024*1024):.2f} MB")

import os
"""
    
    print("📝 Exécution du code de création du modèle...")
    print()
    
    try:
        import os
        exec(code.replace('import os\n', ''))
        print()
        print("✅ Modèle minimal créé")
        return True
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    # Vérifier les installations
    print("🔍 Vérification des dépendances...\n")
    
    try:
        import tensorflow
        print(f"✅ TensorFlow {tensorflow.__version__}")
    except ImportError:
        print("❌ TensorFlow non installé: pip install tensorflow")
        sys.exit(1)
    
    try:
        import jupyter
        has_jupyter = True
        print(f"✅ Jupyter installé")
    except ImportError:
        has_jupyter = False
        print("⚠️  Jupyter non installé (optionnel)")
    
    print()
    
    # Essayer de convertir le notebook
    if has_jupyter:
        if run_notebook_locally():
            return True
    
    print()
    print("=" * 60)
    print("ℹ️  Options pour obtenir le modèle :")
    print("=" * 60)
    print()
    print("Option 1 : Depuis Google Colab (Recommandé)")
    print("   1. Ouvrez votre notebook Colab")
    print("   2. Exécutez toutes les cellules jusqu'à model.save()")
    print("   3. Téléchargez le fichier face_recognition_model.h5")
    print("   4. Placez-le dans: C:\\Users\\HP\\Music\\machineL\\faceRecognitionApp\\")
    print()
    print("Option 2 : Depuis Google Drive")
    print("   1. Connectez-vous à Google Drive")
    print("   2. Cherchez le fichier dans: My Drive > machineL")
    print("   3. Téléchargez face_recognition_model.h5")
    print()
    print("Option 3 : Créer un modèle minimal (pour test)")
    print("   python setup_model.py --create-minimal")
    print()

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--create-minimal':
        import os
        create_minimal_model()
    else:
        main()
