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
  align-self: center;
  justify-content: space-evenly;
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 28px;
  border-style: solid;
  border-width: 2px;
  margin-top: 15px;
`;

const InfoContainer = styled(ApiStatusMessageBase)`
  background: ${({ theme: { colors } }) => colors.complementary.neutral[3]};
  border-color: ${({ theme: { colors } }) => colors.complementary.neutral[0]};
`;

const WarningContainer = styled(ApiStatusMessageBase)`
  background: ${({ theme: { colors } }) => colors.complementary.red[3]};
  border-color: ${({ theme: { colors } }) => colors.complementary.red[0]};
`;

const MaintneceContainer = styled(ApiStatusMessageBase)`
  background: ${({ theme: { colors } }) => colors.complementary.blue[3]};
  border-color: ${({ theme: { colors } }) => colors.complementary.blue[0]};
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
    iconName: "info-outline",
    color: theme.colors.primary.blue[2],
  },
};

export const MessageText = styled(Text)<MessageTextProps>`
  color: ${({ color }) => color};
  line-height: 16px;
  padding-top: 6px;
`;

export default {
  [Type.Info]: InfoContainer,
  [Type.Warning]: WarningContainer,
  [Type.Maintenance]: MaintneceContainer,
};
