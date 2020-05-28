import React from 'react';
import { TouchableHighlight, Linking } from 'react-native';
import { Icon } from 'app/components/atoms';
import PropTypes from 'prop-types';

const InfoLink = props => {
  const { url, size } = props;
  const link = () => {
    Linking.openURL(url);
  };

  return (
    <>
      <TouchableHighlight onPress={link} underlayColor="gray">
        <Icon name="help-outline" size={size} />
      </TouchableHighlight>
    </>
  );
};

InfoLink.propTypes = {
  url: PropTypes.string.isRequired,
  size: PropTypes.number,
};

InfoLink.defaultProps = {
  size: 32,
};

export default InfoLink;
