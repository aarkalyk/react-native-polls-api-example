import { runSaga, Saga } from 'redux-saga';

import { APIClient, APIHelpers } from '../../../services';
import {
  mockUrl,
  mockQuestionObjectResponse,
  mockQuestionAndChoiceObjects,
} from '../../../mocks';
import { fetchQuestions } from '../questionsSagas';
import { questionsActions } from '../../../store/slices/questionsSlice';

describe('questionsSaga', () => {
  describe('fetchQuestions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches getQuestionsSucceeded action if api call succeeds', async () => {
      jest
        .spyOn(APIClient, 'getQuestions')
        .mockImplementationOnce(() =>
          Promise.resolve([mockQuestionObjectResponse]),
        );

      const dispatched: ReturnType<
        typeof questionsActions.getQuestionsAndChoicesSucceeded
      >[] = [];

      await runSaga(
        {
          dispatch: (
            action: ReturnType<
              typeof questionsActions.getQuestionsAndChoicesSucceeded
            >,
          ) => dispatched.push(action),
          getState: () => ({ api: { url: mockUrl } }),
        },
        fetchQuestions as Saga<any[]>,
        questionsActions.getQuestionsRequested({ page: 1 }),
      );

      expect(APIClient.getQuestions).toBeCalledWith({
        url: mockUrl,
        page: 1,
      });
      expect(dispatched).toEqual([
        questionsActions.getQuestionsAndChoicesSucceeded({
          questions: mockQuestionAndChoiceObjects.questionObjects,
          choices: mockQuestionAndChoiceObjects.choiceObjects,
        }),
      ]);
    });

    it('dispatches getQuestionsFailed action if api call fails', async () => {
      jest
        .spyOn(APIClient, 'getQuestions')
        .mockImplementationOnce(() => Promise.reject('Error'));

      const dispatched: ReturnType<
        typeof questionsActions.getQuestionsFailed
      >[] = [];

      await runSaga(
        {
          dispatch: (
            action: ReturnType<typeof questionsActions.getQuestionsFailed>,
          ) => dispatched.push(action),
          getState: () => ({ api: { url: mockUrl } }),
        },
        fetchQuestions as Saga<any[]>,
        questionsActions.getQuestionsRequested({ page: 1 }),
      );

      expect(APIClient.getQuestions).toBeCalledWith({
        url: mockUrl,
        page: 1,
      });
      expect(dispatched).toEqual([
        questionsActions.getQuestionsFailed({
          errorMessage: APIHelpers.getGenericErrorMessage(),
        }),
      ]);
    });
  });
});
