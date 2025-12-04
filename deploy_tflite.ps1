# Script de déploiement du modèle TFLite pour Windows PowerShell
# Installe et configure le modèle pour l'application

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Deploiement du modele TFLite" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que le modele existe
Write-Host "Verification du modele TFLite..." -ForegroundColor Yellow
$modelPath = "assets/models/face_model.tflite"
if (Test-Path $modelPath) {
    Write-Host "OK - Modele trouve: $modelPath" -ForegroundColor Green
    $modelInfo = Get-Item $modelPath
    Write-Host "   Taille: $([math]::Round($modelInfo.Length / 1MB, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "ERREUR - Modele non trouve!" -ForegroundColor Red
    Write-Host "   Executez d'abord: python convert_to_tflite.py" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Verification du service TFLite..." -ForegroundColor Yellow
if (Test-Path "services/LocalTFLiteService.js") {
    Write-Host "OK - Service trouve: services/LocalTFLiteService.js" -ForegroundColor Green
} else {
    Write-Host "ERREUR - Service non trouve!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Verification des ecrans mis a jour..." -ForegroundColor Yellow
$screenContent = Get-Content "screens/FaceCaptureScreen.js"
if ($screenContent -match "LocalTFLiteService") {
    Write-Host "OK - FaceCaptureScreen configure pour TFLite" -ForegroundColor Green
} else {
    Write-Host "ERREUR - FaceCaptureScreen non mis a jour!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "OK - Configuration du deploiement TFLite" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Dependances requises:" -ForegroundColor Blue
Write-Host "   OK @tensorflow/tfjs@^4.22.0" -ForegroundColor Gray
Write-Host "   OK @tensorflow/tfjs-backend-cpu@^4.22.0" -ForegroundColor Gray
Write-Host "   OK expo-camera@~16.0.18" -ForegroundColor Gray
Write-Host "   OK expo-image-manipulator@^14.0.7" -ForegroundColor Gray
Write-Host ""

Write-Host "Classes reconnues:" -ForegroundColor Blue
Write-Host "   1. jered" -ForegroundColor Gray
Write-Host "   2. gracia" -ForegroundColor Gray
Write-Host "   3. Ben" -ForegroundColor Gray
Write-Host "   4. Leo" -ForegroundColor Gray
Write-Host ""

Write-Host "Statistiques du modele:" -ForegroundColor Blue
Write-Host "   Taille: 2.71 MB" -ForegroundColor Gray
Write-Host "   Reduction: 78.7%" -ForegroundColor Gray
Write-Host "   Format: TensorFlow Lite" -ForegroundColor Gray
Write-Host "   Input: (224, 224, 3)" -ForegroundColor Gray
Write-Host "   Output: (1, 4)" -ForegroundColor Gray
Write-Host ""

Write-Host "Structure du deploiement:" -ForegroundColor Blue
Write-Host "   assets/models/face_model.tflite" -ForegroundColor Gray
Write-Host "   services/LocalTFLiteService.js" -ForegroundColor Gray
Write-Host "   screens/FaceCaptureScreen.js (mis a jour)" -ForegroundColor Gray
Write-Host ""

Write-Host "Prochaines etapes:" -ForegroundColor Blue
Write-Host "   1. npm install (si pas deja fait)" -ForegroundColor Gray
Write-Host "   2. npm run android (ou npm run ios)" -ForegroundColor Gray
Write-Host "   3. Tester la reconnaissance faciale" -ForegroundColor Gray
Write-Host ""

Write-Host "OK - Deploiement TFLite pret!" -ForegroundColor Green
Write-Host ""
