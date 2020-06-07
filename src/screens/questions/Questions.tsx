import React, { FC, useEffect, useRef, useCallback } from 'react';
import { FlatList, StyleSheet, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../store';
import { Screen } from '../../components';
import { NavBar } from '../../navigation';
import { styleValues, colors } from '../../styles';
import { questionsActions } from '../../store/slices/questionsSlice';

import { questionDetailsRouteName } from './QuestionDetails';
import { QuestionListItem } from './components/QuestionListItem';

export const questionsRouteName = 'Questions';

export const Questions: FC<{}> = () => {
  const { ids, opacity, onPressQuestion } = useQuestions();

  const renderItem = ({ item }: { item: number }) => (
    <QuestionListItem id={item} onPress={onPressQuestion(item)} />
  );

  return (
    <Screen>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity,
          },
        ]}
      >
        <NavBar title="Questions" />
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          style={styles.flatList}
          data={ids}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </Screen>
  );
};

const useQuestions = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(questionsActions.getQuestionsRequested({ page: 1 }));
  }, [dispatch]);

  const ids = useSelector((state: RootState) => state.questions.ids);

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

  useFocusEffect(
    useCallback(() => {
      changeOpacity('show');
    }, [changeOpacity]),
  );

  const navigation = useNavigation();
  const onPressQuestion = (id: number) => () => {
    changeOpacity('hide');
    navigation.navigate(questionDetailsRouteName, { id });
  };

  return {
    ids,
    opacity,
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
