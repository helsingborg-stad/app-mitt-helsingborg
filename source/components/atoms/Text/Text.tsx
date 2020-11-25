import { Text as RNText, TextProps } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

type Props = TextProps & {
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'a' | 'text';
  small?: boolean;
  strong?: boolean;
  italic?: boolean;
};

const Text = styled(RNText)<Props>`
  font-style: normal;
  font-weight: ${props => props.theme.typography[props.type || 'text'].fontWeight};
  line-height: ${props => props.theme.typography[props.type || 'text'].lineHeight}px;
  font-size: ${props => props.theme.typography[props.type || 'text'].fontSize}px;
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

Text.propTypes = {
  type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'text']),
  small: PropTypes.bool,
  italic: PropTypes.bool,
  strong: PropTypes.bool,
};

export default Text;
