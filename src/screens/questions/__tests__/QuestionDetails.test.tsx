import React from 'react';
import { render, fireEvent, waitFor } from 'react-native-testing-library';
import { act } from 'react-test-renderer';
import { Provider } from 'react-redux';

import { RootState, createStore } from '../../../store';
import {
  mockQuestionId,
  mockQuestionObject,
  mockChoiceObject,
  mockChoiceId,
  mockReduxStoreState,
} from '../../../test/mocks';
import { choicesActions } from '../../../store/slices/choicesSlice';
import { QuestionDetails } from '../QuestionDetails';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: () => jest.fn(),
    useNavigation: () => ({
      navigation: () => jest.fn(),
    }),
    useRoute: () => ({
      params: {
        id: mockQuestionId,
      },
    }),
  };
});

const setup = (state?: Partial<RootState>) => {
  const store = createStore({ ...mockReduxStoreState, ...state });
  const dispatch = jest.fn();
  store.dispatch = dispatch;

  const wrapper = render(
    <Provider store={store}>
      <QuestionDetails />
    </Provider>,
  );

  return {
    wrapper,
    dispatch,
  };
};

describe('QuestionDetails', () => {
  it('should render question data based on a given id form route parameters', async () => {
    const { wrapper } = setup();

    const questionTitle = await wrapper.queryByText(
      mockQuestionObject.question,
    );

    const choiceTitle = await wrapper.queryByText(mockChoiceObject.choice);

    expect(questionTitle).not.toBeNull();
    expect(choiceTitle).not.toBeNull();
  });

  it('should dispatch choicesActions.postVoteRequested when tapping on ChoiceListItem if not voted yet', async () => {
    const { wrapper, dispatch } = setup();

    const choiceItem = await wrapper.getByText(mockChoiceObject.choice);
    act(() => fireEvent(choiceItem, 'press'));

    expect(dispatch).toHaveBeenCalledWith(
      choicesActions.postVoteRequested({
        question_id: mockQuestionId,
        choice_id: mockChoiceId,
      }),
    );
  });

  it('should NOT dispatch choicesActions.postVoteRequested when tapping on ChoiceListItem if already voted', async () => {
    const { wrapper, dispatch } = setup({
      ...mockReduxStoreState,
      choices: {
        ...mockReduxStoreState.choices,
        votedChoiceByQuestionId: { [mockQuestionId]: mockChoiceId },
      },
    });

    const choiceItem = await wrapper.getByText(mockChoiceObject.choice);
    await waitFor(() => choiceItem);
    act(() => fireEvent(choiceItem, 'press'));

    expect(dispatch).not.toHaveBeenCalled();
  });
});
