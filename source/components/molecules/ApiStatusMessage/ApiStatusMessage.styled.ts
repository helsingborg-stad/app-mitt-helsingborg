import styled from "styled-components/native";

import Text from "../../atoms/Text";
import theme from "../../../theme/theme";
import { Type } from "../../../types/StatusMessages";
import type {
  ApiStatusMessageContainerProps,
  MessageTextProps,
  StyleMap,
} from "./ApiStatusMessage.types";

const ApiStatusMessageBase = styled.View<ApiStatusMessageContainerProps>`
  min-height: 160px;
  align-self: center;
  justify-content: space-evenly;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 24px;
`;

const InfoContainer = styled(ApiStatusMessageBase)`
  background: ${({ theme: propTheme }) =>
    propTheme.colors.complementary.neutral[3]};
  border: ${({ theme: propTheme }) =>
    `2px solid ${propTheme.colors.complementary.neutral[1]}`};
`;

const WarningContainer = styled(ApiStatusMessageBase)`
  background: ${({ theme: propTheme }) =>
    propTheme.colors.complementary.red[3]};
  border: ${({ theme: propTheme }) =>
    `2px solid ${propTheme.colors.complementary.red[0]}`};
`;

const MaintneceContainer = styled(ApiStatusMessageBase)`
  background: ${({ theme: propTheme }) =>
    propTheme.colors.complementary.blue[3]};
  border: ${({ theme: propTheme }) =>
    `2px solid ${propTheme.colors.complementary.blue[1]}`};
`;

export const styleTypeMap: StyleMap = {
  [Type.Info]: {
    iconName: "info-outline",
    color: theme.colors.primary.neutral[2],
  },
  [Type.Warning]: {
    iconName: "error-outline",
    color: theme.colors.primary.red[2],
  },
  [Type.Maintenance]: {
    iconName: "sync",
    color: theme.colors.primary.blue[2],
  },
};

export const MessageText = styled(Text)<MessageTextProps>`
  color: ${({ color }) => color};
`;

export default {
  [Type.Info]: InfoContainer,
  [Type.Warning]: WarningContainer,
  [Type.Maintenance]: MaintneceContainer,
};
