import styled from "styled-components/native";
import { Text } from "../../atoms";

const sizes = {
  small: {
    padding: 0.25,
    margin: 4,
    marginTop: 0,
    fontSize: 12,
  },
  medium: {
    padding: 0.5,
    margin: 4,
    fontSize: 15,
  },
  large: {
    padding: 1,
    margin: 5,
    fontSize: 18,
  },
};

export const BoxTextWrapper = styled.View`
  flex: auto;
  flex-direction: row;
  align-items: flex-start;
`;

export const CheckboxFieldText = styled(Text)<{
  size: "small" | "medium" | "large";
}>`
  margin-left: ${(props) => props.theme.sizes[1]}px;
  margin-right: ${(props) => props.theme.sizes[1]}px;
  font-size: ${(props) => sizes[props.size].fontSize}px;
`;
