import { useEffect, useRef, useCallback } from 'react';
import { Animated, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import {
  getNextPageExists,
  getQuestionIds,
  getQuestionsStatus,
} from '../../../store/selectors';
import { questionsActions } from '../../../store/slices/questionsSlice';
import { questionDetailsRouteName } from '../../QuestionDetails/QuestionDetails';
import { questionCreationRouteName } from '../../QuestionCreation/QuestionCreation';

export const useQuestions = () => {
  const opacity = useRef(new Animated.Value(1)).current;
  const changeOpacity = useCallback((option: 'hide' | 'show') => {
    const value: { [key in 'hide' | 'show']: number } = {
      hide: 0,
      show: 1,
    };

    Animated.timing(opacity, {
      duration: Platform.select({
        ios: 500,
        android: 300,
      }),
      toValue: value[option],
      useNativeDriver: true,
    }).start();
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    changeOpacity(isFocused ? 'show' : 'hide');
  }, [isFocused, changeOpacity]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(questionsActions.getQuestionsRequested());
  }, [dispatch]);

  const ids = useSelector(getQuestionIds);
  const status = useSelector(getQuestionsStatus);
  const isNextPageExist = useSelector(getNextPageExists);
  const onEndReached = () => {
    if (isNextPageExist) {
      dispatch(questionsActions.getQuestionsRequested());
    }
  };

  const navigation = useNavigation();
  const onPressQuestion = (id: number) => () => {
    navigation.navigate(questionDetailsRouteName, { id });
  };
  const onPressCreate = () => {
    navigation.navigate(questionCreationRouteName);
  };

  return {
    ids,
    status,
    opacity,
    onEndReached,
    onPressCreate,
    onPressQuestion,
  };
};
