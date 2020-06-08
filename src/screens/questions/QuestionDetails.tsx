import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { NavBar } from '../../navigation/NavBar';
import { styleValues, colors } from '../../styles';
import { Card, TouchableIcon } from '../../components';
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.buttonsContainer}>
          {question.choice_ids.map((id) => {
            const choice = choicesById[id];
            const isChosen = hasBeenVoted && votedChoice === id;
            const percents = hasBeenVoted
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
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: styleValues.spacings.medium,
  },
});
