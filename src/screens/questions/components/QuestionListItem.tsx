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
    <TouchableOpacity>
      <Card>
        <Text>{question.question}</Text>
      </Card>
    </TouchableOpacity>
  );
};
