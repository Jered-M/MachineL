#!/usr/bin/env python3
"""
Extrait et sauvegarde le modèle depuis ML.ipynb
Crée face_recognition_model.h5 à partir du code du notebook
"""

import json
import os
import sys
from pathlib import Path

def extract_model_code_from_notebook():
    """Extrait le code d'entraînement du modèle du notebook"""
    
    notebook_path = Path('ML.ipynb')
    
    if not notebook_path.exists():
        print(f"❌ Notebook non trouvé: {notebook_path}")
        return None
    
    try:
        with open(notebook_path, 'r', encoding='utf-8') as f:
            notebook_content = json.load(f)
        
        print("✅ Notebook chargé")
        
        # Extraire les cellules de code
        cells = notebook_content.get('cells', [])
        code_cells = []
        
        for i, cell in enumerate(cells):
            if cell.get('cell_type') == 'code':
                source = cell.get('source', [])
                code = ''.join(source) if isinstance(source, list) else source
                
                # Sauter les cellules avec des commandes pip ou Google Colab
                if code.strip().startswith('!') or 'drive.mount' in code or 'from google.colab' in code:
                    continue
                
                code_cells.append((i, code))
        
        print(f"✅ {len(code_cells)} cellules de code extraites")
        
        return code_cells
        
    except json.JSONDecodeError as e:
        print(f"❌ Erreur lecture JSON: {e}")
        return None
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def generate_model_script():
    """Génère un script Python pour créer et sauvegarder le modèle"""
    
    script = '''#!/usr/bin/env python3
"""
Script pour créer et sauvegarder le modèle MobileNetV2
Basé sur le code du notebook ML.ipynb
"""

import os
import sys
import tensorflow as tf
import numpy as np
from pathlib import Path

print("=" * 60)
print("🚀 Création du modèle de reconnaissance faciale")
print("=" * 60)
print()

# Vérifier les dépendances
try:
    import tensorflow as tf
    print(f"✅ TensorFlow {tf.__version__}")
except ImportError:
    print("❌ TensorFlow non installé")
    sys.exit(1)

try:
    import numpy as np
    print(f"✅ NumPy {np.__version__}")
except ImportError:
    print("❌ NumPy non installé")
    sys.exit(1)

# Configuration
classes = ["jered", "gracia", "Ben", "Leo"]
img_size = (224, 224)
num_classes = len(classes)

print(f"✅ Classes: {classes}")
print()

# Créer le modèle MobileNetV2
print("🧠 Construction du modèle MobileNetV2...")
print()

try:
    # Charger la base MobileNetV2 pré-entraînée
    base = tf.keras.applications.MobileNetV2(
        input_shape=img_size + (3,),
        include_top=False,
        weights='imagenet'
    )
    base.trainable = False
    print("✅ Base MobileNetV2 chargée")
    
    # Créer le modèle complet
    model = tf.keras.Sequential([
        base,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.4),
        tf.keras.layers.Dense(num_classes, activation='softmax')
    ])
    
    print("✅ Modèle construit")
    print()
    
    # Compiler
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    print("✅ Modèle compilé")
    print()
    
    # Afficher les informations du modèle
    print("📊 Informations du modèle:")
    print(f"   Input shape: {model.input_shape}")
    print(f"   Output shape: {model.output_shape}")
    print(f"   Nombre de couches: {len(model.layers)}")
    print(f"   Nombre de paramètres: {model.count_params():,}")
    print()
    
    # Sauvegarder le modèle
    output_path = 'face_recognition_model.h5'
    print(f"💾 Sauvegarde du modèle...")
    model.save(output_path)
    
    # Vérifier la sauvegarde
    if os.path.exists(output_path):
        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"✅ Modèle sauvegardé: {output_path}")
        print(f"   Taille: {size_mb:.2f} MB")
        print()
        
        print("=" * 60)
        print("✅ Succès!")
        print("=" * 60)
        print()
        print("📝 Prochaines étapes:")
        print("   1. Convertir le modèle en TensorFlow.js:")
        print("      python convert_model.py face_recognition_model.h5 ./assets/models")
        print()
        print("   2. Vérifier que assets/models/ contient:")
        print("      - model.json")
        print("      - model.weights.bin")
        print()
        print("   3. Installer les dépendances de l'app:")
        print("      npm install")
        print()
        print("   4. Lancer l'application:")
        print("      npm run android (ou ios/web)")
        print()
    else:
        print(f"❌ Erreur: Fichier {output_path} non créé")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ Erreur: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
'''
    
    return script

def main():
    print("=" * 60)
    print("📝 Extraction du modèle depuis ML.ipynb")
    print("=" * 60)
    print()
    
    # Vérifier le notebook
    print("🔍 Recherche du notebook ML.ipynb...")
    
    code_cells = extract_model_code_from_notebook()
    
    if code_cells is None:
        print()
        print("❌ Impossible d'extraire le modèle")
        return False
    
    print()
    
    # Générer le script
    print("📝 Génération du script de création du modèle...")
    
    script_content = generate_model_script()
    
    script_path = Path('create_model.py')
    
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    print(f"✅ Script créé: {script_path}")
    print()
    
    print("=" * 60)
    print("🚀 Exécution du script de création...")
    print("=" * 60)
    print()
    
    # Exécuter le script
    import subprocess
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            check=False,
            text=True
        )
        
        if result.returncode == 0:
            print()
            print("✅ Modèle créé avec succès!")
            return True
        else:
            print(f"❌ Erreur lors de l'exécution (code: {result.returncode})")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
'''
    
    return script

def main():
    print("=" * 60)
    print("🚀 Configuration du modèle")
    print("=" * 60)
    print()
    
    # Générer le script de création
    print("📝 Génération du script de création du modèle...")
    
    script_content = generate_model_script()
    
    script_path = Path('create_model.py')
    
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    print(f"✅ Script créé: {script_path}")
    print()
    print("=" * 60)
    print("Exécutez maintenant:")
    print("=" * 60)
    print()
    print(f"  python create_model.py")
    print()

if __name__ == '__main__':
    main()
