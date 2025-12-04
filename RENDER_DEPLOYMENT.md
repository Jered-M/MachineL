# Déploiement sur Render

## Configuration actuelle

L'API est déployée sur Render avec support du modèle TensorFlow `face.h5`.

### Mode de fonctionnement

#### 1. Avec modèle (Optimal) ✅
Si `face.h5` est présent (25 MB):
- Utilise le modèle TensorFlow entraîné
- Reconnaissance faciale précise
- Confidence >= 70%

#### 2. Mode DEMO (Fallback) 
Si `face.h5` n'est pas trouvé:
- Analyse heuristique de l'image
- Résultats pseudo-déterministes basés sur les caractéristiques
- Utile pour développement/test

## Problème avec Git LFS

Render a du mal à cloner les fichiers Git LFS volumineux. Solutions :

### Solution 1: Uploader `face.h5` via Render Dashboard (Recommandé)

1. Créer un volume Render pour le modèle
2. Uploader `face.h5` via SFTP/CLI
3. Monter le volume dans le service

### Solution 2: Compresser le modèle

```bash
# Sur votre machine
zip -r face_model.zip face.h5

# Push sur GitHub
git add face_model.zip
git commit -m "Add compressed model"
git push
```

Puis dans `api/app.py`, décompresser automatiquement.

### Solution 3: Variable d'environnement avec URL

```bash
MODEL_URL=https://votre-stockage.com/face.h5
```

## Test local

```bash
cd api
python app.py
```

Endpoint test:
```bash
curl http://localhost:5000/health
```

## Logs Render

Pour déboguer, vérifiez:
1. Que les fichiers existent: `ls -la /app/`
2. Que TensorFlow charge le modèle
3. Les chemins absolus vs relatifs

## Endpoints API

- `GET /health` - Vérifier l'API
- `POST /recognize` - Reconnaissance d'image
- `GET /employees` - Lister les classes
