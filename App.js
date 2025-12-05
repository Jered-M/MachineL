import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 1. Importer TOUS les écrans
import { OnboardingScreen } from './screens/OnboardingScreen';
import { FaceCaptureScreen } from './screens/FaceCaptureScreen';
import { ScanningScreen } from './screens/ScanningScreen';
import { ResultScreen } from './screens/ResultScreen';
import APIRecognitionScreen from './screens/APIRecognitionScreen';
import { RegisterFaceScreen } from './screens/RegisterFaceScreen';

// 2. Définir la MAP des écrans DANS App.js (ou l'importer de ScreenMap.js)
const SCREENS = {
    Onboarding: OnboardingScreen,
    FaceCapture: FaceCaptureScreen,
    Scanning: ScanningScreen,
    Result: ResultScreen,
    APIRecognition: APIRecognitionScreen,
    RegisterFace: RegisterFaceScreen,
};

// 3. Clé de stockage pour déterminer si c'est la première ouverture
const FIRST_LAUNCH_KEY = 'has_seen_onboarding';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState(null);
    const [screenParams, setScreenParams] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Vérifier si c'est la première ouverture au montage du composant
    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const hasSeenOnboarding = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
                
                if (hasSeenOnboarding === null) {
                    // Première ouverture - afficher le Onboarding
                    console.log('📱 Première ouverture - Affichage du Onboarding');
                    setCurrentScreen('Onboarding');
                    // Marquer que l'utilisateur a vu le onboarding
                    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
                } else {
                    // Ouverture suivante - aller directement à FaceCapture
                    console.log('📱 Ouverture suivante - Affichage de FaceCapture');
                    setCurrentScreen('FaceCapture');
                }
            } catch (error) {
                console.error('❌ Erreur lors de la vérification du premier lancement:', error);
                // Par défaut, afficher FaceCapture en cas d'erreur
                setCurrentScreen('FaceCapture');
            } finally {
                setIsLoading(false);
            }
        };

        checkFirstLaunch();
    }, []);

    // Afficher un écran de chargement pendant la vérification
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    /**
     * Objet de navigation personnalisé passé à chaque composant d'écran.
     */
    const navigation = {
        /**
         * Change l'écran actuel et passe des paramètres.
         * @param {string} screenName - Nom de l'écran cible.
         * @param {object} [params={}] - Paramètres à passer à l'écran.
         */
        navigate: (screenName, params = {}) => {
            if (SCREENS[screenName]) {
                console.log(`🔀 Navigation vers ${screenName} avec params:`, params);
                setScreenParams(params);
                setCurrentScreen(screenName);
            } else {
                console.error(`❌ Écran "${screenName}" non trouvé dans la carte des écrans.`);
            }
        },
        // Optionnel: Ajouter des fonctions comme goBack, push, etc. si nécessaire
    };

    const route = {
        params: screenParams
    };

    // Obtenir le composant d'écran actuel à partir de la carte
    const CurrentComponent = SCREENS[currentScreen];

    if (!CurrentComponent) {
        // Gérer le cas où l'écran est inconnu (devrait être impossible si INITIAL_SCREEN_NAME est correct)
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Erreur: Composant d'écran non trouvé.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Rendu dynamique : passe navigation et route au composant actif */}
            <CurrentComponent navigation={navigation} route={route} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        color: 'red',
        marginTop: 50,
        textAlign: 'center',
    }
});