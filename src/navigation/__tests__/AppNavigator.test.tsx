import React from 'react';
import { render, fireEvent, waitFor } from 'react-native-testing-library';
import { act } from 'react-test-renderer';
import { Provider } from 'react-redux';

import { AppNavigator } from '../AppNavigator';
import { RootState, createStore } from '../../store';
import { LOADING_SCREEN_TEST_ID } from '../../components';
import {
  mockQuestionId,
  mockQuestionObject,
  mockChoiceObject,
  mockChoiceId,
  mockQuestionBody,
} from '../../mocks';
import { questionsActions } from '../../store/slices/questionsSlice';
import { choicesActions } from '../../store/slices/choicesSlice';
import { CREATE_NEW_BUTTON_TEST_ID } from '../../screens/questions/Questions';
import {
  QUESTION_TITLE_TEXT_INPUT_TEST_ID,
  CHOICE_TEXT_INPUT_TEST_ID,
  QUESTION_SUBMIT_BUTTON,
} from '../../screens/questions/QuestionCreation';

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
    creationStatus: 'idle',
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

      // check if loading screen is displayed
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
            creationStatus: 'idle',
          },
        });

        // check if loading screen is displayed
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

        // check if question title from the store is displayed
        const questionTitle = await wrapper.queryByText(
          mockQuestionObject.question,
        );
        await waitFor(() => questionTitle);

        expect(questionTitle).not.toBeNull();
      });

      it('should navigate to QuestionDetails screen when tapping on QuestionListItem', async () => {
        const { wrapper } = setup();

        // navigate to QuestionDetails
        const questionItem = await wrapper.getByText(
          mockQuestionObject.question,
        );
        act(() => fireEvent(questionItem, 'press'));

        // check if question choice is displayed (choice can ONLY be displayed in QuestionDetails)
        const choiceElement = await wrapper.queryByText(
          mockChoiceObject.choice,
        );
        await waitFor(() => choiceElement);

        expect(choiceElement).not.toBeNull();
      });

      describe('QuestionDetails', () => {
        it('should dispatch choicesActions.postVoteRequested when tapping on ChoiceListItem', async () => {
          const { wrapper, dispatch } = setup();

          // navigate to QuestionDetails
          const questionItem = await wrapper.getByText(
            mockQuestionObject.question,
          );
          act(() => fireEvent(questionItem, 'press'));

          // tap on a choice
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

      it('should navigate to QuestionCreation screen when tapping on create new button', async () => {
        const { wrapper } = setup();

        // navigate to QuestionCreation
        const createNewButton = await wrapper.getByTestId(
          CREATE_NEW_BUTTON_TEST_ID,
        );
        act(() => fireEvent(createNewButton, 'press'));

        // Check if QuestionCreation navigation title is displayed
        const navBarTitle = await wrapper.queryByText('New question');
        await waitFor(() => navBarTitle);

        expect(navBarTitle).not.toBeNull();
      });

      describe('QuestionCreation', () => {
        it('should take inputs from TextInputs and submit as QuestionBody', async () => {
          const { wrapper, dispatch } = setup();

          // navigate to QuestionCreation
          const createNewButton = await wrapper.getByTestId(
            CREATE_NEW_BUTTON_TEST_ID,
          );
          act(() => fireEvent(createNewButton, 'press'));

          // Enter question title
          const questionTitleTextInput = await wrapper.getByTestId(
            QUESTION_TITLE_TEXT_INPUT_TEST_ID,
          );
          await waitFor(() => questionTitleTextInput);
          act(() =>
            fireEvent.changeText(
              questionTitleTextInput,
              mockQuestionObject.question,
            ),
          );

          // Enter choice
          const choiceTextInput = await wrapper.getByTestId(
            CHOICE_TEXT_INPUT_TEST_ID,
          );
          act(() =>
            fireEvent.changeText(choiceTextInput, mockChoiceObject.choice),
          );
          await waitFor(() => choiceTextInput);

          // Submit
          const submitButton = await wrapper.getByTestId(
            QUESTION_SUBMIT_BUTTON,
          );
          act(() => fireEvent(submitButton, 'press'));
          await waitFor(() => submitButton);

          expect(dispatch).toHaveBeenCalledWith(
            questionsActions.postQuestionRequested({
              questionBody: mockQuestionBody,
            }),
          );
        });
      });
    });
  });
});
