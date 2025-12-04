// Simple HTTP server to serve model files for Expo app
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir les fichiers du modèle
app.use('/models', express.static(path.join(__dirname, 'assets/models')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur modèle démarré sur http://localhost:${PORT}`);
  console.log(`📦 Modèles disponibles à: http://localhost:${PORT}/models/model.json`);
});
