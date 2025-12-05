// navigation/ScreenMap.js

import { OnboardingScreen } from '../screens/OnboardingScreen';
import { FaceCaptureScreen } from '../screens/FaceCaptureScreen';
import { ScanningScreen } from '../screens/ScanningScreen';
import { ResultScreen } from '../screens/ResultScreen';
import APIRecognitionScreen from '../screens/APIRecognitionScreen';
import { RegisterFaceScreen } from '../screens/RegisterFaceScreen';

/**
 * Mappe toutes les routes disponibles dans l'application.
 */
export const ScreenMap = {
    Onboarding: OnboardingScreen,
    FaceCapture: FaceCaptureScreen,
    Scanning: ScanningScreen,
    Result: ResultScreen,
    APIRecognition: APIRecognitionScreen,
    RegisterFace: RegisterFaceScreen,
};

// Exporter la clé de l'écran initial
export const INITIAL_SCREEN = 'FaceCapture'; // Démarrer directement sur la capture