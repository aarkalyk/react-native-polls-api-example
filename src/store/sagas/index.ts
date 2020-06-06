import { all } from 'redux-saga/effects';
import { questionsSaga } from './questionsSagas';

export function* rootSaga() {
  yield all([questionsSaga()]);
}
