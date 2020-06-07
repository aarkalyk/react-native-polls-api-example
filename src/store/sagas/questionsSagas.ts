import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import { Alert } from 'react-native';

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

export function* postQuestion(
  action: ReturnType<typeof questionsActions.postQuestionRequested>,
) {
  try {
    const url: string = yield select((state: RootState) => state.api.url);
    const questionsResponse: QuestionObjectResponse = yield call(
      APIClient.postQuestion,
      { url, ...action.payload },
    );

    const questionAndChoiceObjects = APIHelpers.convertQuestionsResponseToQuestionAndChoiceObjects(
      [questionsResponse],
    );
    Alert.alert('Successfully created a new question');
    yield put(
      questionsActions.postQuestionSucceeded({
        questions: questionAndChoiceObjects.questionObjects,
        choices: questionAndChoiceObjects.choiceObjects,
      }),
    );
  } catch (e) {
    console.error('Error in postQuestion saga: ', e);
    yield put(
      questionsActions.postQuestionFailed({
        errorMessage: APIHelpers.getGenericErrorMessage(),
      }),
    );
  }
}

export function* questionsSaga() {
  yield all([
    takeLatest(questionsActions.getQuestionsRequested.type, fetchQuestions),
    takeLatest(questionsActions.postQuestionRequested.type, postQuestion),
  ]);
}
