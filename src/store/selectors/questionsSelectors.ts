import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';

export const getHasBeenVoted = createSelector(
  (state: RootState, id: number) => id in state.choices.votedChoiceByQuestionId,
  (hasBeenVoted) => hasBeenVoted,
);

export const getQuestionById = createSelector(
  (state: RootState, id: number) => state.questions.byId[id],
  (question) => question,
);

export const getNextPageExists = createSelector(
  (state: RootState) => state.questions.nextLink,
  (state: RootState) => state.questions.status,
  (nextLink, status) => {
    return nextLink !== undefined && status !== 'idle';
  },
);

export const getQuestionIds = (state: RootState) => state.questions.ids;

export const getQuestionsStatus = (state: RootState) => state.questions.status;

export const getCreationStatus = (state: RootState) =>
  state.questions.creationStatus;
