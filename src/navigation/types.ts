import { questionsRouteName } from 'src/screens/questions/Questions';
import { questionDetailsRouteName } from 'src/screens/questions/QuestionDetails';

export type RootStackParamList = {
  [questionsRouteName]: undefined;
  [questionDetailsRouteName]: { id: number };
};
