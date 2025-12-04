import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Ellipse, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export const FaceOverlay = () => {
  const centerX = width / 2;
  const centerY = height / 2.5;
  const ovalWidth = 180;
  const ovalHeight = 220;
  const eyeRadius = 25;
  const eyeSpacing = 80;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Semi-transparent overlay */}
        <View style={styles.overlay}>
          {/* Main oval face guide */}
          <Ellipse
            cx={centerX}
            cy={centerY}
            rx={ovalWidth / 2}
            ry={ovalHeight / 2}
            stroke="white"
            strokeWidth={3}
            fill="none"
            opacity={0.8}
          />

          {/* Left eye guide */}
          <Circle
            cx={centerX - eyeSpacing / 2}
            cy={centerY - 60}
            r={eyeRadius}
            stroke="white"
            strokeWidth={2}
            fill="none"
            strokeDasharray="5,5"
            opacity={0.6}
          />

          {/* Right eye guide */}
          <Circle
            cx={centerX + eyeSpacing / 2}
            cy={centerY - 60}
            r={eyeRadius}
            stroke="white"
            strokeWidth={2}
            fill="none"
            strokeDasharray="5,5"
            opacity={0.6}
          />
        </View>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
});
