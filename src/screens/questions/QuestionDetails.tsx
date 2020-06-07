import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootStackParamList } from '../../navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute, RouteProp } from '@react-navigation/native';

import { RootState } from '../../store';
import { styleValues } from '../../styles';
import { Card, SecondaryButton } from '../../components';
import { choicesActions } from '../../store/slices/choicesSlice';

type QuestionDetailsRouteProp = RouteProp<
  RootStackParamList,
  'QuestionDetails'
>;

export const questionDetailsRouteName = 'QuestionDetails';

export const QuestionDetails: FC<{}> = () => {
  const dispatch = useDispatch();
  const route = useRoute<QuestionDetailsRouteProp>();
  const question = useSelector(
    (state: RootState) => state.questions.byId[route.params.id],
  );
  const choicesById = useSelector((state: RootState) => state.choices.byId);

  return (
    <Card
      style={{
        marginHorizontal: styleValues.spacings.medium,
        marginVertical: styleValues.spacings.extraLarge,
      }}
    >
      <ScrollView style={{ flexGrow: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '400' }}>
          {question.question}
        </Text>
        <View style={{ marginTop: styleValues.spacings.medium }}>
          {question.choice_ids.map((id) => {
            const choice = choicesById[id];
            return (
              <SecondaryButton
                title={choice.choice}
                key={id}
                onPress={() => {
                  dispatch(
                    choicesActions.postVoteRequested({
                      question_id: question.id,
                      choice_id: id,
                    }),
                  );
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </Card>
  );
};
