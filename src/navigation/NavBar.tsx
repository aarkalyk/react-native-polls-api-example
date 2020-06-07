import React, { FC } from 'react';
import {
  View,
  Text,
  ViewProps,
  StyleProp,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { colors, styleValues } from '../styles';

interface Props extends ViewProps {
  renderLeftItem?(): JSX.Element;
  renderRightItem?(): JSX.Element;
  titleStyle?: StyleProp<TextStyle>;
  title?: string;
}

export const NavBar: FC<Props> = ({
  renderLeftItem,
  renderRightItem,
  titleStyle,
  style,
  title = '',
}) => {
  return (
    <View style={[styles.container, style]}>
      {renderLeftItem !== undefined ? renderLeftItem() : <View />}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {renderRightItem !== undefined ? renderRightItem() : <View />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    alignItems: 'center',
    backgroundColor: colors.transparent,
    paddingHorizontal: styleValues.spacings.large,
  },
  title: {
    color: 'white',
    fontSize: 16,
  },
});
