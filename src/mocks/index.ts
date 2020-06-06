import { QuestionObject, QuestionObjectResponse } from 'src/types/questions';

export const mockQuestionObject: QuestionObject = {
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

export const mockQuestionObjectResponse: QuestionObjectResponse = {
  question: 'Favorite programming language?',
  published_at: '2014-11-11T08:40:51.620Z',
  url: '/questions/1',
  choices: [
    {
      choice: 'Swift',
      url: '/questions/1/choices/1',
      votes: 2048,
    },
    {
      choice: 'Python',
      url: '/questions/1/choices/2',
      votes: 1024,
    },
    {
      choice: 'Objective-C',
      url: '/questions/1/choices/3',
      votes: 512,
    },
    {
      choice: 'Ruby',
      url: '/questions/1/choices/4',
      votes: 256,
    },
  ],
};

export const mockUrl = '/questions';
