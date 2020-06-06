import React, { FC } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from 'src/store';
import { Screen } from '../../components';
import { QuestionListItem } from './components/QuestionListItem';

export const Questions: FC<{}> = () => {
  const ids = useSelector((state: RootState) => state.questions.ids);

  const renderItem = ({ item }: { item: number }) => (
    <QuestionListItem id={item} />
  );

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
