import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import { createStore } from './store';
import { AppNavigator } from './navigation';
import { Platform, UIManager } from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const store = createStore();

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
