import { questionsReducer, QuestionsState, questionsActions } from '../questionsSlice';
import { QuestionObject } from 'src/types/questions';

const mockEmptyState: QuestionsState = {
  status: 'idle',
  ids: [],
  byId: {},
};

export const mockQuestion: QuestionObject = {
  question: 'Favorite programming language?',
  published_at: new Date('2014-11-11T08:40:51.620Z'),
  id: 1,
  choices: [
    {
      choice: 'Swift',
      id: 1,
      votes: 2048,
      questionId: 1,
    },
    {
      choice: 'Python',
      id: 2,
      votes: 1024,
      questionId: 1,
    },
    {
      choice: 'Objective-C',
      id: 3,
      votes: 512,
      questionId: 1,
    },
    {
      choice: 'Ruby',
      id: 4,
      votes: 256,
      questionId: 1,
    },
  ],
};

describe('questionsSlice', () => {
  describe('questionsReducer', () => {
    it('should handle getQuestionsRequested action', () => {
      const newState = questionsReducer(
        mockEmptyState,
        questionsActions.getQuestionsRequested({ page: 1 }),
      );

      expect(newState).toEqual({
        ...mockEmptyState,
        status: 'loading',
      });
    });

    it('should handle getQuestionsSucceeded action', () => {
      const newState = questionsReducer(
        mockEmptyState,
        questionsActions.getQuestionsSucceeded({ questions: [mockQuestion] }),
      );

      expect(newState).toEqual({
        status: 'success',
        byId: { [mockQuestion.id]: mockQuestion },
        ids: [mockQuestion.id],
      });
    });

    it('should handle getQuestionsFailed action', () => {
      const mockErrorMessage = 'Unexpected error occurred';
      const newState = questionsReducer(
        mockEmptyState,
        questionsActions.getQuestionsFailed({ errorMessage: mockErrorMessage }),
      );

      expect(newState).toEqual({
        ...mockEmptyState,
        status: 'error',
        errorMessage: mockErrorMessage,
      });
    });
  });
});
