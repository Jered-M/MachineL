import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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

// 3. Définir l'écran initial
const INITIAL_SCREEN_NAME = 'FaceCapture'; // Vous pouvez changer cela pour 'Onboarding' si besoin

export default function App() {
    const [currentScreen, setCurrentScreen] = useState(INITIAL_SCREEN_NAME);
    const [screenParams, setScreenParams] = useState({});

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
    errorText: {
        color: 'red',
        marginTop: 50,
        textAlign: 'center',
    }
});