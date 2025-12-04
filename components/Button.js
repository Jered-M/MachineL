import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const Button = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  style 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.outline,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          variant === 'primary' ? styles.primaryText : styles.outlineText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  outline: {
    borderWidth: 2,
    borderColor: Colors.border,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: Colors.text,
  },
  outlineText: {
    color: Colors.text,
  },
});
