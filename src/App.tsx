import React from 'react';

import { Provider } from 'react-redux';
import { store } from './store';
import { Questions } from './screens/Questions';

const App = () => {
  return (
    <Provider store={store}>
      <Questions />
    </Provider>
  );
};

export default App;
