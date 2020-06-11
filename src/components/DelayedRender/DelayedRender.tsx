import React, { FC } from 'react';
import { ViewProps, View } from 'react-native';

import { AppearFrom, DelayedRenderItem } from './DelayedRenderItem';

interface Props extends ViewProps {
  children?: React.ReactNode;
  initialDelay?: number;
  delayInterval?: number;
  appearFrom?: AppearFrom;
}

export const DelayedRender: FC<Props> = ({
  style,
  children,
  delayInterval,
  initialDelay,
  appearFrom = 'left',
}) => {
  let delay = initialDelay ?? DEFAULT_DELAY;

  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => {
        if (index !== 0) {
          delay += delayInterval ?? DEFAULT_DELAY;
        }

        return (
          <DelayedRenderItem appearFrom={appearFrom} delay={delay}>
            {child}
          </DelayedRenderItem>
        );
      })}
    </View>
  );
};

const DEFAULT_DELAY = 200;
