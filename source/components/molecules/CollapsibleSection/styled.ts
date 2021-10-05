import styled from "styled-components/native";

interface SectionProps {
  color: string;
}
const Section = styled.View<SectionProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ color }) => color};
`;

const TitleBar = styled.TouchableHighlight`
  display: flex;
  height: 40px;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 0px 30px 0px 24px;
`;

export { Section, TitleBar };
