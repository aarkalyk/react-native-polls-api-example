import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

export const Questions: FC<{}> = () => {
  const { ids, byId } = useSelector((state: RootState) => state.questions);

  // TODO: implement this screen
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      {ids.map((id) => (
        <Text key={id}>{byId[id].question}</Text>
      ))}
    </View>
  );
};
