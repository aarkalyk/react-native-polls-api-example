import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewProps } from 'react-native';
import { useSelector } from 'react-redux';

import { Card } from '../../../components';
import { RootState } from '../../../store';
import { styleValues } from '../../../styles';

interface Props extends ViewProps {
  id: number;
  onPress(): void;
}

export const QuestionListItem: FC<Props> = ({ id, onPress }) => {
  const question = useSelector((state: RootState) => state.questions.byId[id]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Card>
        <Text>{question.question}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: styleValues.spacings.small,
  },
});
