import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '../constants/Colors';
import { registerFaceAPI, trainModelAPI } from '../services/api';

export const RegisterFaceScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Entrez un nom');
      return;
    }

    try {
      setIsLoading(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      console.log('📸 Photo capturée pour enregistrement:', name);
      
      const result = await registerFaceAPI(name, photo.base64);
      
      if (result.success) {
        Alert.alert('Succès', `Visage de ${name} enregistré!`);
        setName('');
      } else {
        Alert.alert('Erreur', result.error || 'Impossible d\'enregistrer le visage');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainModel = async () => {
    Alert.alert(
      'Entrainement du modele',
      'Cela peut prendre 5-10 minutes. Continuer?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Entrainer',
          onPress: async () => {
            try {
              setIsTraining(true);
              
              // Appeler l'endpoint /train
              const result = await trainModelAPI();
              
              if (result.success) {
                Alert.alert(
                  'Succes!',
                  `Modele entraine\nImages: ${result.total_images}\nAccuracy: ${result.accuracy_percent}`
                );
              } else {
                Alert.alert('Erreur', result.error || 'Impossible d\'entrainer le modele');
              }
            } catch (error) {
              Alert.alert('Erreur', error.message || 'Erreur lors de l\'entrainement');
            } finally {
              setIsTraining(false);
            }
          },
        },
      ]
    );
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Permission camera requise</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />
      
      <View style={styles.inputContainer}>
        <ScrollView>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre nom"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            editable={!isLoading && !isTraining}
          />
          
          <TouchableOpacity 
            style={[styles.button, (isLoading || isTraining) && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading || isTraining}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enregistrer mon visage</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#FF6B35' }, isTraining && styles.buttonDisabled]}
            onPress={handleTrainModel}
            disabled={isTraining}
          >
            {isTraining ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrainer le modele</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: Colors.secondary }]}
            onPress={() => navigation.goBack()}
            disabled={isTraining}
          >
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        </ScrollView>
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
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
