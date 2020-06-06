import React from 'react';

import { Provider } from 'react-redux';
import { Questions } from './screens/questions/Questions';
import { createStore } from './store';
import { rootSaga } from './store/sagas';

const store = createStore();

const App = () => {
  return (
    <Provider store={store}>
      <Questions />
    </Provider>
  );
};

export default App;
