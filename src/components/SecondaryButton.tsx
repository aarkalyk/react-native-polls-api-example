import React, { FC } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  TouchableOpacityProps,
} from 'react-native';
import { styleValues, colors } from '../styles';

interface Props extends TouchableOpacityProps {
  title: string;
}

export const SecondaryButton: FC<Props> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
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
