import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Icon } from 'source/components/atoms';

const styles = StyleSheet.create({
  iconClose: {
    padding: 0,
    margin: 0,
    color: '#FFFFFF',
  },
  iconBack: {
    color: '#DD6161',
  },
});

const ButtonWrapper = styled.View({
  flexDirection: 'row',
  padding: 0,
  margin: 0,
  justifyContent: 'space-between',
  top: 0,
  zIndex: 999,
});

const CloseButtonWrapper = styled.View({
  flexDirection: 'row',
  padding: 0,
  margin: 0,
  justifyContent: 'flex-end',
  top: 0,
  zIndex: 999,
});

const BackButton = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 30,
  padding: 0,
  margin: 0,
  height: 32,
  width: 32,
  backgroundColor: '#FBF7F0',
});

const CloseButton = styled.View({
  alignItems: 'center',
  borderRadius: 30,
  justifyContent: 'center',
  padding: 0,
  margin: 0,
  height: 32,
  width: 32,
  backgroundColor: '#00213F',
});

const BackNavigation = ({ style, onBack, onClose, showBackButton, showCloseButton }) => (
  <ButtonWrapper style={style}>
    {showBackButton ? (
      <BackButton onStartShouldSetResponder={onBack}>
        <Icon name="keyboard-backspace" style={styles.iconBack} />
      </BackButton>
    ) : (
      <View />
    )}

    {showCloseButton ? (
      <CloseButton onStartShouldSetResponder={onClose}>
        <Icon name="close" style={styles.iconClose} />
      </CloseButton>
    ) : null}
  </ButtonWrapper>
);

BackNavigation.propTypes = {
  style: PropTypes.array,
  onBack: PropTypes.func,
  onClose: PropTypes.func,
  showBackButton: PropTypes.bool,
  showCloseButton: PropTypes.bool,
};

BackNavigation.defaultProps = {
  showBackButton: true,
  showCloseButton: true,
};

export default BackNavigation;
