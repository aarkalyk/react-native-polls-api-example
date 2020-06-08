import { runSaga, Saga } from 'redux-saga';

import { APIClient, APIHelpers } from '../../../services';
import { mockUrl, mockUrlResponse } from '../../../mocks';
import { fetchUrl } from '../apiSagas';
import { apiActions } from '../../../store/slices/apiSlice';

describe('apiSagas', () => {
  describe('fetchUrl', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches getUrlSucceeded action if api call succeeds', async () => {
      jest
        .spyOn(APIClient, 'getUrl')
        .mockImplementationOnce(() =>
          Promise.resolve({ data: mockUrlResponse }),
        );

      const dispatched: ReturnType<typeof apiActions.getUrlSucceeded>[] = [];

      await runSaga(
        {
          dispatch: (action: ReturnType<typeof apiActions.getUrlSucceeded>) =>
            dispatched.push(action),
          getState: () => ({ api: { url: mockUrl } }),
        },
        fetchUrl as Saga<any[]>,
      );

      expect(APIClient.getUrl).toBeCalledWith();
      expect(dispatched).toEqual([
        apiActions.getUrlSucceeded({
          url: mockUrlResponse.questions_url,
        }),
      ]);
    });

    it('dispatches getUrlFailed action if api call fails', async () => {
      jest
        .spyOn(APIClient, 'getUrl')
        .mockImplementationOnce(() => Promise.reject('Error'));

      const dispatched: ReturnType<typeof apiActions.getUrlFailed>[] = [];

      await runSaga(
        {
          dispatch: (action: ReturnType<typeof apiActions.getUrlFailed>) =>
            dispatched.push(action),
          getState: () => ({ api: { url: mockUrl } }),
        },
        fetchUrl as Saga<any[]>,
      );

      expect(APIClient.getUrl).toBeCalledWith();
      expect(dispatched).toEqual([
        apiActions.getUrlFailed({
          errorMessage: APIHelpers.getGenericErrorMessage(),
        }),
      ]);
    });
  });
});
