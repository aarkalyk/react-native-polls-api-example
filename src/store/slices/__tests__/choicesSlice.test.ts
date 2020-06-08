import { choicesReducer, choicesActions, ChoicesState } from '../choicesSlice';
import {
  mockChoiceObject,
  mockQuestionAndChoiceObjects,
  mockChoiceId,
  mockQuestionId,
} from '../../../test/mocks';
import { questionsActions } from '../questionsSlice';

const mockEmptyState: ChoicesState = {
  byId: {},
  votedChoiceByQuestionId: {},
};

describe('choicesSlice', () => {
  describe('choicesReducer', () => {
    it('should handle choicesActions.postVoteRequested action', () => {
      const mockState = {
        ...mockEmptyState,
        byId: {
          [mockChoiceId]: mockChoiceObject,
        },
      };
      const newState = choicesReducer(
        mockState,
        choicesActions.postVoteRequested({
          question_id: mockQuestionId,
          choice_id: mockChoiceId,
        }),
      );

      expect(newState).toEqual({
        votedChoiceByQuestionId: {
          [mockQuestionId]: mockChoiceId,
        },
        byId: {
          [mockChoiceId]: {
            ...mockChoiceObject,
            votes: mockChoiceObject.votes + 1,
          },
        },
      });
    });

    it('should handle choicesActions.postVoteSucceeded action', () => {
      const mockState = {
        ...mockEmptyState,
        byId: {
          [mockChoiceId]: mockChoiceObject,
        },
      };
      const mockVotes = 25;
      const mockNewChoiceObject = {
        ...mockChoiceObject,
        votes: mockVotes,
      };
      const newState = choicesReducer(
        mockState,
        choicesActions.postVoteSucceeded({ choice: mockNewChoiceObject }),
      );

      expect(newState).toEqual({
        ...mockState,
        byId: {
          [mockChoiceId]: mockNewChoiceObject,
        },
      });
    });

    it('should handle questionsActions.getQuestionsAndChoicesSucceeded action', () => {
      const newState = choicesReducer(
        mockEmptyState,
        questionsActions.getQuestionsAndChoicesSucceeded({
          questions: mockQuestionAndChoiceObjects.questionObjects,
          choices: mockQuestionAndChoiceObjects.choiceObjects,
        }),
      );

      expect(newState).toEqual({
        ...mockEmptyState,
        byId: {
          [mockQuestionAndChoiceObjects.choiceObjects[0].id]:
            mockQuestionAndChoiceObjects.choiceObjects[0],
        },
      });
    });

    it('should handle postQuestionSucceeded action', () => {
      const newState = choicesReducer(
        mockEmptyState,
        questionsActions.postQuestionSucceeded({
          questions: mockQuestionAndChoiceObjects.questionObjects,
          choices: mockQuestionAndChoiceObjects.choiceObjects,
        }),
      );

      expect(newState).toEqual({
        ...mockEmptyState,
        byId: { [mockChoiceObject.id]: mockChoiceObject },
      });
    });
  });
});
