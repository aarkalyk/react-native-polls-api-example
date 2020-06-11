import React from 'react';
import { render, fireEvent, waitFor } from 'react-native-testing-library';
import { act } from 'react-test-renderer';
import { Provider } from 'react-redux';

import {
  mockQuestionId,
  mockChoiceObject,
  mockQuestionBody,
  mockQuestionObject,
  mockReduxStoreState,
} from '../../../test/mocks';
import {
  QuestionCreation,
  ADD_CHOICE_BUTTON_TEST_ID,
  CHOICE_TEXT_INPUT_TEST_ID,
  QUESTION_SUBMIT_BUTTON_TEST_ID,
  QUESTION_TITLE_TEXT_INPUT_TEST_ID,
} from '../QuestionCreation';
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
      <QuestionCreation />
    </Provider>,
  );

  return {
    wrapper,
    dispatch,
  };
};

describe('QuestionDetails', () => {
  it('should take inputs from TextInputs and dispatch questionsActions.postQuestionRequested', async () => {
    const { wrapper, dispatch } = setup();

    // Enter question title
    const questionTitleTextInput = await wrapper.getByTestId(
      QUESTION_TITLE_TEXT_INPUT_TEST_ID,
    );
    act(() =>
      fireEvent.changeText(questionTitleTextInput, mockQuestionObject.question),
    );

    // Enter choice 1
    const choiceTextInput1 = await wrapper.getByTestId(
      CHOICE_TEXT_INPUT_TEST_ID + '1',
    );
    act(() => fireEvent.changeText(choiceTextInput1, mockChoiceObject.choice));
    await waitFor(() => choiceTextInput1);

    // Enter choice 2
    const choiceTextInput2 = await wrapper.getByTestId(
      CHOICE_TEXT_INPUT_TEST_ID + '2',
    );
    act(() => fireEvent.changeText(choiceTextInput2, mockChoiceObject.choice));
    await waitFor(() => choiceTextInput2);

    // Submit
    const submitButton = await wrapper.getByTestId(
      QUESTION_SUBMIT_BUTTON_TEST_ID,
    );
    act(() => fireEvent(submitButton, 'press'));

    expect(dispatch).toHaveBeenCalledWith(
      questionsActions.postQuestionRequested({
        questionBody: {
          ...mockQuestionBody,
          // duplicating choices since we entered the same choice twice above
          choices: [...mockQuestionBody.choices, mockQuestionBody.choices[0]],
        },
      }),
    );
  });

  it('should NOT dispatch questionsActions.postQuestionRequested if info is missing', async () => {
    const { wrapper, dispatch } = setup();

    // Press submit
    const submitButton = await wrapper.getByTestId(
      QUESTION_SUBMIT_BUTTON_TEST_ID,
    );
    act(() => fireEvent(submitButton, 'press'));

    // questionsActions.postQuestionRequested not dispatched since we haven't provided any 'choices'
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should add new text input for choice input when add more button pressed', async () => {
    const { wrapper } = setup();

    expect(wrapper.queryByTestId(CHOICE_TEXT_INPUT_TEST_ID + '3')).toBeNull();

    // Press add more
    const addMoreButton = await wrapper.getByTestId(ADD_CHOICE_BUTTON_TEST_ID);
    act(() => fireEvent(addMoreButton, 'press'));

    // check if third choice has been created
    expect(
      wrapper.queryByTestId(CHOICE_TEXT_INPUT_TEST_ID + '3'),
    ).not.toBeNull();
  });
});
