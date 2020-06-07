import { call, put, takeLatest } from 'redux-saga/effects';

import { APIClient, APIHelpers } from '../../services';
import { QuestionsUrlResponse } from '../../types/questions';
import { apiActions } from '../slices/apiSlice';

export function* fetchUrl() {
  try {
    const urlResponse: QuestionsUrlResponse = yield call(APIClient.getUrl);

    yield put(apiActions.getUrlSucceeded({ url: urlResponse.questions_url }));
  } catch (e) {
    console.error('Error in fetchUrl saga: ', e);
    yield put(
      apiActions.getUrlFailed({
        errorMessage: APIHelpers.getGenericErrorMessage(),
      }),
    );
  }
}

export function* apiSaga() {
  yield takeLatest(apiActions.getUrlRequested.type, fetchUrl);
}
