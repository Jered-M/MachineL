import tensorflow as tf

# 1. Charger ton modèle entraîné (.h5)
model = tf.keras.models.load_model("face.h5")

# 2. Convertisseur TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# (OPTIONNEL mais conseillé : quantization pour mobile)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

# 3. Convertir
tflite_model = converter.convert()

# 4. Sauvegarder le modèle TFLite
with open("model.tflite", "wb") as f:
    f.write(tflite_model)

print("🎉 Conversion terminée ! Fichier généré : model.tflite")
