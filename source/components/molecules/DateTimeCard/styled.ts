import styled from "styled-components/native";

const Container = styled.View<{ align: string }>`
  margin-top: 10px;
  border-width: 3px;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${(props) => props.align};
  ${(props) => `background-color: ${props.theme.colors.complementary.red[3]};`}
  ${(props) => `border-color: ${props.theme.colors.complementary.red[2]};`}
`;

const TitleText = styled.Text<{ size: string }>`
  font-size: ${(props) =>
    props.size === "large"
      ? props.theme.fontSizes[2]
      : props.theme.fontSizes[1]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  ${(props) => `color: ${props.theme.colors.primary.red[0]};`}
  padding: 5px;
`;

const DateText = styled.Text<{ size: string }>`
  font-size: ${(props) =>
    props.size === "large"
      ? props.theme.fontSizes[6]
      : props.theme.fontSizes[5]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  padding: 5px;
`;

const TimeText = styled.Text<{ size: string }>`
  font-size: ${(props) =>
    props.size === "large"
      ? props.theme.fontSizes[4]
      : props.theme.fontSizes[3]}px;
  font-weight: ${(props) => props.theme.fontWeights[0]};
  padding: 5px;
`;

export { Container, TitleText, DateText, TimeText };
