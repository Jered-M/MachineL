@echo off
REM Script pour démarrer l'API Python et l'app Expo

echo.
echo ========================================
echo 🚀 Démarrage de l'API Python
echo ========================================
echo.

REM Aller dans le dossier api
cd api

REM Activer l'environnement virtuel
call .venv\Scripts\activate.bat

REM Lancer l'API
python app.py
