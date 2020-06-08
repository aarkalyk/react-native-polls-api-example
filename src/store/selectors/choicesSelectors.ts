import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';

export const getVotedChoiceId = createSelector(
  (state: RootState, id: number) => state.choices.votedChoiceByQuestionId[id],
  (choiceId) => choiceId,
);

export const getChoicesById = createSelector(
  (state: RootState) => state.choices.byId,
  (byId) => byId,
);
