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
  iconSize?: {
    width: number;
    height: number;
  };
}

export const TouchableIcon: FC<Props> = ({
  iconColor,
  iconName,
  onPress,
  iconSize,
  style,
  testID,
}) => {
  const tintColor = iconColor ? colors[iconColor] : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={touchableHitSlop}
      style={style}
      testID={testID}
    >
      <Image
        source={images[iconName]()}
        style={[
          styles.image,
          { tintColor },
          iconSize ? { ...iconSize } : undefined,
        ]}
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
