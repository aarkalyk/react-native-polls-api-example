import React, { FC } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  Image,
} from 'react-native';

import { ImageName, images } from '../assets';
import { colors, styleValues } from '../styles';

import { BodyRegular } from './Body';

interface PropsWithIcon extends TouchableOpacityProps {
  type: 'WithIcon';
  iconName: ImageName;
}

interface PropsWithTitle extends TouchableOpacityProps {
  type: 'WithTitle';
  title: string;
}

type Props = PropsWithIcon | PropsWithTitle;

export const PrimaryButton: FC<Props> = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={styles.touchable}
      testID={props.testID}
    >
      <View style={[styles.container, styles.shadow, props.style]}>
        {render(props)}
      </View>
    </TouchableOpacity>
  );
};

const render = (props: Props) => {
  switch (props.type) {
    case 'WithTitle':
      return <BodyRegular style={styles.title}>{props.title}</BodyRegular>;
    case 'WithIcon':
      return <Image source={images[props.iconName]()} style={styles.icon} />;
  }
};

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
  },
  container: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: styleValues.spacings.extraLarge,
  },
  shadow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    elevation: 2,
  },
  title: {
    color: 'white',
  },
  icon: {
    tintColor: 'white',
    ...styleValues.iconSizes.regular,
  },
});
