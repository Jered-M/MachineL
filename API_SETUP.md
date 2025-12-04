# 🚀 Configuration API Distant - Face Recognition App

## 📋 Architecture

```
PC Développement:
├── api/
│   ├── app.py (Flask - Port 5000)
│   ├── interface.html (Web UI)
│   └── requirements.txt
└── face.h5 (Modèle TensorFlow)

Téléphone Android:
└── App React Native
    └── Appel API via RemoteAPIService.js
```

## ⚙️ Configuration

### 1️⃣ Sur le PC (API Flask)

L'API est déjà lancée sur:
- **URL**: `http://localhost:5000`
- **Port**: `5000`
- **Modèle**: `face.h5` (TensorFlow)

Endpoints disponibles:
- `GET /health` - Vérifier la connexion
- `POST /recognize` - Reconnaissance faciale (image base64)
- `POST /register` - Enregistrer un visage
- `GET /employees` - Lister les employés

### 2️⃣ Sur le Téléphone (App React Native)

#### Option A: Réseau WiFi local

1. Trouvez l'adresse IP de votre PC:
   ```powershell
   # Windows
   ipconfig
   # Cherchez: IPv4 Address: 192.168.x.x
   ```

2. Modifiez `RemoteAPIService.js`:
   ```javascript
   this.API_BASE_URL = 'http://192.168.x.x:5000';
   ```

3. Lancez l'app:
   ```bash
   npm start
   ```

4. Sur l'app, allez dans **APIRecognition** → ⚙️ (Settings)

5. Entrez l'URL de l'API: `http://192.168.x.x:5000`

#### Option B: USB Debugging (Recommandé)

```bash
# Diriger le trafic du téléphone vers le PC
adb reverse tcp:5000 tcp:5000

# Utilisez http://127.0.0.1:5000 ou http://localhost:5000
```

## 🎯 Utilisation

### Via l'App React Native

1. **Écran d'accueil** → Bouton "🌐 Utiliser l'API Distant"

2. **Écran APIRecognition**:
   - 📷 **Capturer une photo**: Appuyez sur le bouton "Capturer"
   - 🔍 **Reconnaître**: L'app enverra l'image à l'API
   - 💾 **Enregistrer**: Entrez un nom et enregistrez le visage

3. **Résultats**:
   - ✅ Reconnaissance réussie: Nom + Confiance
   - ⚠️ Échec: "Personne INCONNUE" ou erreur

### Via l'Interface Web (PC)

Accédez à: `http://localhost:5000`

Fonction identique à l'app mobile

## 📝 Chemin des fichiers

```
c:\Users\HP\Music\machineL\faceRecognitionApp\
├── api/
│   ├── app.py              ← API Flask
│   ├── interface.html      ← UI Web
│   └── requirements.txt
├── services/
│   └── RemoteAPIService.js ← Service d'API (à modifier)
├── screens/
│   └── APIRecognitionScreen.js ← Écran de l'app
├── face.h5                 ← Modèle TensorFlow
└── App.js                  ← Navigation
```

## 🔧 Troubleshooting

### ❌ "API Déconnectée"

1. Vérifiez que l'API Flask est lancée:
   ```bash
   cd api && python app.py
   ```

2. Vérifiez l'adresse IP:
   ```bash
   # Depuis le PC
   ipconfig
   # Depuis le téléphone, ping l'adresse IP
   adb shell ping 192.168.x.x
   ```

3. Vérifiez le pare-feu:
   - Autorisez Python (port 5000) dans le pare-feu Windows

### ❌ "Impossible de se connecter"

1. **Sur un réseau local**: Assurez-vous que le PC et le téléphone sont sur le même WiFi

2. **Via USB**: Utilisez:
   ```bash
   adb reverse tcp:5000 tcp:5000
   ```

3. **Test de connexion**:
   ```bash
   # Depuis le téléphone
   adb shell curl http://192.168.x.x:5000/health
   ```

### ❌ "Erreur lors du traitement"

- Vérifiez que le modèle `face.h5` existe au chemin correct
- Vérifiez les logs de l'API: `INFO:werkzeug:...`
- Rechargez l'app React Native

## 📊 Flux de requête

```
App Mobile
    ↓
[Capture Photo]
    ↓
[Convertir en Base64]
    ↓
RemoteAPIService.recognizeFace()
    ↓
POST /recognize
    ↓
API Flask (face.h5)
    ↓
[Prédiction TensorFlow]
    ↓
JSON Response
    ↓
Afficher résultat
```

## 🎓 Commandes utiles

```bash
# Vérifier la connexion API depuis le PC
curl http://localhost:5000/health

# Lancer l'API
cd api && python app.py

# Lancer l'app React Native
npm start

# Utiliser l'app avec USB Debugging
adb reverse tcp:5000 tcp:5000
npx expo run:android

# Logs en temps réel
adb logcat | grep "FaceRecognition"
```

## 📞 Support

Pour modifier l'adresse IP de l'API:
1. Ouvrez l'app
2. Allez sur l'écran **APIRecognition**
3. Appuyez sur ⚙️ (Settings)
4. Entrez la nouvelle URL

---

**✅ Prêt à utiliser !** 🚀
