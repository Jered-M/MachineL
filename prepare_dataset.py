import os
import sys
import numpy as np
from PIL import Image
import shutil

# Fix encoding
sys.stdout.reconfigure(encoding='utf-8')

print('=' * 70)
print('PREPARATION DU DATASET - Redimensionnement 224x224')
print('=' * 70)

dataset_path = r'c:\Users\HP\Music\machineL\face1_balanced'
output_path = r'c:\Users\HP\Music\machineL\face1_processed'

classes = ['Ben', 'gracia', 'Jered', 'Leo']

print()
print('1. Creer le dossier de sortie...')
if os.path.exists(output_path):
    shutil.rmtree(output_path)
for person in classes:
    os.makedirs(os.path.join(output_path, person), exist_ok=True)
print(f'OK: {output_path}')

print()
print('2. Traitement des images...')
print()

total_processed = 0
total_failed = 0

for person in classes:
    person_dir = os.path.join(dataset_path, person)
    output_dir = os.path.join(output_path, person)
    
    images = [f for f in os.listdir(person_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    print(f'{person}: {len(images)} images')
    
    processed = 0
    failed = 0
    
    for i, img_file in enumerate(images):
        img_path = os.path.join(person_dir, img_file)
        
        try:
            # Charger l'image
            img_pil = Image.open(img_path)
            if img_pil.mode != 'RGB':
                img_pil = img_pil.convert('RGB')
            
            # Redimensionner a 224x224 avec bonne qualite
            img_resized = img_pil.resize((224, 224), Image.Resampling.LANCZOS)
            
            # Sauvegarder avec haute qualite
            output_file = os.path.join(output_dir, img_file)
            img_resized.save(output_file, quality=95)
            
            processed += 1
        
        except Exception as e:
            failed += 1
            if failed <= 3:
                print(f'  Erreur {img_file}: {str(e)[:40]}')
        
        # Progress
        if (i + 1) % 200 == 0:
            print(f'  Traite: {i + 1}/{len(images)}')
    
    print(f'  Succes: {processed}, Erreurs: {failed}')
    total_processed += processed
    total_failed += failed

print()
print('=' * 70)
print('RESUME')
print('=' * 70)
print()

for person in classes:
    output_dir = os.path.join(output_path, person)
    count = len([f for f in os.listdir(output_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    print(f'{person}: {count} images')

total = total_processed
print()
print(f'Total traite: {total} images')
print(f'Total erreurs: {total_failed}')
print()
print('=' * 70)
print('OK! DATASET PRET')
print('=' * 70)
print()
print('Prochain: Modifier notebook pour utiliser face1_processed')
