import { APIHelpers } from '../APIHelpers';
import {
  mockQuestionObjectResponse,
  mockQuestionAndChoiceObjects,
} from '../../test/mocks';

describe('APIHelpers', () => {
  describe('convertQuestionsResponseToQuestionAndChoiceObjects', () => {
    it('should convert QuestionsResponse to Question and Choice objects', () => {
      const questionAndChoiceObjects = APIHelpers.convertQuestionsResponseToQuestionAndChoiceObjects(
        [mockQuestionObjectResponse],
      );

      expect(questionAndChoiceObjects).toEqual(mockQuestionAndChoiceObjects);
    });
  });
});
