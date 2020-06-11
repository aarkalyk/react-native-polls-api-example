import React from 'react';
import { render, waitFor, fireEvent } from 'react-native-testing-library';
import { Provider } from 'react-redux';

import {
  mockQuestionObject,
  mockReduxStoreState,
  mockNextUrl,
} from '../../../test/mocks';
import {
  Questions,
  QUESTIONS_LIST_ID,
  ACTIVITY_INDICATOR_TEST_ID,
} from '../../../screens/Questions/Questions';
import { RootState, createStore } from '../../../store';
import { questionsActions } from '../../../store/slices/questionsSlice';

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

const scrollEventData = {
  nativeEvent: {
    contentOffset: {
      y: 500,
    },
    contentSize: {
      // Dimensions of the scrollable content
      height: 500,
      width: 100,
    },
    layoutMeasurement: {
      // Dimensions of the device
      height: 100,
      width: 100,
    },
  },
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

  describe('pagination', () => {
    describe('when nextUrl is available', () => {
      it('should dispatch getQuestionsRequested on end reached', () => {
        const { wrapper, dispatch } = setup({
          questions: {
            ...mockReduxStoreState.questions,
            nextLink: mockNextUrl,
            status: 'success',
          },
        });

        fireEvent.scroll(
          wrapper.getByTestId(QUESTIONS_LIST_ID),
          scrollEventData,
        );

        // called once on render and once on scroll end reached
        expect(dispatch.mock.calls).toEqual([
          [questionsActions.getQuestionsRequested()],
          [questionsActions.getQuestionsRequested()],
        ]);
      });
    });

    describe('when nextUrl is NOT available', () => {
      it('should NOT dispatch getQuestionsRequested on end reached', () => {
        const { wrapper, dispatch } = setup({
          questions: {
            ...mockReduxStoreState.questions,
            nextLink: undefined,
            status: 'success',
          },
        });

        fireEvent.scroll(
          wrapper.getByTestId(QUESTIONS_LIST_ID),
          scrollEventData,
        );

        // called only once on render
        expect(dispatch.mock.calls).toEqual([
          [questionsActions.getQuestionsRequested()],
        ]);
      });
    });
  });
});
