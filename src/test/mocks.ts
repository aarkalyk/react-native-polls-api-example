import {
  QuestionObject,
  QuestionObjectResponse,
  QuestionsUrlResponse,
  ChoiceObject,
  ChoiceObjectResponse,
  QuestionBody,
} from '../types/questions';
import { APIHelpers } from '../services';
import { RootState } from '../store';

export const mockChoiceId = 2;
export const mockQuestionId = 1;

export const mockQuestionObject: QuestionObject = {
  question: 'Favorite programming language?',
  published_at: new Date('2014-11-11T08:40:51.620Z'),
  id: mockQuestionId,
  choice_ids: [mockChoiceId],
};

export const mockChoiceObject: ChoiceObject = {
  choice: 'Swift',
  id: mockChoiceId,
  votes: 2048,
  questionId: mockQuestionId,
};

export const mockChoiceObjectResponse: ChoiceObjectResponse = {
  choice: 'Swift',
  url: `/questions/${mockQuestionId}/choices/${mockChoiceId}`,
  votes: 2048,
};

export const mockQuestionObjectResponse: QuestionObjectResponse = {
  question: 'Favorite programming language?',
  published_at: '2014-11-11T08:40:51.620Z',
  url: `/questions/${mockQuestionId}`,
  choices: [mockChoiceObjectResponse],
};

export const mockQuestionAndChoiceObjects: ReturnType<typeof APIHelpers.convertQuestionsResponseToQuestionAndChoiceObjects> = {
  questionObjects: [mockQuestionObject],
  choiceObjects: [mockChoiceObject],
};

export const mockQuestionBody: QuestionBody = {
  question: mockQuestionObject.question,
  choices: [mockChoiceObject.choice],
};

export const mockUrl = '/questions';
export const mockNextUrl = '/questions?2';

export const mockUrlResponse: QuestionsUrlResponse = {
  questions_url: mockUrl,
};

export const mockReduxStoreState: RootState = {
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
