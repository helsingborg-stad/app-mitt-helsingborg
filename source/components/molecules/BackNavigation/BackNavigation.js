import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Icon from '../../atoms/Icon/Icon';

const BackNavigationWrapper = styled.View({
  flexDirection: 'row',
  padding: 0,
  margin: 0,
  justifyContent: 'space-between',
  top: 0,
  zIndex: 999,
});
const BackNavigationSingleWrapper = styled.View({
  flexDirection: 'row',
  padding: 0,
  margin: 0,
  justifyContent: 'flex-end',
  top: 0,
  zIndex: 999,
});

const BackButton = styled.View((props) => ({
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 30,
  padding: 0,
  margin: 0,
  height: 32,
  width: 32,
  backgroundColor: props.theme.colors.neutrals[7],
}));
const BackButtonIcon = styled(Icon).attrs(({ theme, colorSchema }) => ({
  color: theme.colors.primary[colorSchema][0],
}))``;

const CloseButton = styled.View((props) => ({
  alignItems: 'center',
  borderRadius: 30,
  justifyContent: 'center',
  padding: 0,
  margin: 0,
  height: 32,
  width: 32,
  backgroundColor: props.primary
    ? props.theme.colors.primary[props.colorSchema][0]
    : props.theme.colors.complementary[props.colorSchema][3],
}));

const CloseButtonIcon = styled(Icon)`
  color: ${(props) =>
    props.primary
      ? props.theme.colors.neutrals[7]
      : props.theme.colors.primary[props.colorSchema][0]};
`;

const BackNavigation = ({
  style,
  colorSchema,
  onBack,
  onClose,
  showBackButton,
  showCloseButton,
  inSubstep,
  primary,
}) =>
  !inSubstep ? (
    <BackNavigationWrapper style={style}>
      {showBackButton ? (
        <BackButton colorSchema={colorSchema} onStartShouldSetResponder={onBack}>
          <BackButtonIcon name="keyboard-backspace" colorSchema={colorSchema} />
        </BackButton>
      ) : (
        <View />
      )}

      {showCloseButton ? (
        <CloseButton
          primary={primary}
          colorSchema={colorSchema}
          onStartShouldSetResponder={onClose}
        >
          <CloseButtonIcon colorSchema={colorSchema} primary={primary} name="close" />
        </CloseButton>
      ) : null}
    </BackNavigationWrapper>
  ) : (
    <BackNavigationSingleWrapper style={style}>
      <BackButton
        colorSchema={colorSchema}
        onStartShouldSetResponder={() => {
          onBack();
        }}
      >
        <BackButtonIcon
          name="keyboard-backspace"
          style={{ transform: [{ rotate: '-90deg' }] }}
          colorSchema={colorSchema}
        />
      </BackButton>
    </BackNavigationSingleWrapper>
  );

BackNavigation.propTypes = {
  style: PropTypes.array,
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
  onBack: PropTypes.func,
  onClose: PropTypes.func,
  showBackButton: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  inSubstep: PropTypes.bool,
  primary: PropTypes.bool,
};

BackNavigation.defaultProps = {
  colorSchema: 'blue',
  style: [],
  showBackButton: true,
  showCloseButton: true,
  primary: true,
};

export default BackNavigation;
