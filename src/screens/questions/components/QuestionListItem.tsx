import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { Card } from '../../../components';
import { RootState } from '../../../store';

export const QuestionListItem: FC<{ id: number }> = (props) => {
  const question = useSelector(
    (state: RootState) => state.questions.byId[props.id],
  );

  return (
    <TouchableOpacity style={styles.container}>
      <Card>
        <Text>{question.question}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
});
