import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Button } from '../components/Button';
import { Colors } from '../constants/Colors';
import { StorageManager } from '../utils/StorageManager';

const { width } = Dimensions.get('window');

export const ResultScreen = ({ navigation, route }) => {
  const photoUri = route?.params?.photoUri;
  const modelResult = route?.params?.modelResult;

  console.log('📊 [ResultScreen] modelResult:', modelResult);

  // Default values if API returns null or undefined
  const displayData = modelResult
    ? {
        name: modelResult.person || 'Unknown',
        employeeId: modelResult.employee_id || 'N/A',
        confidence:
          modelResult.confidence !== undefined ? modelResult.confidence : 0,
        enterTime: modelResult.enter_time || '-',
        exitTime: modelResult.exit_time || '-',
        location: modelResult.location || '-',
      }
    : {
        name: 'Unknown',
        employeeId: 'N/A',
        confidence: 0,
        enterTime: '-',
        exitTime: '-',
        location: '-',
      };

  const isSuccess = modelResult?.success !== false && modelResult?.person;
  const allResults = modelResult?.allResults || [];

  const handleScanAgain = () => {
    navigation.navigate('FaceCapture');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recognition Result</Text>
      </View>

      <View style={styles.mainContent}>
        {/* Photo scannée */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Scanned Photo</Text>
          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.scannedPhoto} />
          )}
        </View>

        {/* Card résultats */}
        <View style={styles.resultCard}>
          <View style={styles.checkContainer}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>

          <Text style={styles.congratsText}>
            {isSuccess ? 'Match Found!' : 'No Match'}
          </Text>
          <Text style={styles.userName}>{displayData.name}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee ID</Text>
              <Text style={styles.infoValue}>{displayData.employeeId}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Confidence</Text>
              <Text style={[styles.infoValue, styles.confidenceHighlight]}>
                {typeof displayData.confidence === 'number'
                  ? (displayData.confidence * 100).toFixed(2) + '%'
                  : displayData.confidence}
              </Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Enter Time</Text>
              <Text style={styles.infoValue}>{displayData.enterTime}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Exit Time</Text>
              <Text style={styles.infoValue}>{displayData.exitTime}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{displayData.location}</Text>
            </View>

            {/* Afficher tous les résultats si présents */}
            {allResults.length > 0 && (
              <View style={styles.allResultsBox}>
                <Text style={styles.allResultsTitle}>All Classes Scores</Text>
                {allResults.map((result, idx) => (
                  <View key={idx} style={styles.classRow}>
                    <Text style={styles.className}>{result.name}</Text>
                    <View style={styles.scoreBar}>
                      <View
                        style={[
                          styles.scoreBarFill,
                          {
                            width: `${result.score * 100}%`,
                            backgroundColor:
                              isSuccess && result.name === displayData.name
                                ? Colors.accent
                                : Colors.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.scoreText}>{result.percentage}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Statistiques locales */}
            <View style={styles.statisticsSection}>
              <Text style={styles.statisticsTitle}>📊 Analysis Data</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Values Stored:</Text>
                <Text style={styles.statValue}>{StorageManager.getCount()}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Average Score:</Text>
                <Text style={styles.statValue}>
                  {StorageManager.getAverage().toFixed(2)}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Min Score:</Text>
                <Text style={styles.statValue}>
                  {StorageManager.getMin() !== null
                    ? StorageManager.getMin().toFixed(2)
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Max Score:</Text>
                <Text style={styles.statValue}>
                  {StorageManager.getMax() !== null
                    ? StorageManager.getMax().toFixed(2)
                    : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bouton Scan Again */}
      <View style={styles.buttonContainer}>
        <Button title="Scan Again" onPress={handleScanAgain} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: { color: Colors.text, fontSize: 24, fontWeight: '700' },
  mainContent: { paddingHorizontal: 20, paddingVertical: 20 },
  photoSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  scannedPhoto: { width: '100%', height: 300, borderRadius: 15, resizeMode: 'cover', borderWidth: 2, borderColor: Colors.accent },
  resultCard: { backgroundColor: Colors.surface, borderRadius: 20, paddingVertical: 30, paddingHorizontal: 20, alignItems: 'center' },
  checkContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  checkIcon: { fontSize: 36, color: Colors.text, fontWeight: '700' },
  congratsText: { fontSize: 24, fontWeight: '700', color: Colors.accent, marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: 24 },
  infoSection: { width: '100%' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  infoLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  confidenceHighlight: { color: Colors.accent, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border },
  allResultsBox: { marginTop: 20 },
  allResultsTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  classRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  className: { width: 80, fontSize: 12, fontWeight: '600', color: Colors.text },
  scoreBar: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, marginHorizontal: 8, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  scoreText: { width: 45, fontSize: 11, fontWeight: '600', color: Colors.primary, textAlign: 'right' },
  statisticsSection: { marginTop: 20 },
  statisticsTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  statLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  statValue: { fontSize: 13, fontWeight: '700', color: Colors.accent },
  buttonContainer: { paddingVertical: 24, paddingHorizontal: 20 },
});
