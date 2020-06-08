import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { Provider } from 'react-redux';

import { RootState, createStore } from '../../../store';
import { mockQuestionObject, mockReduxStoreState } from '../../../test/mocks';
import { questionsActions } from '../../../store/slices/questionsSlice';
import {
  ACTIVITY_INDICATOR_TEST_ID,
  Questions,
} from '../../../screens/questions/Questions';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: () => jest.fn(),
    useNavigation: () => ({
      navigation: () => jest.fn(),
    }),
  };
});

const setup = (state?: Partial<RootState>) => {
  const store = createStore({ ...mockReduxStoreState, ...state });
  const dispatch = jest.fn();
  store.dispatch = dispatch;

  const wrapper = render(
    <Provider store={store}>
      <Questions />
    </Provider>,
  );

  return {
    wrapper,
    dispatch,
  };
};

describe('Questions', () => {
  describe('empty state', () => {
    it('should dispatch questionsActions.getQuestionsRequested action and display activity indicator', async () => {
      const { wrapper, dispatch } = setup({
        questions: {
          status: 'loading',
          byId: {},
          ids: [],
          creationStatus: 'idle',
        },
      });

      // check if activity indicator is displayed
      const activityIndicator = await wrapper.queryByTestId(
        ACTIVITY_INDICATOR_TEST_ID,
      );
      await waitFor(() => activityIndicator);

      expect(dispatch).toHaveBeenCalledWith(
        questionsActions.getQuestionsRequested(),
      );
      expect(activityIndicator).not.toBeNull();
    });
  });

  describe('non empty state', () => {
    it('should render questions from the store', async () => {
      const { wrapper } = setup();

      // check if question title from the store is displayed
      const questionTitle = await wrapper.queryByText(
        mockQuestionObject.question,
      );
      await waitFor(() => questionTitle);

      expect(questionTitle).not.toBeNull();
    });
  });
});
