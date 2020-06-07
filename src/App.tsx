import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import { createStore } from './store';
import { AppNavigator } from './navigation';

const store = createStore();

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
