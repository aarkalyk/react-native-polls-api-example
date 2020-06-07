import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Screen } from './Screen';

export const LoadingScreen = () => {
  return (
    <Screen style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="small" />
    </Screen>
  );
};
