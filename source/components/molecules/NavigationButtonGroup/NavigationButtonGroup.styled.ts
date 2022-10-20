import styled from "styled-components/native";

interface ScrollContainerProps {
  horizontal?: boolean;
}
const ScrollContainer = styled.ScrollView<ScrollContainerProps>`
  padding-bottom: 16px;
  ${({ horizontal }) =>
    horizontal &&
    `margin-right: -24px;
    margin-left: -24px;`}
`;

export default ScrollContainer;
