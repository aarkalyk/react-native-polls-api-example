import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApiCallStatus, QuestionObject, ChoiceObject } from '../../types';

export type QuestionsState = {
  status: ApiCallStatus;
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
    getQuestionsAndChoicesSucceeded(
      state,
      action: PayloadAction<{
        questions: QuestionObject[];
        choices: ChoiceObject[];
      }>,
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
