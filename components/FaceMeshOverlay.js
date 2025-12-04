import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Line, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export const FaceMeshOverlay = () => {
  const centerX = width / 2;
  const centerY = height / 2.5;
  const scale = 1.2;

  // Simplified face mesh points for mocking a 3D face detection
  const points = [
    // Face outline
    `${centerX - 90 * scale},${centerY - 100 * scale}`,
    `${centerX - 100 * scale},${centerY - 40 * scale}`,
    `${centerX - 90 * scale},${centerY + 30 * scale}`,
    `${centerX},${centerY + 80 * scale}`,
    `${centerX + 90 * scale},${centerY + 30 * scale}`,
    `${centerX + 100 * scale},${centerY - 40 * scale}`,
    `${centerX + 90 * scale},${centerY - 100 * scale}`,
    `${centerX},${centerY - 110 * scale}`,
  ];

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Face mesh outline */}
        <Polyline
          points={points.join(' ')}
          stroke="#00D084"
          strokeWidth={2}
          fill="none"
          opacity={0.8}
        />

        {/* Closing the polygon */}
        <Line
          x1={points[7].split(',')[0]}
          y1={points[7].split(',')[1]}
          x2={points[0].split(',')[0]}
          y2={points[0].split(',')[1]}
          stroke="#00D084"
          strokeWidth={2}
          opacity={0.8}
        />

        {/* Eyes */}
        <Circle
          cx={centerX - 35 * scale}
          cy={centerY - 50 * scale}
          r={15}
          stroke="#00D084"
          strokeWidth={2}
          fill="none"
          opacity={0.7}
        />
        <Circle
          cx={centerX + 35 * scale}
          cy={centerY - 50 * scale}
          r={15}
          stroke="#00D084"
          strokeWidth={2}
          fill="none"
          opacity={0.7}
        />

        {/* Nose guide */}
        <Line
          x1={centerX}
          y1={centerY - 30 * scale}
          x2={centerX}
          y2={centerY + 10 * scale}
          stroke="#00D084"
          strokeWidth={1.5}
          opacity={0.5}
        />

        {/* Mouth guide */}
        <Polyline
          points={`${centerX - 40 * scale},${centerY + 40 * scale} ${centerX},${centerY + 50 * scale} ${centerX + 40 * scale},${centerY + 40 * scale}`}
          stroke="#00D084"
          strokeWidth={1.5}
          fill="none"
          opacity={0.5}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
