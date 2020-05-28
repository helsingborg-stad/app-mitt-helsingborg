import React from 'react';
import { StyleSheet } from 'react-native';
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

const BackNavigation = ({ style, onBack, onClose, isBackBtnVisible }) =>
  isBackBtnVisible ? (
    <ButtonWrapper style={style}>
      <BackButton onStartShouldSetResponder={onBack}>
        <Icon name="keyboard-backspace" style={styles.iconBack} />
      </BackButton>
      <CloseButton onStartShouldSetResponder={onClose}>
        <Icon name="close" style={styles.iconClose} />
      </CloseButton>
    </ButtonWrapper>
  ) : (
    <CloseButtonWrapper>
      <CloseButton onStartShouldSetResponder={onClose}>
        <Icon name="close" style={styles.iconClose} />
      </CloseButton>
    </CloseButtonWrapper>
  );

BackNavigation.propTypes = {
  style: PropTypes.object,
  onBack: PropTypes.func,
  onClose: PropTypes.func,
  isBackBtnVisible: PropTypes.bool,
};

BackNavigation.defaultProps = {
  isBackBtnVisible: true,
};

export default BackNavigation;
