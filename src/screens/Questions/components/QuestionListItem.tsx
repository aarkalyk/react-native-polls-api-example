import React, { FC } from 'react';
import {
  View,
  Image,
  ViewProps,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';

import { images } from '../../../assets';
import { RootState } from '../../../store';
import { styleValues, colors } from '../../../styles';
import { Card, BodyRegular } from '../../../components';
import { getHasBeenVoted, getQuestionById } from '../../../store/selectors';

interface Props extends ViewProps {
  id: number;
  onPress(): void;
}

export const QuestionListItem: FC<Props> = ({ id, onPress }) => {
  const question = useSelector((state: RootState) =>
    getQuestionById(state, id),
  );
  const hasBeenVoted = useSelector((state: RootState) =>
    getHasBeenVoted(state, id),
  );

  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <Card>
        <View style={styles.container}>
          <BodyRegular style={styles.title}>{question.question}</BodyRegular>
          {hasBeenVoted && (
            <Image source={images.checkMark()} style={styles.icon} />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginBottom: styleValues.spacings.small,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flexShrink: 1,
    flexWrap: 'wrap',
    paddingRight: styleValues.spacings.small,
  },
  icon: {
    tintColor: colors.black,
    ...styleValues.iconSizes.large,
  },
});
