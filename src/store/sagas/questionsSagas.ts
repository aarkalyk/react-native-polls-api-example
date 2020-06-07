import { call, put, takeLatest, select } from 'redux-saga/effects';

import { questionsActions } from '../slices/questionsSlice';
import { APIClient, APIHelpers } from '../../services';
import { QuestionObjectResponse } from '../../types/questions';
import { RootState } from '../index';

export function* fetchQuestions(
  action: ReturnType<typeof questionsActions.getQuestionsRequested>,
) {
  try {
    const url: string = yield select((state: RootState) => state.api.url);
    const questionsResponse: QuestionObjectResponse[] = yield call(
      APIClient.getQuestions,
      {
        url,
        page: action.payload.page,
      },
    );

    const questionAndChoiceObjects = APIHelpers.convertQuestionsResponseToQuestionAndChoiceObjects(
      questionsResponse,
    );
    yield put(
      questionsActions.getQuestionsAndChoicesSucceeded({
        questions: questionAndChoiceObjects.questionObjects,
        choices: questionAndChoiceObjects.choiceObjects,
      }),
    );
  } catch (e) {
    console.error('Error in fetchQuestions saga: ', e);
    yield put(
      questionsActions.getQuestionsFailed({
        errorMessage: APIHelpers.getGenericErrorMessage(),
      }),
    );
  }
}

export function* questionsSaga() {
  yield takeLatest(questionsActions.getQuestionsRequested.type, fetchQuestions);
}
