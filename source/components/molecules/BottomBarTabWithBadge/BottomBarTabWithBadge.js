import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import StoreContext from '../../../helpers/StoreContext';
import BadgeText from '../../atoms/Badge/BadgeText';
import Badge from '../../atoms/Badge/Badge';

const BottomBarTabWithBadge = (iconName, colorFocused) => ({ focused }) => (
  <StoreContext.Consumer>
    {({ badgeCount }) => (
      <View>
        <Icon name={iconName} color={focused ? colorFocused : 'gray'} />
        {badgeCount > 0 && (
          <Badge>
            <BadgeText>{badgeCount}</BadgeText>
          </Badge>
        )}
      </View>
    )}
  </StoreContext.Consumer>
);

export default BottomBarTabWithBadge;
