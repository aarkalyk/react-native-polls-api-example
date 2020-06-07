import { runSaga, Saga } from 'redux-saga';

import { APIClient, APIHelpers } from '../../../services';
import {
  mockUrl,
  mockQuestionObjectResponse,
  mockQuestionAndChoiceObjects,
  mockQuestionBody,
} from '../../../mocks';
import { fetchQuestions, postQuestion } from '../questionsSagas';
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

  describe('postQuestion', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches postQuestionSucceeded action if api call succeeds', async () => {
      jest
        .spyOn(APIClient, 'postQuestion')
        .mockImplementationOnce(() =>
          Promise.resolve(mockQuestionObjectResponse),
        );

      const dispatched: ReturnType<
        typeof questionsActions.postQuestionSucceeded
      >[] = [];

      await runSaga(
        {
          dispatch: (
            action: ReturnType<typeof questionsActions.postQuestionSucceeded>,
          ) => dispatched.push(action),
          getState: () => ({ api: { url: mockUrl } }),
        },
        postQuestion as Saga<any[]>,
        questionsActions.postQuestionRequested({
          questionBody: mockQuestionBody,
        }),
      );

      expect(APIClient.postQuestion).toBeCalledWith({
        url: mockUrl,
        questionBody: mockQuestionBody,
      });
      expect(dispatched).toEqual([
        questionsActions.postQuestionSucceeded({
          questions: mockQuestionAndChoiceObjects.questionObjects,
          choices: mockQuestionAndChoiceObjects.choiceObjects,
        }),
      ]);
    });

    it('dispatches postQuestionFailed action if api call fails', async () => {
      jest
        .spyOn(APIClient, 'postQuestion')
        .mockImplementationOnce(() => Promise.reject('Error'));

      const dispatched: ReturnType<
        typeof questionsActions.postQuestionFailed
      >[] = [];

      await runSaga(
        {
          dispatch: (
            action: ReturnType<typeof questionsActions.postQuestionFailed>,
          ) => dispatched.push(action),
          getState: () => ({ api: { url: mockUrl } }),
        },
        postQuestion as Saga<any[]>,
        questionsActions.postQuestionRequested({
          questionBody: mockQuestionBody,
        }),
      );

      expect(APIClient.postQuestion).toBeCalledWith({
        url: mockUrl,
        questionBody: mockQuestionBody,
      });
      expect(dispatched).toEqual([
        questionsActions.postQuestionFailed({
          errorMessage: APIHelpers.getGenericErrorMessage(),
        }),
      ]);
    });
  });
});
