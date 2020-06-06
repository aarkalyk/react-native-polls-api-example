import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionObject } from 'src/types/questions';

export type QuestionsState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  byId: { [id: number]: QuestionObject };
  ids: number[];
  errorMessage?: string;
};

const initialState: QuestionsState = {
  status: 'idle',
  byId: {},
  ids: [],
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    getQuestionsRequested(state, _: PayloadAction<{ page: number }>) {
      state.status = 'loading';
    },
    getQuestionsSucceeded(
      state,
      action: PayloadAction<{ questions: QuestionObject[] }>,
    ) {
      const { questions } = action.payload;

      state.status = 'success';
      questions.forEach((question) => {
        state.byId[question.id] = question;
        state.ids.push(question.id);
      });
    },
    getQuestionsFailed(state, action: PayloadAction<{ errorMessage: string }>) {
      const { errorMessage } = action.payload;

      state.status = 'error';
      state.errorMessage = errorMessage;
    },
  },
});

export const questionsReducer = questionsSlice.reducer;
export const questionsActions = questionsSlice.actions;
