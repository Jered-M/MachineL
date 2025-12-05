import os
import shutil
import random

print('=' * 70)
print('Régénération du dataset équilibré (650 images par personne)')
print('=' * 70)

# Source
face1_path = r'c:\Users\HP\Music\machineL\face1'
face1_balanced_path = r'c:\Users\HP\Music\machineL\face1_balanced'

classes = ['Ben', 'gracia', 'Jered', 'Leo']
TARGET_COUNT = 650

print()
print('1️⃣ Sauvegarde du backup...')
backup_path = face1_balanced_path + '_backup_before_fix'
if os.path.exists(backup_path):
    shutil.rmtree(backup_path)
shutil.copytree(face1_balanced_path, backup_path)
print(f'✅ Backup créé')

print()
print('2️⃣ Régénération du dataset équilibré...')
print()

for person in classes:
    source_dir = os.path.join(face1_path, person)
    target_dir = os.path.join(face1_balanced_path, person)
    
    if not os.path.exists(source_dir):
        print(f'⚠️ {person}: Dossier source non trouvé')
        continue
    
    images = [f for f in os.listdir(source_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    total_images = len(images)
    
    print(f'📊 {person}: {total_images} -> {TARGET_COUNT}')
    
    if total_images == 0:
        print(f'   ⚠️ Aucune image!')
        continue
    
    if total_images >= TARGET_COUNT:
        selected = sorted(images)[:TARGET_COUNT]
        print(f'   Selection: {TARGET_COUNT} images')
    else:
        selected = images.copy()
        to_add = TARGET_COUNT - total_images
        selected.extend(random.choices(images, k=to_add))
        print(f'   Warning: duplication de {to_add} images')
    
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    os.makedirs(target_dir)
    
    for i, img_file in enumerate(selected):
        src = os.path.join(source_dir, img_file)
        dst = os.path.join(target_dir, img_file)
        
        if os.path.exists(dst):
            name, ext = os.path.splitext(img_file)
            dst = os.path.join(target_dir, f'{name}_d{i}{ext}')
        
        shutil.copy2(src, dst)

print()
print('=' * 70)
print('3️⃣ Verification...')
print('=' * 70)
print()

for person in classes:
    target_dir = os.path.join(face1_balanced_path, person)
    count = len([f for f in os.listdir(target_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    status = 'OK' if count == TARGET_COUNT else 'KO'
    print(f'{status} {person}: {count}')

total = sum([len([f for f in os.listdir(os.path.join(face1_balanced_path, p)) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]) for p in classes])
print()
print(f'Total: {total} images')
print('=' * 70)
print('✅ Régénération terminée!')
print('=' * 70)
