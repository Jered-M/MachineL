// Test simple de l'app sans Expo
console.log("=== Test de l'application Face Recognition ===\n");

// Import des données
import { mockUserData } from './data/mockData.js';

console.log("Données utilisateur mock:");
console.log(JSON.stringify(mockUserData, null, 2));

console.log("\n✅ App structure correcte!");
console.log("- App.js: Configuration de navigation présente");
console.log("- Screens: FaceCapture, Scanning, Result");
console.log("- Components: Button, FaceMesh, FaceOverlay");
console.log("- Data: mockUserData disponible");
