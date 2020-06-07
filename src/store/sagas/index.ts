import { all } from 'redux-saga/effects';
import { questionsSaga } from './questionsSagas';
import { apiSaga } from './apiSagas';
import { choicesSaga } from './choicesSagas';

export function* rootSaga() {
  yield all([questionsSaga(), apiSaga(), choicesSaga()]);
}
