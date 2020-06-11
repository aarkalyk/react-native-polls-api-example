import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { TextInput, ScrollView } from 'react-native-gesture-handler';

import {
  Card,
  bodyStyles,
  PrimaryButton,
  TouchableIcon,
} from '../../components';
import { NavBar } from '../../navigation/NavBar';
import { styleValues, colors } from '../../styles';

import {
  useQuestionCreation,
  questionTitleChanged,
  choiceValueChanged,
  newChoiceAdded,
} from './hooks/useQuestionCreation';

export const questionCreationRouteName = 'QuestionCreation';
export const QUESTION_TITLE_TEXT_INPUT_TEST_ID =
  'QUESTION_TITLE_TEXT_INPUT_TEST_ID';
export const CHOICE_TEXT_INPUT_TEST_ID = 'CHOICE_TEXT_INPUT_TEST_ID';
export const QUESTION_SUBMIT_BUTTON_TEST_ID = 'QUESTION_SUBMIT_BUTTON_TEST_ID';
export const ADD_CHOICE_BUTTON_TEST_ID = 'ADD_CHOICE_BUTTON_TEST_ID_';

export const QuestionCreation = () => {
  const {
    localState,
    localDispatch,
    status,
    onPressBack,
    onPressSubmit,
  } = useQuestionCreation();

  const renderLeftItem = () => (
    <TouchableIcon iconName="cross" iconColor="primary" onPress={onPressBack} />
  );

  const renderRightItem = () => {
    if (status === 'loading') {
      return <ActivityIndicator size="small" color={colors.secondary} />;
    }

    return (
      <TouchableIcon
        testID={QUESTION_SUBMIT_BUTTON_TEST_ID}
        iconName="check"
        iconColor="primary"
        iconSize={{ width: 15, height: 15 }}
        onPress={onPressSubmit}
      />
    );
  };

  return (
    <Card style={styles.card}>
      <NavBar
        renderLeftItem={renderLeftItem}
        renderRightItem={renderRightItem}
        style={styles.navbar}
        titleStyle={styles.navbarTitle}
        title={`New question`}
      />
      <ScrollView style={styles.scrollView}>
        <TextInput
          placeholder="Your question goes here..."
          style={styles.textInput}
          multiline={true}
          testID={QUESTION_TITLE_TEXT_INPUT_TEST_ID}
          onChangeText={(text) => {
            localDispatch(questionTitleChanged({ value: text }));
          }}
        />
        {localState.choicesValues.ids.map((id) => (
          <TextInput
            key={id}
            placeholder={localState.choicesValues.byId[id].placeHolder}
            style={[styles.textInput, styles.choiceTextInput]}
            multiline={false}
            testID={CHOICE_TEXT_INPUT_TEST_ID + id}
            onChangeText={(text) => {
              localDispatch(choiceValueChanged({ id, value: text }));
            }}
          />
        ))}
        <PrimaryButton
          style={{ marginTop: styleValues.spacings.medium }}
          onPress={() => {
            localDispatch(newChoiceAdded());
          }}
          type="WithIcon"
          iconName="plus"
          testID={ADD_CHOICE_BUTTON_TEST_ID}
        />
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: styleValues.spacings.medium,
    marginVertical: styleValues.spacings.extraLarge,
    flex: 1,
  },
  navbar: {
    height: styleValues.spacings.large,
    paddingHorizontal: 0,
    marginBottom: styleValues.spacings.medium,
  },
  navbarTitle: {
    color: colors.black,
  },
  scrollView: {
    flexGrow: 1,
  },
  textInput: {
    flexWrap: 'wrap',
    fontSize: bodyStyles.regular.fontSize,
    borderBottomColor: colors.secondary,
    borderBottomWidth: 1,
    paddingVertical: styleValues.spacings.small,
    color: colors.black,
  },
  choiceTextInput: {
    fontSize: bodyStyles.small.fontSize,
    marginTop: styleValues.spacings.medium,
  },
});
