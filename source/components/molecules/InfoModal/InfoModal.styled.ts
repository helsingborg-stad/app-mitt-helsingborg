import styled from "styled-components/native";

import type { DefaultStyledProps } from "./InfoModal.types";

const UnifiedPadding = [12, 24]; // Vertical padding, Horizontal padding

const PopupContainer = styled.View`
  max-height: 80%;
  padding: 0px;
  width: 80%;
  background-color: white;
  flex-direction: column;
  border-radius: 6px;
`;

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Header = styled.View<DefaultStyledProps>`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
  border-bottom-color: ${({ theme }) => theme.colors.complementary.neutral[1]};
  border-bottom-width: 1px;
  margin: 10px 10px 0px 10px;
  justify-content: center;
  flex-direction: row;
`;

const Form = styled.ScrollView<DefaultStyledProps>`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px 0px
    ${UnifiedPadding[1]}px;
  border-bottom-color: ${({ theme }) => theme.colors.complementary.neutral[1]};
  border-bottom-width: 1px;
`;

const Footer = styled.View`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
`;

export { PopupContainer, Wrapper, Header, Form, Footer };
