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

  describe('parseLinks', () => {
    it('should parse links from link headers', () => {
      const mockLinkHeaders =
        'link: "</questions?1>; rel="first", </questions?2>; rel="next", </questions?5>; rel="last""';
      const mockResponse = {
        headers: {
          get: () => mockLinkHeaders,
        },
      };

      const linksInfo = APIHelpers.parseLinks(mockResponse as any);

      expect(linksInfo).toEqual({
        first: '/questions?1',
        last: '/questions?5',
        next: '/questions?2',
      });
    });
  });
});
