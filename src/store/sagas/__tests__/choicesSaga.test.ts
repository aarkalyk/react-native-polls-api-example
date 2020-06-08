import { runSaga, Saga } from 'redux-saga';

import {
  mockUrl,
  mockChoiceObjectResponse,
  mockChoiceObject,
  mockQuestionId,
  mockChoiceId,
} from '../../../test/mocks';
import { postVote } from '../choicesSagas';
import { APIClient } from '../../../services';
import { choicesActions } from '../../../store/slices/choicesSlice';

describe('choicesSagas', () => {
  describe('postVote', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches choicesActions.postVoteSucceeded action if api call succeeds', async () => {
      jest
        .spyOn(APIClient, 'postVote')
        .mockImplementationOnce(() =>
          Promise.resolve({ data: mockChoiceObjectResponse }),
        );

      const dispatched: ReturnType<
        typeof choicesActions.postVoteSucceeded
      >[] = [];

      await runSaga(
        {
          dispatch: (
            action: ReturnType<typeof choicesActions.postVoteSucceeded>,
          ) => dispatched.push(action),
          getState: () => ({ api: { url: mockUrl } }),
        },
        postVote as Saga<any[]>,
        choicesActions.postVoteRequested({
          question_id: mockQuestionId,
          choice_id: mockChoiceId,
        }),
      );

      expect(APIClient.postVote).toBeCalledWith({
        url: mockUrl,
        question_id: mockQuestionId,
        choice_id: mockChoiceId,
      });
      expect(dispatched).toEqual([
        choicesActions.postVoteSucceeded({ choice: mockChoiceObject }),
      ]);
    });

    it('dispatches choicesActions.postVoteRequested action if api call fails', async () => {
      jest
        .spyOn(APIClient, 'postVote')
        .mockImplementationOnce(() => Promise.reject('Error'));

      const dispatched: ReturnType<
        typeof choicesActions.postVoteRequested
      >[] = [];

      await runSaga(
        {
          dispatch: (
            action: ReturnType<typeof choicesActions.postVoteRequested>,
          ) => dispatched.push(action),
          getState: () => ({ api: { url: mockUrl } }),
        },
        postVote as Saga<any[]>,
        choicesActions.postVoteRequested({
          question_id: mockQuestionId,
          choice_id: mockChoiceId,
        }),
      );

      expect(APIClient.postVote).toBeCalledWith({
        url: mockUrl,
        question_id: mockQuestionId,
        choice_id: mockChoiceId,
      });
      expect(dispatched).toEqual([
        choicesActions.postVoteRequested({
          question_id: mockQuestionId,
          choice_id: mockChoiceId,
        }),
      ]);
    });
  });
});
