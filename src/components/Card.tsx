import React, { FC } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { styleValues, colors } from '../styles';

export const Card: FC<ViewProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, styles.shadow, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: styleValues.spacings.medium,
    borderRadius: styleValues.borderRadius,
  },
  shadow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    elevation: 2,
  },
});
