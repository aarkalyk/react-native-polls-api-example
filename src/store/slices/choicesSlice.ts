import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

import { ChoiceObject } from '../../types';
import { questionsActions } from './questionsSlice';

export type ChoicesState = {
  votedChoiceByQuestionId: { [key in number]: number };
  byId: { [key in number]: ChoiceObject };
};

const initialState: ChoicesState = {
  votedChoiceByQuestionId: {},
  byId: {},
};

const choicesSlice = createSlice({
  name: 'choices',
  initialState,
  reducers: {
    postVoteRequested(
      state,
      action: PayloadAction<{ question_id: number; choice_id: number }>,
    ) {
      const { question_id, choice_id } = action.payload;
      // Optimistically updates the state
      state.votedChoiceByQuestionId[question_id] = choice_id;
      state.byId[choice_id].votes++;
    },
    postVoteSucceeded(state, action: PayloadAction<{ choice: ChoiceObject }>) {
      const { choice } = action.payload;
      // Update the state once the real data arrives
      state.byId[choice.id] = choice;
    },
  },
  // listens for actions outside of this slice
  extraReducers: (builder) => {
    builder.addCase(
      questionsActions.getQuestionsAndChoicesSucceeded,
      (state, action) => {
        const { choices } = action.payload;

        choices.forEach((choice) => {
          state.byId[choice.id] = choice;
        });
      },
    );
  },
});

// created separately because this action doesn't affect the store
const postVoteFailed = createAction<{ errorMessage: string }>(
  'POST_CHOICE_FAILED',
);

export const choicesReducer = choicesSlice.reducer;
export const choicesActions = {
  ...choicesSlice.actions,
  postVoteFailed,
};
