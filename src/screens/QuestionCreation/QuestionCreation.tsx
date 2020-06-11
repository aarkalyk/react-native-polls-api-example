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
    status,
    localState,
    localDispatch,
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
        iconSize={styleValues.iconSizes.regular}
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
    flex: 1,
    marginHorizontal: styleValues.spacings.medium,
    marginVertical: styleValues.spacings.extraLarge,
  },
  navbar: {
    paddingHorizontal: 0,
    height: styleValues.spacings.large,
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
    borderBottomWidth: 1,
    color: colors.black,
    borderBottomColor: colors.secondary,
    fontSize: bodyStyles.regular.fontSize,
    paddingVertical: styleValues.spacings.small,
  },
  choiceTextInput: {
    fontSize: bodyStyles.small.fontSize,
    marginTop: styleValues.spacings.medium,
  },
});
