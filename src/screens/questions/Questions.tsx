import React, { FC, useEffect, useRef, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { NavBar } from '../../navigation';
import { styleValues, colors } from '../../styles';
import { Screen, PrimaryButton } from '../../components';
import {
  getNextPageExists,
  getQuestionIds,
  getQuestionsStatus,
} from '../../store/selectors';
import { questionsActions } from '../../store/slices/questionsSlice';

import { questionDetailsRouteName } from './QuestionDetails';
import { QuestionListItem } from './components/QuestionListItem';
import { questionCreationRouteName } from './QuestionCreation';

export const questionsRouteName = 'Questions';
export const CREATE_NEW_BUTTON_TEST_ID = 'CREATE_NEW_BUTTON_TEST_ID';
export const ACTIVITY_INDICATOR_TEST_ID = 'ACTIVITY_INDICATOR_TEST_ID';

export const Questions: FC<{}> = () => {
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
        <NavBar title="Questions" />
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          style={styles.flatList}
          data={ids}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderListFooter()}
          onEndReached={onEndReached}
          onEndReachedThreshold={0}
        />
        <PrimaryButton
          type="WithIcon"
          iconName="plus"
          style={{
            position: 'absolute',
            bottom: styleValues.spacings.medium,
          }}
          onPress={onPressCreate}
          testID={CREATE_NEW_BUTTON_TEST_ID}
        />
      </Animated.View>
    </Screen>
  );
};

const useQuestions = () => {
  const opacity = useRef(new Animated.Value(1)).current;
  const changeOpacity = useCallback((option: 'hide' | 'show') => {
    const value: { [key in 'hide' | 'show']: number } = {
      hide: 0,
      show: 1,
    };

    Animated.timing(opacity, {
      duration: 500,
      toValue: value[option],
      useNativeDriver: true,
    }).start();
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    changeOpacity(isFocused ? 'show' : 'hide');
  }, [isFocused, changeOpacity]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(questionsActions.getQuestionsRequested());
  }, [dispatch]);

  const ids = useSelector(getQuestionIds);
  const status = useSelector(getQuestionsStatus);
  const isNextPageExist = useSelector(getNextPageExists);
  const onEndReached = () => {
    if (isNextPageExist) {
      dispatch(questionsActions.getQuestionsRequested());
    }
  };

  const navigation = useNavigation();
  const onPressQuestion = (id: number) => () => {
    navigation.navigate(questionDetailsRouteName, { id });
  };
  const onPressCreate = () => {
    navigation.navigate(questionCreationRouteName);
  };

  return {
    ids,
    status,
    opacity,
    onEndReached,
    onPressCreate,
    onPressQuestion,
  };
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
  },
});
