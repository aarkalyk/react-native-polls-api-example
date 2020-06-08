import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ApiCallStatus,
  QuestionObject,
  ChoiceObject,
  QuestionBody,
} from '../../types';

export type QuestionsState = {
  status: ApiCallStatus;
  byId: { [id: number]: QuestionObject };
  ids: number[];
  nextLink?: string;
  errorMessage?: string;
  creationStatus: ApiCallStatus;
  creationError?: string;
};

const initialState: QuestionsState = {
  status: 'idle',
  creationStatus: 'idle',
  byId: {},
  ids: [],
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    getQuestionsRequested(state) {
      state.status = 'loading';
    },
    getQuestionsAndChoicesSucceeded(
      state,
      action: PayloadAction<{
        questions: QuestionObject[];
        choices: ChoiceObject[];
        nextLink?: string;
      }>,
    ) {
      const { questions, nextLink } = action.payload;

      state.status = 'success';
      state.nextLink = nextLink;
      questions.forEach((question) => {
        if (!(question.id in state.byId)) {
          state.ids.push(question.id);
        }
        state.byId[question.id] = question;
      });
    },
    getQuestionsFailed(state, action: PayloadAction<{ errorMessage: string }>) {
      const { errorMessage } = action.payload;

      state.status = 'error';
      state.errorMessage = errorMessage;
    },
    postQuestionRequested(
      state,
      _: PayloadAction<{ questionBody: QuestionBody }>,
    ) {
      state.creationStatus = 'loading';
    },
    postQuestionSucceeded(
      state,
      action: PayloadAction<{
        questions: QuestionObject[];
        choices: ChoiceObject[];
      }>,
    ) {
      const { questions } = action.payload;
      state.creationStatus = 'success';

      questions.forEach((question) => {
        if (!(question.id in state.byId)) {
          state.ids.push(question.id);
        }
        state.byId[question.id] = question;
      });
    },
    postQuestionFailed(
      state,
      action: PayloadAction<{
        errorMessage: string;
      }>,
    ) {
      const { errorMessage } = action.payload;
      state.creationStatus = 'error';
      state.creationError = errorMessage;
    },
  },
});

export const questionsReducer = questionsSlice.reducer;
export const questionsActions = questionsSlice.actions;
