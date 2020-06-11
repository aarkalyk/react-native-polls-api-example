import React from 'react';
import {
  FlatList,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';

import { NavBar } from '../../navigation/NavBar';
import { styleValues, colors } from '../../styles';
import { Screen, PrimaryButton } from '../../components';

import { useQuestions } from './hooks/useQuestions';
import { QuestionListItem } from './components/QuestionListItem';

export const questionsRouteName = 'Questions';
export const CREATE_NEW_BUTTON_TEST_ID = 'CREATE_NEW_BUTTON_TEST_ID';
export const ACTIVITY_INDICATOR_TEST_ID = 'ACTIVITY_INDICATOR_TEST_ID';
export const QUESTIONS_LIST_ID = 'QUESTIONS_LIST_ID';

export const Questions = () => {
  const {
    ids,
    status,
    opacity,
    onEndReached,
    onPressCreate,
    onPressQuestion,
  } = useQuestions();

  const renderItem = ({ item }: { item: number }) => (
    <QuestionListItem id={item} onPress={onPressQuestion(item)} />
  );

  const renderListFooter = () =>
    status === 'loading' ? (
      <ActivityIndicator
        testID={ACTIVITY_INDICATOR_TEST_ID}
        size="small"
        color="white"
      />
    ) : null;

  return (
    <Screen>
      <Animated.View style={[styles.animatedContainer, { opacity }]}>
        <NavBar title="Questions" titleStyle={styles.navbarTitleStyle} />
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          style={styles.flatList}
          data={ids}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderListFooter()}
          onEndReached={onEndReached}
          onEndReachedThreshold={Platform.select({
            ios: 0,
            android: 0.5,
          })}
          testID={QUESTIONS_LIST_ID}
        />
        <View style={styles.primaryButtonContainer}>
          <PrimaryButton
            type="WithIcon"
            iconName="plus"
            onPress={onPressCreate}
            testID={CREATE_NEW_BUTTON_TEST_ID}
          />
        </View>
      </Animated.View>
    </Screen>
  );
};

const keyExtractor = (id: number) => String(id);

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.transparent,
  },
  flatList: {
    overflow: 'scroll',
  },
  flatListContainer: {
    flexGrow: 1,
    paddingHorizontal: styleValues.spacings.medium,
    paddingBottom: styleValues.spacings.extraLarge,
  },
  navbarTitleStyle: {
    color: colors.white,
  },
  primaryButtonContainer: {
    position: 'absolute',
    bottom: styleValues.spacings.medium,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
