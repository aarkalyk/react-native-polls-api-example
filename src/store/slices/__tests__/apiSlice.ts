import { apiReducer, apiActions, ApiState } from '../apiSlice';

const mockEmptyState: ApiState = {
  status: 'idle',
  url: '',
};

describe('apiSlice', () => {
  describe('apiReducer', () => {
    it('handles getUrlRequested action', () => {
      const newState = apiReducer(mockEmptyState, apiActions.getUrlRequested());

      expect(newState).toEqual({
        ...mockEmptyState,
        status: 'loading',
      });
    });

    it('handles getUrlSucceeded action', () => {
      const mockUrl = '/questions';
      const newState = apiReducer(
        mockEmptyState,
        apiActions.getUrlSucceeded({ url: mockUrl }),
      );

      expect(newState).toEqual({
        ...mockEmptyState,
        status: 'success',
        url: mockUrl,
      });
    });

    it('handles getUrlFailed action', () => {
      const mockErrorMessage = 'Unexpected error occurred';
      const newState = apiReducer(
        mockEmptyState,
        apiActions.getUrlFailed({ errorMessage: mockErrorMessage }),
      );

      expect(newState).toEqual({
        ...mockEmptyState,
        status: 'error',
        errorMessage: mockErrorMessage,
      });
    });
  });
});
