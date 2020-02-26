import React from 'react';
import { SafeAreaView } from 'react-native';
import { MaterialTopTabBar } from 'react-navigation-tabs';

const MaterialTopTabBarWrapper = props => {
  const {
    navigationState: { index },
  } = props;
  let color = '#2196f3';
  color = index === 0 ? '#EC6701' : color;
  color = index === 1 ? '#A61380' : color;
  return (
    <SafeAreaView
      style={{ backgroundColor: '#F8F8F8' }}
      forceInset={{ top: 'always', horizontal: 'never', bottom: 'never' }}
    >
      <MaterialTopTabBar
        {...props}
        activeTintColor={color}
        indicatorStyle={{
          backgroundColor: color,
          display: 'none',
        }}
        style={{ backgroundColor: '#F8F8F8' }}
        inactiveTintColor="gray"
        labelStyle={{ fontSize: 12, fontWeight: '400', fontFamily: 'Roboto' }}
      />
    </SafeAreaView>
  );
};

export default MaterialTopTabBarWrapper;
