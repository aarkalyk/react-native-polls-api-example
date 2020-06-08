import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Screen } from './Screen';

export const LOADING_SCREEN_TEST_ID = 'LOADING_SCREEN_TEST_ID';

export const LoadingScreen = () => {
  return (
    <Screen style={styles.screen} testID={LOADING_SCREEN_TEST_ID}>
      <ActivityIndicator size="small" color="white" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
