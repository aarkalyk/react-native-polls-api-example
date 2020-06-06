import React, { FC } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styleValues, colors } from '../styles';

export const SecondaryButton: FC<{ title: string }> = (props) => {
  return (
    <TouchableOpacity>
      <View
        style={{
          padding: styleValues.spacings.medium,
          borderWidth: 1,
          borderColor: colors.primary,
          borderRadius: styleValues.borderRadius,
          marginTop: styleValues.spacings.small,
        }}
      >
        <Text>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};
