import React, { FC } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ViewProps, SafeAreaView, View, StyleSheet } from 'react-native';
import { colors } from '../styles';

interface Props extends ViewProps {
  unsafe?: boolean;
}

export const Screen: FC<Props> = ({ style, unsafe, children, testID }) => {
  const Wrapper = unsafe === true ? View : SafeAreaView;
  return (
    <LinearGradient
      colors={[colors.gradient1, colors.gradient1, colors.gradient2]}
      style={[styles.container, style]}
      testID={testID}
    >
      <Wrapper style={[styles.wrapper, style]}>{children}</Wrapper>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    backgroundColor: colors.transparent,
    flex: 1,
    overflow: 'visible',
  },
});
