import { Text as RNText } from 'react-native';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/native';
import theme from '../../../styles/theme';

const Text = styled(RNText)`
  font-style: normal;
  font-weight: ${props => props.theme.typography[props.type].fontWeight};
  line-height: ${props => props.theme.typography[props.type].lineHeight}px;
  font-size: ${props => props.theme.typography[props.type].fontSize}px;
  flex-shrink: 1;
  color: ${props => props.theme.colors.neutrals[0]};
  ${({ small }) =>
    small &&
    `
      font-size: 12px;
    `}
  ${({ strong }) =>
    strong &&
    `
      font-weight: bold;
    `}
  ${({ italic }) =>
    italic &&
    `
      font-style: italic;
    `}
`;

Text.defaultProps = {
  type: 'text',
};

Text.PropTypes = {
  type: PropTypes.oneOf(Object.keys(theme.typography)),
};

export default Text;
