import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Notification } from 'app/store';
import PropTypes from 'prop-types';
import BadgeText from '../../atoms/Badge/BadgeText';
import Badge from '../../atoms/Badge/Badge';

const BottomBarTabWithBadge = (iconName, colorFocused) => ({ focused }) => (
  <Notification.State.Consumer>
    {({ number }) => (
      <View>
        <Icon name={iconName} color={focused ? colorFocused : 'gray'} />
        {number !== undefined && number > 0 && (
          <Badge>
            <BadgeText>{number}</BadgeText>
          </Badge>
        )}
      </View>
    )}
  </Notification.State.Consumer>
);

BottomBarTabWithBadge.propTypes = {
  focused: PropTypes.bool,
};

BottomBarTabWithBadge.defaultProps = {
  focused: false,
};

export default BottomBarTabWithBadge;
