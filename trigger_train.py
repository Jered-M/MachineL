import requests
import json

API_URL = "https://ml-api-3jf9.onrender.com"

print("=" * 70)
print("REQUETE D'ENTRAINEMENT")
print("=" * 70)
print()
print(f"Envoi de la requete a: {API_URL}/train")
print()

try:
    response = requests.post(
        f"{API_URL}/train",
        timeout=600  # 10 minutes timeout
    )
    
    print(f"Status: {response.status_code}")
    print()
    
    result = response.json()
    
    if result.get('success'):
        print("OK! Modele entraine avec succes")
        print()
        print(f"Total images: {result.get('total_images')}")
        print(f"Accuracy: {result.get('accuracy_percent')}")
    else:
        print(f"Erreur: {result.get('error')}")
        
except Exception as e:
    print(f"Erreur: {e}")

print()
print("=" * 70)
