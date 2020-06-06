import React, { FC } from 'react';
import { View, SafeAreaView, ViewProps } from 'react-native';

interface Props extends ViewProps {
  unsafe?: boolean;
}

export const Screen: FC<Props> = (props) => {
  const Wrapper = props.unsafe === true ? View : SafeAreaView;

  return <Wrapper>{props.children}</Wrapper>;
};
