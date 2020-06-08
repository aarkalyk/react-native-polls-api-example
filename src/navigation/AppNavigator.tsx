import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'react-native';

import { ApiCallStatus } from '../types';
import { LoadingScreen } from '../components';
import { getApiStatus } from '../store/selectors';
import { apiActions } from '../store/slices/apiSlice';

import { MainStackNavigator } from './MainStackNavigator';

export const AppNavigator = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(apiActions.getUrlRequested());
  }, [dispatch]);
  const status = useSelector(getApiStatus);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      {render(status)}
    </NavigationContainer>
  );
};

const render = (status: ApiCallStatus) => {
  switch (status) {
    case 'success':
      return <MainStackNavigator />;
    default:
      return <LoadingScreen />;
  }
};
