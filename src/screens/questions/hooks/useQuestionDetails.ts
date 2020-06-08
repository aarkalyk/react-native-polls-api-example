import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRoute, RouteProp } from '@react-navigation/native';

import {
  getHasBeenVoted,
  getVotedChoiceId,
  getQuestionById,
  getChoicesById,
} from '../../../store/selectors';
import { RootState } from '../../../store';
import { RootStackParamList } from '../../../navigation';

type QuestionDetailsRouteProp = RouteProp<
  RootStackParamList,
  'QuestionDetails'
>;

export const useQuestionDetails = () => {
  const route = useRoute<QuestionDetailsRouteProp>();
  const question = useSelector((state: RootState) =>
    getQuestionById(state, route.params.id),
  );
  const choicesById = useSelector(getChoicesById);
  const hasBeenVoted = useSelector((state: RootState) =>
    getHasBeenVoted(state, question.id),
  );
  const votedChoice = useSelector((state: RootState) =>
    getVotedChoiceId(state, question.id),
  );

  const sumOfVotes = useMemo(() => {
    const sum = question.choice_ids.reduce((acc, currentId) => {
      return acc + choicesById[currentId].votes;
    }, 0);

    return sum;
  }, [hasBeenVoted]);

  return {
    sumOfVotes,
    votedChoice,
    hasBeenVoted,
    choicesById,
    question,
  };
};
