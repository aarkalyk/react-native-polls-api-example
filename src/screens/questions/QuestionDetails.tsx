import React, { FC, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import { RootState } from '../../store';
import { styleValues } from '../../styles';
import { Card, TouchableIcon } from '../../components';
import {
  getHasBeenVoted,
  getVotedChoiceId,
  getQuestionById,
  getChoicesById,
} from '../../store/selectors';
import { RootStackParamList, NavBar } from '../../navigation';
import { choicesActions } from '../../store/slices/choicesSlice';

import { ChoiceListItem } from './components/ChoiceListItem';

type QuestionDetailsRouteProp = RouteProp<
  RootStackParamList,
  'QuestionDetails'
>;

export const questionDetailsRouteName = 'QuestionDetails';

export const QuestionDetails = () => {
  const {
    question,
    sumOfVotes,
    votedChoice,
    choicesById,
    hasBeenVoted,
  } = useQuestionDetails();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onPressChoice = (args: {
    question_id: number;
    choice_id: number;
  }) => () => {
    dispatch(choicesActions.postVoteRequested(args));
  };

  const renderLeftItem = () => (
    <TouchableIcon
      iconName="cross"
      iconColor="primary"
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  return (
    <Card style={styles.card}>
      <NavBar
        renderLeftItem={renderLeftItem}
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        title={`Question ${question.id}`}
      />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.buttonsContainer}>
          {question.choice_ids.map((id) => {
            const choice = choicesById[id];
            const isChosen = hasBeenVoted && votedChoice === id;
            const percents = hasBeenVoted
              ? countPercentage(choice.votes, sumOfVotes)
              : undefined;

            return (
              <ChoiceListItem
                disabled={hasBeenVoted}
                title={choice.choice}
                key={id}
                onPress={onPressChoice({
                  question_id: question.id,
                  choice_id: id,
                })}
                percents={percents}
                isChosen={isChosen}
                hasBeenVoted={hasBeenVoted}
              />
            );
          })}
        </View>
      </ScrollView>
    </Card>
  );
};

const useQuestionDetails = () => {
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

const countPercentage = (value: number, sum: number) => {
  return (value / sum) * 100;
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  card: {
    marginHorizontal: styleValues.spacings.medium,
    marginVertical: styleValues.spacings.extraLarge,
  },
  navbar: {
    height: styleValues.spacings.large,
    paddingHorizontal: 0,
    marginBottom: styleValues.spacings.medium,
  },
  navbarTitle: {
    color: 'black',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: styleValues.spacings.medium,
  },
});
