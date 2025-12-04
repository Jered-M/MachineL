import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Button } from '../components/Button';
import { Colors } from '../constants/Colors';

export const OnboardingScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome',
      description: 'Face Recognition App allows you to scan and recognize faces in real-time using your device camera.',
      icon: '👋',
    },
    {
      title: 'How It Works',
      description: 'Simply point your camera at a face and let our AI system analyze and recognize the person instantly.',
      icon: '📷',
    },
    {
      title: 'Privacy First',
      description: 'Your data is secure. All processing happens on your device with no data stored externally.',
      icon: '🔒',
    },
    {
      title: 'Get Started',
      description: 'Ready to explore? Tap the button below to start using the app.',
      icon: '🚀',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('FaceCapture');
      }
    }
  };

  const handleSkip = () => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('FaceCapture');
    }
  };

  const step = steps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{step.icon}</Text>
        </View>

        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
      </ScrollView>

      <View style={styles.dotsContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentStep && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title={currentStep === steps.length - 1 ? 'Start' : 'Next'}
          onPress={handleNext}
          style={styles.nextButton}
        />
        <TouchableOpacity 
          style={styles.apiButton}
          onPress={() => navigation.navigate('APIRecognition')}
        >
          <Text style={styles.apiButtonText}>🌐 Utiliser l'API Distant</Text>
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  skipButton: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextButton: {
    width: '100%',
  },
  apiButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#667eea',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
