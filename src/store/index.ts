import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { rootSaga } from './sagas';
import { ApiState, apiReducer } from './slices/apiSlice';
import { ChoicesState, choicesReducer } from './slices/choicesSlice';
import { questionsReducer, QuestionsState } from './slices/questionsSlice';

export type RootState = {
  api: ApiState;
  choices: ChoicesState;
  questions: QuestionsState;
};

export const createStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore<RootState>({
    reducer: {
      api: apiReducer,
      choices: choicesReducer,
      questions: questionsReducer,
    },
    middleware: [sagaMiddleware],
  });

  sagaMiddleware.run(rootSaga);

  return store;
};
