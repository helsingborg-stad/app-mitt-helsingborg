import styled from "styled-components/native";

import { Label } from "../../atoms";

import { PrimaryColor } from "../../../styles/themeHelpers";

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StyledLabel = styled(Label)<{ colorSchema: PrimaryColor }>`
  color: ${(props) => props.theme.colors.primary[props.colorSchema][0]};
`;

export { Row, StyledLabel };
