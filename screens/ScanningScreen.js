import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

export const ScanningScreen = ({ navigation, route }) => {
  const photoUri = route?.params?.photoUri;
  const modelResult = route?.params?.modelResult;

  const [scanLinePosition] = useState(new Animated.Value(0));
  const [photoHeight, setPhotoHeight] = useState(350);
  const [photoLoading, setPhotoLoading] = useState(true);

  console.log('📱 [ScanningScreen] Params reçus:', { photoUri, modelResult });

  // Animation ligne bleue
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLinePosition, {
          toValue: photoHeight,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanLinePosition, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [photoHeight]);

  // Navigation automatique vers ResultScreen après 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⏱️ [ScanningScreen] Navigation vers ResultScreen...');
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('Result', { photoUri, modelResult });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, photoUri, modelResult]);

  // Ajuster la taille de l'image pour l'affichage
  const handlePhotoLoad = (e) => {
    setPhotoLoading(false);
    const { width: imgWidth, height: imgHeight } = e.nativeEvent.source;
    if (imgWidth && imgHeight) {
      const calculatedHeight = (imgHeight / imgWidth) * (width - 40);
      setPhotoHeight(calculatedHeight);
      console.log('📐 [ScanningScreen] Dimensions calculées:', calculatedHeight);
    }
  };

  const handlePhotoError = (error) => {
    console.error('❌ [ScanningScreen] Erreur chargement photo:', error);
    setPhotoLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Photo capturée avec ligne de scan */}
      <View style={[styles.photoContainer, { height: photoHeight }]}>
        {photoLoading && (
          <View style={styles.photoPlaceholder}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.placeholderText}>Chargement photo...</Text>
          </View>
        )}

        {photoUri ? (
          <>
            <Image
              source={{ uri: photoUri }}
              style={styles.capturedPhoto}
              onLoad={handlePhotoLoad}
              onError={handlePhotoError}
              resizeMode="cover"
            />

            {!photoLoading && (
              <Animated.View
                style={[
                  styles.scanLine,
                  { transform: [{ translateY: scanLinePosition }] },
                ]}
              />
            )}
          </>
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.errorText}>❌ Photo non disponible</Text>
            <Text style={styles.errorSubtext}>URI: {photoUri}</Text>
          </View>
        )}
      </View>

      {/* Overlay de scanning */}
      <View style={styles.scanOverlay}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.scanningText}>Scanning…</Text>
          <Text style={styles.subtitle}>Analyzing face data</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  photoContainer: {
    width: width - 40,
    minHeight: 300,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 30,
    backgroundColor: Colors.surface,
    position: 'relative',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  capturedPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  placeholderText: {
    color: Colors.textSecondary,
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  errorSubtext: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scanOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  content: { alignItems: 'center' },
  scanningText: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    letterSpacing: 1,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
  },
});
