import { configureStore } from '@reduxjs/toolkit';
import { questionsReducer, QuestionsState } from './slices/questionsSlice';

export type RootState = {
  questions: QuestionsState;
};

export const store = configureStore<RootState>({
  reducer: {
    questions: questionsReducer,
  },
});
