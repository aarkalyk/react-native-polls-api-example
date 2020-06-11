import React, { FC, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { images } from '../../../assets';
import { BodySmall } from '../../../components';
import { colors, styleValues } from '../../../styles';

interface Props extends TouchableOpacityProps {
  title: string;
  percentage: number;
  isChosen?: boolean;
  hasBeenVoted: boolean;
}

export const ChoiceListItem: FC<Props> = ({
  title,
  percentage,
  onPress,
  isChosen,
  disabled,
  hasBeenVoted,
}) => {
  const { width } = useProgressBarAnimation({
    percentage,
    hasBeenVoted,
  });

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={styles.container}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.percentageBar, { width }]}
        />
        <BodySmall style={styles.title}>{title}</BodySmall>
        {hasBeenVoted && (
          <View style={styles.percentageContainer}>
            <BodySmall style={styles.percentage}>
              {getPercentageString(percentage)}
            </BodySmall>
            {isChosen && (
              <Image source={images.checkMark()} style={styles.icon} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const useProgressBarAnimation = ({
  percentage,
  hasBeenVoted,
}: Pick<Props, 'percentage' | 'hasBeenVoted'>) => {
  const initialPercentage = hasBeenVoted ? percentage : 0;
  const progress = useRef(new Animated.Value(initialPercentage)).current;
  useEffect(() => {
    Animated.timing(progress, {
      duration: 300,
      toValue: percentage,
      useNativeDriver: false, // nativeDriver does not support animating width unfortunately
    }).start();
  }, [percentage]);

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return { width };
};

const getPercentageString = (percentage: number) =>
  ' ' + Math.round(percentage) + '%';

const styles = StyleSheet.create({
  percentageBar: {
    backgroundColor: colors.secondary,
  },
  container: {
    borderColor: colors.secondary,
    borderWidth: 1,
    opacity: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingVertical: styleValues.spacings.medium,
    marginTop: styleValues.spacings.small,
    borderRadius: styleValues.borderRadius,
  },
  icon: {
    marginLeft: styleValues.spacings.small,
    tintColor: colors.black,
    ...styleValues.iconSizes.large,
  },
  title: {
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    flexShrink: 1,
  },
  percentage: {
    fontWeight: 'bold',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: styleValues.spacings.medium,
  },
});
