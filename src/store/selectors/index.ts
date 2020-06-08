import { RootState } from '..';

export * from './questionsSelectors';
export * from './choicesSelectors';

export const getApiStatus = (state: RootState) => state.api.status;
