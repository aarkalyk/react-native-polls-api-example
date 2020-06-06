import React, { FC, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../store';
import { Screen } from '../../components';
import { questionsActions } from '../../store/slices/questionsSlice';
import { QuestionListItem } from './components/QuestionListItem';

export const Questions: FC<{}> = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(questionsActions.getQuestionsRequested({ page: 1 }));
  }, [dispatch]);
  const ids = useSelector((state: RootState) => state.questions.ids);

  return (
    <Screen style={styles.screen}>
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

const renderItem = ({ item }: { item: number }) => (
  <QuestionListItem id={item} />
);

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
    paddingHorizontal: 20,
    paddingTop: 30,
  },
});
