import React, { ReactNode } from 'react';
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  TextProps,
  Text,
} from 'react-native';
import { ColorName, colors } from '../styles';

export interface BodyTextProps extends TextProps {
  children: ReactNode;
  color?: ColorName;
}

const createBodyTextVariant = (baseStyle: StyleProp<TextStyle>) => ({
  color = 'black',
  style,
  ...textProps
}: BodyTextProps) => (
  <Text {...textProps} style={[{ color: colors[color] }, baseStyle, style]} />
);

export const bodyStyles = StyleSheet.create({
  regular: {
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export const BodyRegular = createBodyTextVariant(bodyStyles.regular);
export const BodySmall = createBodyTextVariant(bodyStyles.small);
