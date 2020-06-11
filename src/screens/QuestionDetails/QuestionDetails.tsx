import React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import {
  Card,
  BodyRegular,
  DelayedRender,
  TouchableIcon,
} from '../../components';
import { NavBar } from '../../navigation/NavBar';
import { styleValues, colors } from '../../styles';
import { choicesActions } from '../../store/slices/choicesSlice';

import { ChoiceListItem } from './components/ChoiceListItem';
import { useQuestionDetails } from './hooks/useQuestionDetails';

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
    // Added the check for testing purposes. Since TouchableOpacity mock doesn't support functionality of disabling (https://github.com/callstack/react-native-testing-library/issues/156#issuecomment-483125409)
    if (!hasBeenVoted) {
      dispatch(choicesActions.postVoteRequested(args));
    }
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <BodyRegular style={styles.questionText}>
          {question.question}
        </BodyRegular>
        <DelayedRender style={styles.buttonsContainer} appearFrom="bottom">
          {question.choice_ids.map((id) => {
            const choice = choicesById[id];
            const isChosen = hasBeenVoted && votedChoice === id;
            const percentage = hasBeenVoted
              ? countPercentage(choice.votes, sumOfVotes)
              : 0;

            return (
              <ChoiceListItem
                disabled={hasBeenVoted}
                title={choice.choice}
                key={id}
                onPress={onPressChoice({
                  question_id: question.id,
                  choice_id: id,
                })}
                percentage={percentage}
                isChosen={isChosen}
                hasBeenVoted={hasBeenVoted}
              />
            );
          })}
        </DelayedRender>
      </ScrollView>
    </Card>
  );
};

const countPercentage = (value: number, sum: number) => {
  if (!sum || !value) {
    return 0;
  }
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
    color: colors.black,
  },
  questionText: {
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: styleValues.spacings.medium,
  },
});
