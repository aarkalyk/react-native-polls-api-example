import { questionsRouteName } from '../screens/Questions/Questions';
import { questionDetailsRouteName } from '../screens/QuestionDetails/QuestionDetails';
import { questionCreationRouteName } from '../screens/QuestionCreation/QuestionCreation';

export type RootStackParamList = {
  [questionsRouteName]: undefined;
  [questionCreationRouteName]: undefined;
  [questionDetailsRouteName]: { id: number };
};
