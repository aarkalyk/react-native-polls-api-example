import { call, put, select, takeEvery } from 'redux-saga/effects';

import { APIClient, APIHelpers } from '../../services';
import { ChoiceObjectResponse } from '../../types/questions';
import { choicesActions } from '../slices/choicesSlice';
import { RootState } from '..';

export function* postVote(
  action: ReturnType<typeof choicesActions.postVoteRequested>,
) {
  try {
    const url: string = yield select((state: RootState) => state.api.url);
    const choiceResponse: ChoiceObjectResponse = yield call(
      APIClient.postVote,
      {
        url,
        ...action.payload,
      },
    );
    const choice = APIHelpers.convertChoiceResponseToChoiceObject({
      choiceResponse,
    });

    yield put(choicesActions.postVoteSucceeded({ choice }));
  } catch (e) {
    console.error('Error in postVote saga: ', e);
    /*
     * For better user experience we will update the UI optimistically even before request succeeds.
     * In case request fails we will keep retrying in the background without notifying the user.
     */
    yield put(choicesActions.postVoteRequested(action.payload));
  }
}

export function* choicesSaga() {
  yield takeEvery(choicesActions.postVoteRequested.type, postVote);
}
