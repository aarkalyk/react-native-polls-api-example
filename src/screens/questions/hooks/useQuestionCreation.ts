import { useReducer, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { QuestionBody } from '../../../types';
import { getCreationStatus } from '../../../store/selectors';
import { questionsActions } from '../../../store/slices/questionsSlice';

export const useQuestionCreation = () => {
  const status = useSelector(getCreationStatus);
  const previousStatus = useRef(status);
  const navigation = useNavigation();
  useEffect(() => {
    if (previousStatus.current !== status) {
      previousStatus.current = status;
      if (status === 'success') {
        navigation.goBack();
      }
    }
  }, [status, navigation]);

  const dispatch = useDispatch();
  const [localState, localDispatch] = useReducer(reducer, initialState);

  const onPressBack = () => {
    navigation.goBack();
  };

  const onPressSubmit = () => {
    const questionBody = convertStateToQuestionBody(localState);
    if (isQuestionBodyValid(questionBody)) {
      dispatch(questionsActions.postQuestionRequested({ questionBody }));
    } else {
      Alert.alert(
        'Please, make sure that your question has at least 2 choices',
      );
    }
  };

  return {
    status,
    localState,
    localDispatch,
    onPressBack,
    onPressSubmit,
  };
};

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'QUESTIONS_TITLE_CHANGED':
      return {
        ...state,
        questionTitle: action.value,
      };
    case 'CHOICE_VALUE_CHANGED':
      return {
        ...state,
        choicesValues: {
          ...state.choicesValues,
          byId: {
            ...state.choicesValues.byId,
            [action.id]: {
              ...state.choicesValues.byId[action.id],
              value: action.value,
            },
          },
        },
      };
    case 'NEW_CHOICE_ADDED': {
      return {
        ...state,
        choicesValues: {
          byId: {
            ...state.choicesValues.byId,
            [state.nextChoiceId]: {
              id: state.nextChoiceId,
              placeHolder: 'Choice ' + state.nextChoiceId,
              value: '',
            },
          },
          ids: [...state.choicesValues.ids, state.nextChoiceId],
        },
        nextChoiceId: state.nextChoiceId + 1,
      };
    }
    default:
      return state;
  }
};

const isQuestionBodyValid = (questionBody: QuestionBody) =>
  questionBody.question.length > 0 && questionBody.choices.length > 1;

const convertStateToQuestionBody = (state: State) => {
  const choices = state.choicesValues.ids
    .filter((id) => state.choicesValues.byId[id].value.length > 0)
    .map((id) => state.choicesValues.byId[id].value);
  const question = state.questionTitle;

  return {
    question,
    choices,
  };
};

const QUESTIONS_TITLE_CHANGED = 'QUESTIONS_TITLE_CHANGED';
export const questionTitleChanged = ({ value }: { value: string }) => ({
  type: QUESTIONS_TITLE_CHANGED as typeof QUESTIONS_TITLE_CHANGED,
  value,
});

const CHOICE_VALUE_CHANGED = 'CHOICE_VALUE_CHANGED';
export const choiceValueChanged = ({
  id,
  value,
}: {
  id: number;
  value: string;
}) => ({
  type: CHOICE_VALUE_CHANGED as typeof CHOICE_VALUE_CHANGED,
  id,
  value,
});

const NEW_CHOICE_ADDED = 'NEW_CHOICE_ADDED';
export const newChoiceAdded = () => ({
  type: NEW_CHOICE_ADDED as typeof NEW_CHOICE_ADDED,
});

type Actions =
  | ReturnType<typeof questionTitleChanged>
  | ReturnType<typeof choiceValueChanged>
  | ReturnType<typeof newChoiceAdded>;

type TextInputObject = {
  id: number;
  placeHolder: string;
  value: string;
};
type State = {
  questionTitle: string;
  choicesValues: {
    byId: { [key in number]: TextInputObject };
    ids: number[];
  };
  nextChoiceId: number;
};
const initialState: State = {
  questionTitle: '',
  choicesValues: {
    byId: {
      [1]: {
        id: 1,
        placeHolder: 'Choice 1',
        value: '',
      },
      [2]: {
        id: 1,
        placeHolder: 'Choice 2',
        value: '',
      },
    },
    ids: [1, 2],
  },
  nextChoiceId: 2,
};
