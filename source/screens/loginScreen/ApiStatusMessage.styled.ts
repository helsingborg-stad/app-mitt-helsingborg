import styled from "styled-components/native";

import type { ThemeType } from "../../styles/themeHelpers";

interface ApiStatusMessageContainerProps {
  theme: ThemeType;
}
const ApiStatusMessageContainer = styled.View<ApiStatusMessageContainerProps>`
  position: relative;
  top: -160px;
  min-height: 220px;
  align-self: center;
  justify-content: space-evenly;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme: themeProp }) =>
    themeProp.colors.complementary.red[3]};
  border: ${({ theme: themeProp }) =>
    `2px solid ${themeProp.colors.complementary.red[0]}`};
  padding: 0px 24px;
`;

export default ApiStatusMessageContainer;
