import { runSaga, Saga } from 'redux-saga';

import { APIClient, APIHelpers } from '../../../services';
import {
  mockUrl,
  mockQuestionObjectResponse,
  mockQuestionAndChoiceObjects,
  mockQuestionBody,
  mockNextUrl,
} from '../../../mocks';
import { fetchQuestions, postQuestion } from '../questionsSagas';
import { questionsActions } from '../../../store/slices/questionsSlice';

describe('questionsSaga', () => {
  describe('fetchQuestions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('makes the api call with nextUrl if it is available', async () => {
      jest.spyOn(APIClient, 'getQuestions').mockImplementationOnce(() =>
        Promise.resolve({
          data: [mockQuestionObjectResponse],
        }),
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
          getState: () => ({
            api: { url: mockUrl },
            questions: { nextLink: mockNextUrl },
          }),
        },
        fetchQuestions as Saga<any[]>,
        questionsActions.getQuestionsRequested(),
      );

      expect(APIClient.getQuestions).toBeCalledWith({
        url: mockNextUrl,
      });
      expect(dispatched).toEqual([
        questionsActions.getQuestionsAndChoicesSucceeded({
          questions: mockQuestionAndChoiceObjects.questionObjects,
          choices: mockQuestionAndChoiceObjects.choiceObjects,
        }),
      ]);
    });

    it('dispatches getQuestionsSucceeded action if api call succeeds', async () => {
      jest.spyOn(APIClient, 'getQuestions').mockImplementationOnce(() =>
        Promise.resolve({
          nextLink: mockNextUrl,
          data: [mockQuestionObjectResponse],
        }),
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
          getState: () => ({
            api: { url: mockUrl },
            questions: { nextLink: undefined },
          }),
        },
        fetchQuestions as Saga<any[]>,
        questionsActions.getQuestionsRequested(),
      );

      expect(APIClient.getQuestions).toBeCalledWith({
        url: mockUrl,
      });
      expect(dispatched).toEqual([
        questionsActions.getQuestionsAndChoicesSucceeded({
          nextLink: mockNextUrl,
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
          getState: () => ({
            api: { url: mockUrl },
            questions: { nextLink: undefined },
          }),
        },
        fetchQuestions as Saga<any[]>,
        questionsActions.getQuestionsRequested(),
      );

      expect(APIClient.getQuestions).toBeCalledWith({
        url: mockUrl,
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
          Promise.resolve({ data: mockQuestionObjectResponse }),
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
