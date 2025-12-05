import os
import sys
import numpy as np
from mtcnn import MTCNN
from PIL import Image
import shutil
from pathlib import Path

# Fix encoding
sys.stdout.reconfigure(encoding='utf-8')

print('=' * 70)
print('EXTRACTION DES VISAGES - MTCNN')
print('=' * 70)

# Initialiser le détecteur MTCNN
detector = MTCNN()

# Chemins
dataset_path = r'c:\Users\HP\Music\machineL\face1_balanced'
output_path = r'c:\Users\HP\Music\machineL\face1_faces_only'

classes = ['Ben', 'gracia', 'Jered', 'Leo']

print()
print('1️⃣ Creer le dossier de sortie...')
if os.path.exists(output_path):
    shutil.rmtree(output_path)
for person in classes:
    os.makedirs(os.path.join(output_path, person), exist_ok=True)
print(f'Dossier cree: {output_path}')

print()
print('2️⃣ Traitement des images...')
print()

total_processed = 0
total_failed = 0
total_skipped = 0

for person in classes:
    person_dir = os.path.join(dataset_path, person)
    output_dir = os.path.join(output_path, person)
    
    images = [f for f in os.listdir(person_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    print(f'{person}: {len(images)} images')
    
    processed = 0
    failed = 0
    skipped = 0
    
    for i, img_file in enumerate(images):
        img_path = os.path.join(person_dir, img_file)
        
        try:
            # Charger l'image avec PIL
            img_pil = Image.open(img_path)
            if img_pil.mode != 'RGB':
                img_pil = img_pil.convert('RGB')
            
            img_array = np.array(img_pil)
            
            # Detecter les visages
            detections = detector.detect_faces(img_array)
            
            if len(detections) == 0:
                # Pas de visage trouve - garder l'image entiere redimensionnee
                face_resized = img_pil.resize((224, 224), Image.Resampling.LANCZOS)
                output_file = os.path.join(output_dir, img_file)
                face_resized.save(output_file, quality=95)
                skipped += 1
            
            elif len(detections) == 1:
                # Un visage trouve - cropper
                face = detections[0]
                x, y, width, height = face['box']
                
                # Ajouter padding pour avoir plus de contexte
                padding = 20
                x = max(0, x - padding)
                y = max(0, y - padding)
                width = min(img_array.shape[1] - x, width + padding * 2)
                height = min(img_array.shape[0] - y, height + padding * 2)
                
                # Cropper le visage
                face_crop = img_pil.crop((x, y, x + width, y + height))
                
                # Redimensionner a 224x224
                face_resized = face_crop.resize((224, 224), Image.Resampling.LANCZOS)
                
                # Sauvegarder
                output_file = os.path.join(output_dir, img_file)
                face_resized.save(output_file, quality=95)
                
                processed += 1
            
            else:
                # Plusieurs visages - prendre le plus grand
                face = max(detections, key=lambda x: x['box'][2] * x['box'][3])
                x, y, width, height = face['box']
                
                # Ajouter padding
                padding = 20
                x = max(0, x - padding)
                y = max(0, y - padding)
                width = min(img_array.shape[1] - x, width + padding * 2)
                height = min(img_array.shape[0] - y, height + padding * 2)
                
                # Cropper et redimensionner
                face_crop = img_pil.crop((x, y, x + width, y + height))
                face_resized = face_crop.resize((224, 224), Image.Resampling.LANCZOS)
                
                # Sauvegarder
                output_file = os.path.join(output_dir, img_file)
                face_resized.save(output_file, quality=95)
                
                processed += 1
        
        except Exception as e:
            failed += 1
            print(f'  Erreur {img_file}: {str(e)[:50]}')
        
        # Progress
        if (i + 1) % 100 == 0:
            print(f'  Traite: {i + 1}/{len(images)}')
    
    print(f'  Succes: {processed}')
    if skipped > 0:
        print(f'  Pas de visage: {skipped} (image redimensionnee)')
    if failed > 0:
        print(f'  Erreurs: {failed}')
    print()
    
    total_processed += processed
    total_failed += failed
    total_skipped += skipped

print('=' * 70)
print('RESUME')
print('=' * 70)
print()

for person in classes:
    output_dir = os.path.join(output_path, person)
    count = len([f for f in os.listdir(output_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    print(f'{person}: {count} visages extraits')

total = total_processed + total_skipped
print()
print(f'Total traite: {total_processed} (detection reussie)')
print(f'Total sans visage: {total_skipped} (image complete)')
print(f'Total erreurs: {total_failed}')
print(f'Total sauvegarde: {total_processed + total_skipped} images')
print()
print('=' * 70)
print('EXTRACTION TERMINEE!')
print('=' * 70)
print()
print('Notes:')
print('   1. Utiliser face1_faces_only a la place de face1_balanced')
print('   2. Retrainer le modele avec les visages extraits')
print('   3. La reconnaissance devrait etre beaucoup meilleure!')
