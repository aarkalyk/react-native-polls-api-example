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
} from '../../test/mocks';
import { CREATE_NEW_BUTTON_TEST_ID } from '../../screens/questions/Questions';

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
  it('should render LoadingScreen if api url is loading', async () => {
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

  it('should render Questions screen when api url is present in the store', async () => {
    const { wrapper } = setup();

    const questionsNavTitle = await wrapper.queryByText('Questions');
    await waitFor(() => questionsNavTitle);

    expect(questionsNavTitle).not.toBeNull();
  });

  it('should navigate to QuestionDetails screen when tapping on QuestionListItem', async () => {
    const { wrapper } = setup();

    // navigate to QuestionDetails
    const questionItem = await wrapper.getByText(mockQuestionObject.question);
    act(() => fireEvent(questionItem, 'press'));

    // check if question choice is displayed (choice can ONLY be displayed in QuestionDetails)
    const choiceElement = await wrapper.queryByText(mockChoiceObject.choice);
    await waitFor(() => choiceElement);

    expect(choiceElement).not.toBeNull();
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
});
