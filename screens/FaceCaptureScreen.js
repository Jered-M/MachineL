import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

import { Colors } from '../constants/Colors';
import { StorageManager } from '../utils/StorageManager';
import { recognizeFaceAPI } from "../services/api";

const { width, height } = Dimensions.get('window');

export const FaceCaptureScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionConfidence, setDetectionConfidence] = useState(0);

  // simulate detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setFaceDetected(true);
      setDetectionConfidence(Math.random() * 100);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = async () => {
    console.log("🎬 Start pressed - Capturing face...");

    if (!cameraRef.current) {
      Alert.alert("Erreur", "Caméra non disponible !");
      return;
    }

    try {
      setIsScanning(true);

      // capture photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      console.log("📸 Photo capturée:", photo.uri);

      // check file
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      if (!fileInfo.exists) {
        throw new Error("Fichier introuvable: " + photo.uri);
      }

      // envoyer au backend (Render)
      console.log("🧠 Envoi à l'API Render...");
      const result = await recognizeFaceAPI(photo.base64);

      console.log("✅ Réponse API:", result);

      navigation.navigate("Scanning", {
        photoUri: photo.uri,
        modelResult: result,
      });

    } catch (error) {
      console.error("❌ Erreur:", error);
      Alert.alert(
        "Erreur",
        "Impossible d'envoyer à l'API Render.\n" + error.message
      );
    } finally {
      setIsScanning(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <CameraView ref={cameraRef} style={styles.camera} facing="front">
        <View style={styles.overlay}>
          {/* Ovale guide */}
          <View style={styles.faceOvalGuide} />
        
          {/* Scan Indicator */}
          {isScanning && (
            <View style={styles.scanningIndicator}>
              <ActivityIndicator size="large" color={Colors.accent} />
              <Text style={styles.scanningText}>Scanning...</Text>
            </View>
          )}
        </View>
      </CameraView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.navigate('RegisterFace')}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>📝 Register</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStart}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>
            {isScanning ? "Scanning..." : "Start"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  faceOvalGuide: {
    width: width * 0.35,
    height: height * 0.25,
    borderWidth: 3,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    borderRadius: height * 0.25,
    backgroundColor: "transparent",
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingVertical: 30,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  cancelButton: {
    flex: 0.45,
    backgroundColor: Colors.surface,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  startButton: {
    flex: 0.45,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  scanningIndicator: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 50,
  },

  scanningText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
});
