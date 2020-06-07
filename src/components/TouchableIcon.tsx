import React, { FC } from 'react';
import {
  TouchableOpacity,
  Image,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import { ImageName, images } from '../assets';
import { ColorName, colors } from '../styles';

interface Props extends TouchableOpacityProps {
  iconName: ImageName;
  iconColor?: ColorName;
}

export const TouchableIcon: FC<Props> = ({ iconColor, iconName, onPress }) => {
  const tintColor = iconColor ? colors[iconColor] : undefined;

  return (
    <TouchableOpacity onPress={onPress} hitSlop={touchableHitSlop}>
      <Image
        source={images[iconName]()}
        style={[styles.image, { tintColor }]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const touchableHitSlop = {
  top: 15,
  bottom: 15,
  left: 15,
  right: 15,
};

const styles = StyleSheet.create({
  image: {
    width: 12,
    height: 12,
  },
});
