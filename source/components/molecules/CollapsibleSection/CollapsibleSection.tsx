import React, { useContext } from "react";
import { Platform } from "react-native";
import Collapsible from "react-native-collapsible";
import { ThemeContext } from "styled-components/native";

import Icon from "../../atoms/Icon";
import Text from "../../atoms/Text";

import { Section, TitleBar } from "./styled";

const ICON = {
  android: {
    COLLAPSED: "unfold-less",
    NOT_COLLAPSED: "unfold-more",
  },
  ios: {
    COLLAPSED: "expand-less",
    NOT_COLLAPSED: "expand-more",
  },
};

interface CollapsibleSectionProps {
  title: string;
  collapsed: boolean;
  children: React.ReactChild | React.ReactChildren;
  onPress: () => void;
}
const CollapsibleSection = (props: CollapsibleSectionProps): JSX.Element => {
  const { title, collapsed, children, onPress } = props;
  const theme = useContext(ThemeContext);

  const underlayColor = theme.colors.neutrals[5];
  const sectionColor = theme.colors.neutrals[6];

  const iconName = collapsed
    ? ICON[Platform.OS].COLLAPSED
    : ICON[Platform.OS].NOT_COLLAPSED;

  return (
    <Section color={sectionColor}>
      <TitleBar onPress={onPress} underlayColor={underlayColor}>
        <>
          <Text type="h5">{title}</Text>
          <Icon name={iconName} />
        </>
      </TitleBar>
      <Collapsible collapsed={collapsed}>{children}</Collapsible>
    </Section>
  );
};

export default CollapsibleSection;
