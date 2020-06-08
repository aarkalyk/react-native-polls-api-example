import React from 'react';
import { render, fireEvent, waitFor } from 'react-native-testing-library';
import { act } from 'react-test-renderer';
import { Provider } from 'react-redux';

import { RootState, createStore } from '../../../store';
import {
  mockQuestionId,
  mockQuestionObject,
  mockChoiceObject,
  mockQuestionBody,
  mockReduxStoreState,
} from '../../../test/mocks';
import { questionsActions } from '../../../store/slices/questionsSlice';
import {
  QUESTION_TITLE_TEXT_INPUT_TEST_ID,
  CHOICE_TEXT_INPUT_TEST_ID,
  QUESTION_SUBMIT_BUTTON,
  QuestionCreation,
} from '../../../screens/questions/QuestionCreation';

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
  it('should take inputs from TextInputs and submit as QuestionBody', async () => {
    const { wrapper, dispatch } = setup();

    // Enter question title
    const questionTitleTextInput = await wrapper.getByTestId(
      QUESTION_TITLE_TEXT_INPUT_TEST_ID,
    );
    await waitFor(() => questionTitleTextInput);
    act(() =>
      fireEvent.changeText(questionTitleTextInput, mockQuestionObject.question),
    );

    // Enter choice 1
    const choiceTextInput1 = await wrapper.getByTestId(
      CHOICE_TEXT_INPUT_TEST_ID + '_1',
    );
    act(() => fireEvent.changeText(choiceTextInput1, mockChoiceObject.choice));
    await waitFor(() => choiceTextInput1);

    // Enter choice 2
    const choiceTextInput2 = await wrapper.getByTestId(
      CHOICE_TEXT_INPUT_TEST_ID + '_2',
    );
    act(() => fireEvent.changeText(choiceTextInput2, mockChoiceObject.choice));
    await waitFor(() => choiceTextInput2);

    // Submit
    const submitButton = await wrapper.getByTestId(QUESTION_SUBMIT_BUTTON);
    act(() => fireEvent(submitButton, 'press'));
    await waitFor(() => submitButton);

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
});
