import {
  QuestionObjectResponse,
  QuestionObject,
  ChoiceObject,
} from '../types/questions';

const getIdFromUrl = (url: string) => {
  const match = url.match(/[^/]+$/); // gets the item after the last "/". e.g. /questions/1 -> gets 1.

  return match && match?.length > 0 ? Number(match[0]) : -1;
};

const convertQuestionsResponseToQuestionObjects = (
  questions: QuestionObjectResponse[],
) =>
  questions.map((question) => {
    const questionId = APIHelpers.getIdFromUrl(question.url);
    const questionObject: QuestionObject = {
      id: questionId,
      question: question.question,
      published_at: new Date(question.published_at),
      choices: question.choices.map((choice) => {
        const choiceObject: ChoiceObject = {
          id: APIHelpers.getIdFromUrl(choice.url),
          questionId,
          votes: choice.votes,
          choice: choice.choice,
        };

        return choiceObject;
      }),
    };

    return questionObject;
  });

const getGenericErrorMessage = () => 'Unexpected error occurred';

export const APIHelpers = {
  getIdFromUrl,
  getGenericErrorMessage,
  convertQuestionsResponseToQuestionObjects,
};
