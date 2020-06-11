import React, { useEffect, useState } from 'react';
import { Animated, ViewProps, View } from 'react-native';

interface DelayedRenderProps extends ViewProps {
  children?: React.ReactNode;
  initialDelay?: number;
  delayInterval?: number;
  appearFrom?: AppearFrom;
}

type AppearFrom = 'left' | 'right' | 'top' | 'bottom';
const DEFAULT_DELAY = 200;

export const DelayedRender: React.StatelessComponent<DelayedRenderProps> = ({
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
          <DelayedRenderComponent appearFrom={appearFrom} delay={delay}>
            {child}
          </DelayedRenderComponent>
        );
      })}
    </View>
  );
};

interface DelayedRenderComponentProps extends ViewProps {
  delay: number;
  appearFrom: AppearFrom;
}

const ANIMATION_DURATION = 300;

export const DelayedRenderComponent: React.StatelessComponent<DelayedRenderComponentProps> = (
  props,
) => {
  const { children, delay, appearFrom, ...viewProps } = props;
  const [animatedValue] = useState<Animated.Value>(
    new Animated.Value(initialPositionByAppearFrom[appearFrom]),
  );
  useEffect(() => {
    let timeout: number;

    timeout = setTimeout(() => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const inputRange = inputRangeByAppearFrom[appearFrom];
  const outputRange = outputRangeByAppearFrom[appearFrom];
  const opacity = animatedValue.interpolate({
    inputRange,
    outputRange,
  });
  const transform = [{ [translateByAppearFrom[appearFrom]]: animatedValue }];

  return (
    <Animated.View {...viewProps} style={{ opacity, transform }}>
      {children}
    </Animated.View>
  );
};

const INITIAL_POSITION_POSITIVE = 20;
const INITIAL_POSITION_NEGATIVE = -INITIAL_POSITION_POSITIVE;

const initialPositionByAppearFrom: { [key in AppearFrom]: number } = {
  ['left']: INITIAL_POSITION_NEGATIVE,
  ['top']: INITIAL_POSITION_NEGATIVE,
  ['right']: INITIAL_POSITION_POSITIVE,
  ['bottom']: INITIAL_POSITION_POSITIVE,
};

const inputRangeByAppearFrom: { [key in AppearFrom]: number[] } = {
  ['left']: [INITIAL_POSITION_NEGATIVE, 0],
  ['top']: [INITIAL_POSITION_NEGATIVE, 0],
  ['right']: [0, INITIAL_POSITION_POSITIVE],
  ['bottom']: [0, INITIAL_POSITION_POSITIVE],
};

const outputRangeByAppearFrom: { [key in AppearFrom]: number[] } = {
  ['left']: [0, 1],
  ['top']: [0, 1],
  ['right']: [1, 0],
  ['bottom']: [1, 0],
};

const translateByAppearFrom: {
  [key in AppearFrom]: 'translateX' | 'translateY';
} = {
  ['left']: 'translateX',
  ['top']: 'translateY',
  ['right']: 'translateX',
  ['bottom']: 'translateY',
};
