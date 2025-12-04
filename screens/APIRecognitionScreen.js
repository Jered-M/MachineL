import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import remoteAPIService from '../services/RemoteAPIService';

const APIRecognitionScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [personName, setPersonName] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [apiUrl, setApiUrl] = useState('https://machinel.onrender.com/');
  const [showSettings, setShowSettings] = useState(false);
  const [apiStatus, setApiStatus] = useState({ isConnected: false });

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
    checkAPIConnection();
  }, []);

  const checkAPIConnection = async () => {
    try {
      const status = await remoteAPIService.checkConnection();
      setApiStatus({ isConnected: true, ...status });
    } catch (error) {
      setApiStatus({ isConnected: false });
      Alert.alert('Connexion API', `Impossible de se connecter à ${remoteAPIService.API_BASE_URL}`);
    }
  };

  const updateAPIUrl = async () => {
    if (!apiUrl) {
      Alert.alert('Erreur', 'Entrez une URL valide');
      return;
    }

    setLoading(true);
    try {
      await remoteAPIService.setAPIUrl(apiUrl);
      await checkAPIConnection();
      Alert.alert('Succès', 'URL de l\'API mise à jour');
      setShowSettings(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter à cette URL');
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      
      // Redimensionner l'image pour réduire la taille
      const resized = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 0.7, format: 'jpeg' }
      );

      setCapturedImage(resized.uri);
      setResult(null);
      Alert.alert('Photo capturée', 'Prête pour la reconnaissance ou l\'enregistrement');
    } catch (error) {
      Alert.alert('Erreur', `Impossible de capturer la photo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Impossible de convertir l'image: ${error.message}`);
    }
  };

  const recognizeFace = async () => {
    if (!capturedImage) {
      Alert.alert('Erreur', 'Capturez d\'abord une photo');
      return;
    }

    if (!apiStatus.isConnected) {
      Alert.alert('Erreur', 'API non connectée');
      return;
    }

    try {
      setLoading(true);
      const base64 = await convertImageToBase64(capturedImage);
      const response = await remoteAPIService.recognizeFace(base64);
      setResult(response);

      if (response.success) {
        Alert.alert('✅ Reconnaissance réussie', `${response.name}\nConfiance: ${response.percentage}%`);
      } else {
        Alert.alert('⚠️ Résultat', response.error || 'Impossible de reconnaître le visage');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const registerFace = async () => {
    if (!capturedImage) {
      Alert.alert('Erreur', 'Capturez d\'abord une photo');
      return;
    }

    if (!personName.trim()) {
      Alert.alert('Erreur', 'Entrez un nom');
      return;
    }

    if (!apiStatus.isConnected) {
      Alert.alert('Erreur', 'API non connectée');
      return;
    }

    try {
      setLoading(true);
      const base64 = await convertImageToBase64(capturedImage);
      const response = await remoteAPIService.registerFace(personName, base64);

      if (response.success) {
        Alert.alert('✅ Visage enregistré', `${personName} a été enregistré avec succès`);
        setCapturedImage(null);
        setPersonName('');
        setResult(null);
      } else {
        Alert.alert('Erreur', response.error || 'Impossible d\'enregistrer le visage');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Permission caméra requise</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* En-tête avec statut */}
      <View style={[styles.statusBar, apiStatus.isConnected ? styles.connected : styles.disconnected]}>
        <Text style={styles.statusText}>
          {apiStatus.isConnected ? '🟢 API Connectée' : '🔴 API Déconnectée'}
        </Text>
        <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
          <Text style={styles.settingsButton}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Paramètres */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <Text style={styles.settingsTitle}>Configuration API</Text>
          <TextInput
            style={styles.input}
            placeholder="Adresse API (ex: http://192.168.1.100:5000)"
            value={apiUrl}
            onChangeText={setApiUrl}
          />
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={updateAPIUrl}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Connexion...' : 'Connecter'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Caméra */}
      <View style={styles.cameraContainer}>
        {!capturedImage ? (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
          />
        ) : (
          <Image
            source={{ uri: capturedImage }}
            style={styles.capturedImage}
          />
        )}
      </View>

      {/* Boutons caméra */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]}
          onPress={() => {
            setCapturedImage(null);
            setResult(null);
          }}
        >
          <Text style={styles.buttonText}>Réinitialiser</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall, loading && styles.buttonDisabled]}
          onPress={capturePhoto}
          disabled={loading}
        >
          <Text style={styles.buttonText}>📷 Capturer</Text>
        </TouchableOpacity>
      </View>

      {capturedImage && (
        <>
          {/* Section reconnaissance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Reconnaissance</Text>
            <TouchableOpacity 
              style={[styles.button, styles.buttonPrimary, (loading || !apiStatus.isConnected) && styles.buttonDisabled]}
              onPress={recognizeFace}
              disabled={loading || !apiStatus.isConnected}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Reconnaître le Visage</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Section enregistrement */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💾 Enregistrement</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de la personne"
              value={personName}
              onChangeText={setPersonName}
              editable={!loading}
            />
            <TouchableOpacity 
              style={[styles.button, styles.buttonSuccess, (loading || !apiStatus.isConnected) && styles.buttonDisabled]}
              onPress={registerFace}
              disabled={loading || !apiStatus.isConnected}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Enregistrer le Visage</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Résultat */}
          {result && (
            <View style={[styles.result, result.success ? styles.resultSuccess : styles.resultError]}>
              <Text style={styles.resultTitle}>
                {result.success ? '✅ Succès' : '⚠️ Résultat'}
              </Text>
              <Text style={styles.resultText}>
                {result.success ? `Personne: ${result.name}` : result.error}
              </Text>
              <Text style={styles.resultText}>
                Confiance: {result.percentage}%
              </Text>
            </View>
          )}
        </>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#667eea',
  },
  connected: {
    backgroundColor: '#4caf50',
  },
  disconnected: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingsButton: {
    fontSize: 20,
  },
  settingsPanel: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 1,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  camera: {
    flex: 1,
  },
  capturedImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#667eea',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonSmall: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonPrimary: {
    backgroundColor: '#667eea',
  },
  buttonSuccess: {
    backgroundColor: '#4caf50',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  result: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  resultSuccess: {
    backgroundColor: '#e8f5e9',
    borderLeftColor: '#4caf50',
  },
  resultError: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#f44336',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  spacer: {
    height: 30,
  },
});

export default APIRecognitionScreen;
