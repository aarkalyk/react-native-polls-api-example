import {
  QuestionObjectResponse,
  QuestionsUrlResponse,
  ChoiceObjectResponse,
} from '../types/questions';

export const API_BASE_URL = 'https://polls.apiblueprint.org';

type GetQuestionsProps = { url: string; page?: number };
const getQuestions = ({ url, page }: GetQuestionsProps) => {
  const endpoint = API_BASE_URL + url + (page !== undefined ? '?' + page : '');
  return client<QuestionObjectResponse[]>(endpoint, 'GET');
};

type PostVoteProps = {
  url: string;
  question_id: number;
  choice_id: number;
};
const postVote = ({ url, question_id, choice_id }: PostVoteProps) => {
  const endpoint =
    API_BASE_URL + url + '/' + question_id + '/choices/' + choice_id;

  return client<ChoiceObjectResponse>(endpoint, 'POST');
};

const getUrl = () => {
  const endpoint = API_BASE_URL;
  return client<QuestionsUrlResponse>(endpoint, 'GET');
};

const client = <T>(endpoint: string, method: 'POST' | 'GET'): Promise<T> => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(endpoint, config).then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

export const APIClient = {
  getQuestions,
  getUrl,
  postVote,
};
