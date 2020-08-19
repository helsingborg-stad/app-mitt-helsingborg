/* eslint-disable no-nested-ternary */
import React from 'react';
import { SafeAreaView } from 'react-native';
import { MaterialTopTabBar } from '@react-navigation/material-top-tabs';
import PropTypes from 'prop-types';

const MaterialTopTabBarWrapper = props => {
  const { navigationState } = props;
  const { index } = navigationState;

  // TODO: pass color and borderColor as props
  let color = '#2196f3';
  color = index === 0 ? '#75C9A8' : color;
  color = index === 1 ? '#DD6161' : color;
  color = index === 2 ? '#477C9C' : color;

  let borderColor = '#2196f3';
  borderColor = index === 0 ? '#75C9A8' : borderColor;
  borderColor = index === 1 ? '#DD6161' : borderColor;
  borderColor = index === 2 ? '#477C9C' : borderColor;

  const indicatorStyle = {
    borderBottomColor: borderColor,
    borderBottomWidth: 2,
  };
  return (
    <SafeAreaView
      style={{ backgroundColor: '#F8F8F8' }}
      forceInset={{ top: 'always', horizontal: 'never', bottom: 'never' }}
    >
      <MaterialTopTabBar
        {...props}
        indicatorStyle={indicatorStyle}
        activeTintColor={color}
        style={{ backgroundColor: '#F8F8F8' }}
        inactiveTintColor="gray"
        labelStyle={{ fontSize: 12, fontWeight: '400', fontFamily: 'Roboto' }}
      />
    </SafeAreaView>
  );
};

MaterialTopTabBarWrapper.propTypes = {
  navigationState: PropTypes.shape({
    index: PropTypes.number.isRequired,
  }).isRequired,
};

export default MaterialTopTabBarWrapper;
