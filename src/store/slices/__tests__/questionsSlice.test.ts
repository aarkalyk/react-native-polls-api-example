import {
  questionsReducer,
  QuestionsState,
  questionsActions,
} from '../questionsSlice';
import {
  mockQuestionObject,
  mockQuestionAndChoiceObjects,
  mockQuestionBody,
} from '../../../test/mocks';

const mockEmptyState: QuestionsState = {
  status: 'idle',
  ids: [],
  byId: {},
  creationStatus: 'idle',
};

describe('questionsSlice', () => {
  describe('questionsReducer', () => {
    it('should handle getQuestionsRequested action', () => {
      const newState = questionsReducer(
        mockEmptyState,
        questionsActions.getQuestionsRequested(),
      );

      expect(newState).toEqual({
        ...mockEmptyState,
        status: 'loading',
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

    it('should handle postQuestionRequested action', () => {
      const newState = questionsReducer(
        mockEmptyState,
        questionsActions.postQuestionRequested({
          questionBody: mockQuestionBody,
        }),
      );

      expect(newState).toEqual({
        ...mockEmptyState,
        creationStatus: 'loading',
      });
    });

    it('should handle postQuestionFailed action', () => {
      const mockErrorMessage = 'Unexpected error occurred';
      const newState = questionsReducer(
        mockEmptyState,
        questionsActions.postQuestionFailed({ errorMessage: mockErrorMessage }),
      );

      expect(newState).toEqual({
        ...mockEmptyState,
        creationStatus: 'error',
        creationError: mockErrorMessage,
      });
    });

    describe('getQuestionsSucceeded', () => {
      it('should handle action', () => {
        const newState = questionsReducer(
          mockEmptyState,
          questionsActions.getQuestionsAndChoicesSucceeded({
            questions: mockQuestionAndChoiceObjects.questionObjects,
            choices: mockQuestionAndChoiceObjects.choiceObjects,
          }),
        );

        expect(newState).toEqual({
          ...mockEmptyState,
          status: 'success',
          byId: { [mockQuestionObject.id]: mockQuestionObject },
          ids: [mockQuestionObject.id],
        });
      });

      it('should NOT add duplicates', () => {
        const mockNonEmptyState: QuestionsState = {
          ...mockEmptyState,
          status: 'success',
          byId: { [mockQuestionObject.id]: mockQuestionObject },
          ids: [mockQuestionObject.id],
        };
        const newState = questionsReducer(
          mockNonEmptyState,
          questionsActions.getQuestionsAndChoicesSucceeded({
            questions: mockQuestionAndChoiceObjects.questionObjects,
            choices: mockQuestionAndChoiceObjects.choiceObjects,
          }),
        );

        expect(newState).toEqual(mockNonEmptyState);
      });
    });

    describe('postQuestionSucceeded', () => {
      it('should handle action', () => {
        const newState = questionsReducer(
          mockEmptyState,
          questionsActions.postQuestionSucceeded({
            questions: mockQuestionAndChoiceObjects.questionObjects,
            choices: mockQuestionAndChoiceObjects.choiceObjects,
          }),
        );

        expect(newState).toEqual({
          ...mockEmptyState,
          creationStatus: 'success',
          byId: { [mockQuestionObject.id]: mockQuestionObject },
          ids: [mockQuestionObject.id],
        });
      });

      it('should NOT add duplicates', () => {
        const mockNonEmptyState: QuestionsState = {
          ...mockEmptyState,
          creationStatus: 'success',
          byId: { [mockQuestionObject.id]: mockQuestionObject },
          ids: [mockQuestionObject.id],
        };
        const newState = questionsReducer(
          mockNonEmptyState,
          questionsActions.postQuestionSucceeded({
            questions: mockQuestionAndChoiceObjects.questionObjects,
            choices: mockQuestionAndChoiceObjects.choiceObjects,
          }),
        );

        expect(newState).toEqual(mockNonEmptyState);
      });
    });
  });
});
