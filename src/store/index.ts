import { configureStore } from '@reduxjs/toolkit';
import { questionsReducer, QuestionsState } from './slices/questionsSlice';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './sagas';
import { ApiState, apiReducer } from './slices/apiSlice';

export type RootState = {
  questions: QuestionsState;
  api: ApiState;
};

export const createStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore<RootState>({
    reducer: {
      questions: questionsReducer,
      api: apiReducer,
    },
    middleware: [sagaMiddleware],
  });

  sagaMiddleware.run(rootSaga);

  return store;
};
