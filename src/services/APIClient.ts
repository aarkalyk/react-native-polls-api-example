export const API_BASE_URL = 'https://polls.apiblueprint.org';

const getQuestions = ({ path, page }: { path: string; page?: number }) => {
  const url = API_BASE_URL + path + (page !== undefined ? '?' + page : '');
  return client(url);
};

const client = (endpoint: string, body?: any) => {
  const config = {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
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
};
