import React, { FC, useEffect, useRef, useCallback } from 'react';
import { FlatList, StyleSheet, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../store';
import { Screen } from '../../components';
import { questionsActions } from '../../store/slices/questionsSlice';
import { QuestionListItem } from './components/QuestionListItem';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { questionDetailsRouteName } from './QuestionDetails';
import { styleValues } from '../../styles';

export const questionsRouteName = 'Questions';

export const Questions: FC<{}> = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(questionsActions.getQuestionsRequested({ page: 1 }));
  }, [dispatch]);

  const navigation = useNavigation();
  const ids = useSelector((state: RootState) => state.questions.ids);

  const opacity = useRef(new Animated.Value(1)).current;
  const changeOpacity = useCallback((option: 'hide' | 'show') => {
    const value: { [key in 'hide' | 'show']: number } = {
      hide: 0,
      show: 1,
    };

    Animated.timing(opacity, {
      duration: 300,
      toValue: value[option],
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      changeOpacity('show');
    }, [changeOpacity]),
  );

  const renderItem = ({ item }: { item: number }) => (
    <QuestionListItem
      id={item}
      onPress={() => {
        changeOpacity('hide');
        navigation.navigate(questionDetailsRouteName, { id: item });
      }}
    />
  );

  return (
    <Screen
      style={[
        styles.screen,
        {
          opacity,
        },
      ]}
    >
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        style={styles.flatList}
        data={ids}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </Screen>
  );
};

const keyExtractor = (item: number) => item + '';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flatList: {
    overflow: 'visible',
  },
  flatListContainer: {
    flexGrow: 1,
    paddingHorizontal: styleValues.spacings.medium,
    paddingTop: styleValues.spacings.extraLarge,
  },
});
