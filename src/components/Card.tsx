import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

export const Card: FC<{}> = (props) => {
  return (
    <View style={[styles.container, styles.shadow]}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 6,
  },
  shadow: {
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    elevation: 3,
  },
});
