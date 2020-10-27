import { Text as RNText } from 'react-native';
import styled from 'styled-components/native';

const Text = styled(RNText)`
  font-style: normal;
  font-weight: ${props => props.theme.typography.text.fontWeight};
  line-height: ${props => props.theme.typography.text.lineHeight};
  font-size: ${props => props.theme.typography.text.fontSize};
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
      font-weight: 900;
    `}
`;

export default Text;
