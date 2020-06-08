import React, { FC, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  LayoutAnimation,
  TouchableOpacityProps,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { images } from '../../../assets';
import { BodySmall } from '../../../components';
import { colors, styleValues } from '../../../styles';

interface Props extends TouchableOpacityProps {
  title: string;
  percents?: number;
  isChosen?: boolean;
  hasBeenVoted: boolean;
}

export const ChoiceListItem: FC<Props> = ({
  title,
  percents,
  onPress,
  isChosen,
  disabled,
  hasBeenVoted,
}) => {
  useEffect(() => {
    LayoutAnimation.configureNext(LinearAnimationConfig);
  }, [percents]);

  const borderWidth = hasBeenVoted ? 0 : 1;
  const width = percents ? `${percents}%` : 0;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={[styles.container, { borderWidth }]}>
        <View style={[styles.percentageBar, { width }]} />
        {!hasBeenVoted && (
          <BodySmall style={[styles.title, { textAlign: 'center' }]}>
            {title}
          </BodySmall>
        )}
        {hasBeenVoted && <BodySmall style={styles.title}>{title}</BodySmall>}
        {isChosen && <Image source={images.checkMark()} style={styles.icon} />}
      </View>
    </TouchableOpacity>
  );
};

const LinearAnimationConfig = {
  duration: 500,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.scaleXY,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

const styles = StyleSheet.create({
  percentageBar: {
    backgroundColor: colors.secondary,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    padding: 0,
    margin: 0,
    flex: 1,
  },
  container: {
    borderColor: colors.secondary,
    borderWidth: 1,
    opacity: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: styleValues.spacings.medium,
    marginTop: styleValues.spacings.small,
    borderRadius: styleValues.borderRadius,
    overflow: 'hidden',
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: colors.black,
    position: 'absolute',
    right: styleValues.spacings.medium,
  },
  title: {
    flexGrow: 1,
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
});
