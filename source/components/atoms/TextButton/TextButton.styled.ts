import styled from "styled-components/native";

const TextButtonContainer = styled.TouchableOpacity`
  height: 40px;
  justify-content: center;
  padding: 0px 16px;
  align-self: center;
`;

interface ButtonTextProps {
  disabled: boolean;
}
const ButtonText = styled.Text<ButtonTextProps>`
  font-size: 16px;
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
  color: black;
  text-align: center;
`;

export { TextButtonContainer, ButtonText };
