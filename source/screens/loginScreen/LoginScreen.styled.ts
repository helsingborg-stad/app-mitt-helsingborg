import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import Heading from "../../components/atoms/Heading";
import Text from "../../components/atoms/Text";

import type { ThemeType } from "../../styles/themeHelpers";

interface DefaultStyledProps {
  theme: ThemeType;
}

const UnifiedPadding = [24, 48];

const SafeAreaViewTop = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.neutrals[6]};
`;

const FlexView = styled.View`
  flex: 1;
`;

const FlexImageBackground = styled.ImageBackground`
  flex: 1;
  justify-content: center;
`;

const Header = styled.View`
  flex: 4;
  padding: ${UnifiedPadding[1]}px ${UnifiedPadding[1]}px 0px
    ${UnifiedPadding[1]}px;
`;

const Form = styled.View`
  padding: 0px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.View<DefaultStyledProps>`
  flex: 1;
  max-height: 130px;
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
  border-top-color: ${({ theme }) => theme.border.default};
  border-top-width: 1px;
  background-color: ${({ theme }) => theme.colors.neutrals[5]};
`;

const Logo = styled.Image`
  width: 35px;
  height: 70px;
  margin-bottom: 24px;
`;

const Title = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  color: ${({ theme }) => theme.colors.primary.red[0]};
  font-weight: ${({ theme }) => theme.fontWeights[1]};
`;

const LoginHeading = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizes[13]}px;
  font-weight: ${({ theme }) => theme.fontWeights[1]};
  line-height: 60px;
  color: ${({ theme }) => theme.colors.neutrals[0]};
`;

const ContentText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[4]}px;
  line-height: 30px;
`;

const Separator = styled.View<DefaultStyledProps>`
  border-radius: 40px;
  height: 2px;
  width: 25px;
  background-color: ${({ theme }) => theme.colors.complementary.red[0]};
  margin-bottom: 16px;
`;

const FooterText = styled(Text)`
  font-style: italic;
  color: ${({ theme }) => theme.colors.neutrals[2]};
  text-align: center;
`;

const Link = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  text-align: center;
  margin-top: 16px;
  font-weight: normal;
`;

const ParagraphLink = styled(Text)`
  font-style: italic;
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.neutrals[1]};
`;

const VersionLabelContainer = styled.View`
  position: relative;
  top: 10px;
  left: 10px;
`;

const VersionLabel = styled(Text)`
  padding: 2px 5px;
  background-color: ${({ theme }) => theme.colors.neutrals[6]};
  align-self: flex-start;
`;

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    color: "black",
    height: 40,
  },
};

export {
  ContentText,
  FlexImageBackground,
  FlexView,
  Footer,
  FooterText,
  Form,
  Header,
  Link,
  LoginHeading,
  Logo,
  ParagraphLink,
  pickerSelectStyles,
  SafeAreaViewTop,
  Separator,
  Title,
  VersionLabel,
  VersionLabelContainer,
};
