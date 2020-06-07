import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';

export const getHasBeenVoted = createSelector(
  (state: RootState, id: number) => id in state.choices.votedChoiceByQuestionId,
  (hasBeenVoted) => hasBeenVoted,
);

export const getQuestionById = createSelector(
  (state: RootState, id: number) => state.questions.byId[id],
  (hasBeenVoted) => hasBeenVoted,
);
