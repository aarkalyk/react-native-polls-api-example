import {
  questionsReducer,
  QuestionsState,
  questionsActions,
  mockQuestion,
} from '../questionsSlice';

const mockEmptyState: QuestionsState = {
  status: 'idle',
  ids: [],
  byId: {},
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
