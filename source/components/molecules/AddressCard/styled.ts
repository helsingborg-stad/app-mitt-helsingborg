import styled from "styled-components/native";
import { Button } from "../../atoms";

const TitleText = styled.Text`
  font-size: ${(props) => props.theme.fontSizes[2]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  ${(props) => `color: ${props.theme.colors.primary.red[0]};`}
  padding: 5px;
`;

const AddressText = styled.Text`
  font-size: ${(props) => props.theme.fontSizes[5]}px;
  font-weight: ${(props) => props.theme.fontWeights[0]};
  padding: 2px 0px;
  margin: 0;
`;

const AddressWrapper = styled.View`
  padding: 10px 5px;
`;

const StyledButton = styled(Button)`
  margin: 5px;
`;

export { TitleText, AddressText, AddressWrapper, StyledButton };
