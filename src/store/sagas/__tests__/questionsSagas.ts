import { runSaga, Saga } from 'redux-saga';

import { APIClient, APIHelpers } from '../../../services';
import {
  mockQuestionObjectResponse,
  mockQuestionObject,
  mockUrl,
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
        typeof questionsActions.getQuestionsSucceeded
      >[] = [];

      await runSaga(
        {
          dispatch: (
            action: ReturnType<typeof questionsActions.getQuestionsSucceeded>,
          ) => dispatched.push(action),
          getState: () => ({ api: { url: mockUrl } }),
        },
        fetchQuestions as Saga<any[]>,
        questionsActions.getQuestionsRequested({ page: 1 }),
      );

      expect(APIClient.getQuestions).toBeCalledWith({
        path: mockUrl,
        page: 1,
      });
      expect(dispatched).toEqual([
        questionsActions.getQuestionsSucceeded({
          questions: [mockQuestionObject],
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
        path: mockUrl,
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
