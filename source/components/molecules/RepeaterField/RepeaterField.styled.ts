import styled from "styled-components/native";

import type { ThemeType } from "../../../theme/themeHelpers";

import { Button } from "../../atoms";

interface AddButtonProps {
  theme: ThemeType;
}
const AddButton = styled(Button)<AddButtonProps>`
  background: ${({ theme }) => theme.colors.neutrals[7]};
  border: 0;
`;

export default AddButton;
