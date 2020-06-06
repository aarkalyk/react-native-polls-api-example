import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionObject } from 'src/types/questions';

export const mockQuestion: QuestionObject = {
  question: 'Favorite programming language?',
  published_at: new Date('2014-11-11T08:40:51.620Z'),
  id: 1,
  choices: [
    {
      choice: 'Swift',
      id: 1,
      votes: 2048,
      questionId: 1,
    },
    {
      choice: 'Python',
      id: 2,
      votes: 1024,
      questionId: 1,
    },
    {
      choice: 'Objective-C',
      id: 3,
      votes: 512,
      questionId: 1,
    },
    {
      choice: 'Ruby',
      id: 4,
      votes: 256,
      questionId: 1,
    },
  ],
};

export type QuestionsState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  byId: { [id: number]: QuestionObject };
  ids: number[];
  errorMessage?: string;
};

const initialState: QuestionsState = {
  status: 'idle',
  byId: { [1]: mockQuestion },
  ids: [1],
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    getQuestionsRequested(state, _: PayloadAction<{ page: number }>) {
      state.status = 'loading';
    },
    getQuestionsSucceeded(state, action: PayloadAction<{ questions: QuestionObject[] }>) {
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
