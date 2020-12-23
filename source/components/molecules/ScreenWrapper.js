import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ScreenWrapper = styled(KeyboardAwareScrollView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.neutrals[6]};
`;

ScreenWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  style: PropTypes.array,
};

export default ScreenWrapper;
