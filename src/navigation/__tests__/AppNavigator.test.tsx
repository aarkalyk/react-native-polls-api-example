import React from 'react';
import { render, fireEvent, waitFor } from 'react-native-testing-library';
import { Provider } from 'react-redux';

import { AppNavigator } from '../AppNavigator';
import { RootState, createStore } from '../../store';
import { LOADING_SCREEN_TEST_ID } from '../../components';
import {
  mockQuestionId,
  mockQuestionObject,
  mockChoiceObject,
  mockChoiceId,
} from '../../mocks';
import { questionsActions } from '../../store/slices/questionsSlice';
import { choicesActions } from '../../store/slices/choicesSlice';
import { act } from 'react-test-renderer';

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
  ...require.requireActual(
    'react-native/Libraries/LayoutAnimation/LayoutAnimation',
  ),
  configureNext: jest.fn(),
}));

const mockState: Partial<RootState> = {
  questions: {
    status: 'success',
    byId: { [mockQuestionId]: mockQuestionObject },
    ids: [mockQuestionId],
  },
  api: {
    status: 'success',
    url: '/questions',
  },
  choices: {
    byId: { [mockChoiceId]: mockChoiceObject },
    votedChoiceByQuestionId: {},
  },
};

const setup = (state?: Partial<RootState>) => {
  const store = createStore({ ...mockState, ...state });
  const dispatch = jest.fn();
  store.dispatch = dispatch;

  const wrapper = render(
    <Provider store={store}>
      <AppNavigator />
    </Provider>,
  );

  return {
    wrapper,
    dispatch,
  };
};

describe('AppNavigator', () => {
  describe('LoadingScreen', () => {
    it('should render if api url is loading', async () => {
      const { wrapper } = setup({
        api: {
          status: 'loading',
          url: '',
        },
      });

      const loadingScreen = await wrapper.queryByTestId(LOADING_SCREEN_TEST_ID);
      await waitFor(() => loadingScreen);

      expect(loadingScreen).not.toBeNull();
    });
  });

  describe('Questions', () => {
    describe('empty state', () => {
      it('should dispatch questionsActions.getQuestionsRequested action and display loading screen', async () => {
        const { wrapper, dispatch } = setup({
          questions: {
            status: 'idle',
            byId: {},
            ids: [],
          },
        });

        const loadingScreen = await wrapper.queryByTestId(
          LOADING_SCREEN_TEST_ID,
        );
        await waitFor(() => loadingScreen);

        expect(dispatch).toHaveBeenCalledWith(
          questionsActions.getQuestionsRequested({ page: 1 }),
        );
        expect(loadingScreen).not.toBeNull();
      });
    });

    describe('non empty state', () => {
      it('should render questions from the store', async () => {
        const { wrapper } = setup();

        const questionTitle = await wrapper.queryByText(
          mockQuestionObject.question,
        );
        await waitFor(() => questionTitle);

        expect(questionTitle).not.toBeNull();
      });

      it('should navigate to QuestionDetails screen when tapping on QuestionListItem', async () => {
        const { wrapper } = setup();

        const questionItem = await wrapper.getByText(
          mockQuestionObject.question,
        );

        act(() => fireEvent(questionItem, 'press'));

        const choiceElement = await wrapper.queryByText(
          mockChoiceObject.choice,
        );

        await waitFor(() => choiceElement);

        expect(choiceElement).not.toBeNull();
      });

      describe('QuestionDetails', () => {
        it('should dispatch choicesActions.postVoteRequested when tapping on ChoiceListItem', async () => {
          const { wrapper, dispatch } = setup();

          const questionItem = await wrapper.getByText(
            mockQuestionObject.question,
          );

          act(() => fireEvent(questionItem, 'press'));

          const choiceElement = await wrapper.getByText(
            mockChoiceObject.choice,
          );

          await waitFor(() => choiceElement);

          act(() => fireEvent(choiceElement, 'press'));

          expect(dispatch).toHaveBeenCalledWith(
            choicesActions.postVoteRequested({
              question_id: mockQuestionId,
              choice_id: mockChoiceId,
            }),
          );
        });
      });
    });
  });
});
