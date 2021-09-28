import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";
import Checkbox from "../../atoms/Checkbox";
import { colorPalette } from "../../../styles/palette";

import { Card, Section, Image, CardTitle, CardSubtitle } from "./styled";

interface CharacterCardProps {
  icon: any;
  title: string;
  department: string;
  jobTitle: string;
  selected: boolean;
  onCardClick: () => void;
}
const CharacterCard = (props: CharacterCardProps): JSX.Element => {
  const {
    icon,
    selected = false,
    title,
    department,
    jobTitle,
    onCardClick,
  } = props;
  const theme = useContext(ThemeContext);

  const cardColorSchema = selected ? "red" : "neutral";
  const cardColor = selected
    ? theme.colors.complementary[cardColorSchema][3]
    : theme.colors.neutrals[7];
  const outlineColor = selected ? theme.colors.primary.red[4] : "transparent";

  return (
    <Card
      testID="characterCard"
      onPress={onCardClick}
      underlayColor={colorPalette.neutrals[5]}
      outlineColor={outlineColor}
      cardColor={cardColor}
    >
      <>
        <Section flex={1} flexDirection="column">
          <Image source={icon} />
        </Section>

        <Section
          marginLeft
          flex={4}
          justify="flex-start"
          flexDirection="column"
        >
          <CardTitle type="h5">{title}</CardTitle>
          <CardSubtitle colorSchema="neutral">{department}</CardSubtitle>
          <CardSubtitle colorSchema="red">{jobTitle}</CardSubtitle>
        </Section>

        <Section flex={0.5} justify="flex-end">
          <Checkbox
            invertColors
            colorSchema="red"
            checked={selected}
            disabled
            onChange={undefined}
          />
        </Section>
      </>
    </Card>
  );
};
export default CharacterCard;
