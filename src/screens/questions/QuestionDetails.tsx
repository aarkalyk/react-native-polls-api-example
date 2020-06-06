import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { Card, SecondaryButton } from '../../components';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { styleValues } from '../../styles';

type QuestionDetailsRouteProp = RouteProp<
  RootStackParamList,
  'QuestionDetails'
>;

export const questionDetailsRouteName = 'QuestionDetails';

export const QuestionDetails: FC<{}> = () => {
  const route = useRoute<QuestionDetailsRouteProp>();
  const question = useSelector(
    (state: RootState) => state.questions.byId[route.params.id],
  );

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
          {question.choices.map((choice) => {
            return <SecondaryButton title={choice.choice} key={choice.id} />;
          })}
        </View>
      </ScrollView>
    </Card>
  );
};
