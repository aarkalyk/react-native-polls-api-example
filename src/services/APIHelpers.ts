import {
  QuestionObjectResponse,
  QuestionObject,
  ChoiceObject,
  ChoiceObjectResponse,
} from '../types/questions';

const onlyNumbersRegex = /\d+/g;

const getLastIdFromUrl = (url: string) => {
  const match = url.match(onlyNumbersRegex);

  return match && match?.length > 0 ? Number(match[match.length - 1]) : -1;
};

const getFirstIdFromUrl = (url: string) => {
  const match = url.match(onlyNumbersRegex);

  return match && match?.length > 0 ? Number(match[0]) : -1;
};

type QuestionAndChoiceObjects = {
  questionObjects: QuestionObject[];
  choiceObjects: ChoiceObject[];
};
const convertQuestionsResponseToQuestionAndChoiceObjects = (
  questions: QuestionObjectResponse[],
) =>
  questions.reduce(
    (acc, questionResponse) => {
      const questionId = getLastIdFromUrl(questionResponse.url);
      const questionObject: QuestionObject = {
        id: questionId,
        question: questionResponse.question,
        published_at: new Date(questionResponse.published_at),
        choice_ids: questionResponse.choices.map((choice) => {
          const choice_id = getLastIdFromUrl(choice.url);
          const choiceObject: ChoiceObject = {
            id: choice_id,
            questionId,
            votes: choice.votes,
            choice: choice.choice,
          };

          acc.choiceObjects.push(choiceObject);

          return choice_id;
        }),
      };

      acc.questionObjects.push(questionObject);

      return acc;
    },
    {
      questionObjects: [],
      choiceObjects: [],
    } as QuestionAndChoiceObjects,
  );

const convertChoiceResponseToChoiceObject = ({
  choiceResponse,
}: {
  choiceResponse: ChoiceObjectResponse;
}) => {
  const choice_id = APIHelpers.getLastIdFromUrl(choiceResponse.url); // "/questions/1/choices/2" -> gets 2
  const choiceObject: ChoiceObject = {
    id: choice_id,
    questionId: APIHelpers.getFirstIdFromUrl(choiceResponse.url), // "/questions/1/choices/2" -> gets 1
    votes: choiceResponse.votes,
    choice: choiceResponse.choice,
  };

  return choiceObject;
};

const parseLinks = (response: Response) => {
  const linksString = response.headers.get('link');
  const linksData = linksString?.split('link:');
  const data = linksData?.length == 2 ? linksData[1] : linksString;
  const parsedData: { [key in string]: string } = {};

  const linkAndRelNames = data?.split(',');

  if (linkAndRelNames === undefined) {
    return undefined;
  }

  for (const item of linkAndRelNames) {
    const linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/gi.exec(item);

    const relName = linkInfo && linkInfo[2];
    const link = linkInfo && linkInfo[1];
    if (relName && link) {
      parsedData[relName] = link;
    }
  }

  return parsedData;
};

const getGenericErrorMessage = () => 'Unexpected error occurred';

export const APIHelpers = {
  getLastIdFromUrl,
  getFirstIdFromUrl,
  getGenericErrorMessage,
  convertChoiceResponseToChoiceObject,
  convertQuestionsResponseToQuestionAndChoiceObjects,
  parseLinks,
};
