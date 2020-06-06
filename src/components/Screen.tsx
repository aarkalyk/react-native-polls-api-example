import React, { FC } from 'react';
import { ViewProps, Animated, StyleProp, ViewStyle } from 'react-native';

interface Props extends ViewProps {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}

export const Screen: FC<Props> = ({ style, children }) => {
  return (
    <Animated.View style={[{ backgroundColor: 'white', flex: 1 }, style]}>
      {children}
    </Animated.View>
  );
};
