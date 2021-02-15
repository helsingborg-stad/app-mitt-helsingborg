import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleProp, ViewStyle } from 'react-native';

const Container = styled(KeyboardAwareScrollView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.neutrals[6]};
`;

interface Props {
  style?: StyleProp<ViewStyle>;
}

const ScreenWrapper: React.FC<Props> = ({ style, children, ...rest }) => (
  <Container style={style} {...rest}>
    {children}
  </Container>
);

ScreenWrapper.propTypes = {
  style: PropTypes.array,
};
export default ScreenWrapper;
