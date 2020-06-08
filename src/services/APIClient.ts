import {
  QuestionObjectResponse,
  QuestionsUrlResponse,
  ChoiceObjectResponse,
  QuestionBody,
} from '../types/questions';
import { APIHelpers } from './APIHelpers';
import { ApiResponseData } from '../types';

export const API_BASE_URL = 'https://polls.apiblueprint.org';

const getUrl = () => {
  const endpoint = API_BASE_URL;
  return client<QuestionsUrlResponse>(endpoint, 'GET');
};

const getQuestions = ({ url }: { url: string }) => {
  const endpoint = API_BASE_URL + url;
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

const postQuestion = ({
  url,
  questionBody,
  page,
}: {
  url: string;
  questionBody: QuestionBody;
  page?: number;
}) => {
  const endpoint = API_BASE_URL + url + (page !== undefined ? '?' + page : '');

  return client<QuestionObjectResponse, QuestionBody>(
    endpoint,
    'POST',
    questionBody,
  );
};

const client = <T, S = any>(
  endpoint: string,
  method: 'POST' | 'GET',
  body?: S,
): Promise<ApiResponseData<T>> => {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(endpoint, config).then(async (response) => {
    const linksInfo = APIHelpers.parseLinks(response);
    const responseData = await response.json();
    const data = {
      nextLink: linksInfo?.next,
      data: responseData,
    };
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

export const APIClient = {
  getUrl,
  getQuestions,
  postVote,
  postQuestion,
};
