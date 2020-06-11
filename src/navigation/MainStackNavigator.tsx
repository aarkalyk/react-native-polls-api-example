import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';

import {
  QuestionDetails,
  questionDetailsRouteName,
} from '../screens/QuestionDetails/QuestionDetails';
import {
  QuestionCreation,
  questionCreationRouteName,
} from '../screens/QuestionCreation/QuestionCreation';
import { Questions, questionsRouteName } from '../screens/Questions/Questions';

const Stack = createStackNavigator();

export const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      mode="modal"
      headerMode="none"
      screenOptions={screenOptions}
    >
      <Stack.Screen name={questionsRouteName} component={Questions} />
      <Stack.Screen
        name={questionDetailsRouteName}
        component={QuestionDetails}
      />
      <Stack.Screen
        name={questionCreationRouteName}
        component={QuestionCreation}
      />
    </Stack.Navigator>
  );
};

const screenOptions: StackNavigationOptions = {
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.8, 0.9, 1],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0],
        extrapolate: 'clamp',
      }),
    },
  }),
};
