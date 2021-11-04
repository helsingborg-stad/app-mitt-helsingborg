import React, { useContext } from "react";
import { ImageSourcePropType, Linking } from "react-native";
import { ThemeContext } from "styled-components/native";
import { Icon, Text } from "../../atoms";
import Checkbox from "../../atoms/Checkbox";
import { colorPalette } from "../../../styles/palette";

import {
  Card,
  Section,
  Image,
  CardTitle,
  CardSubtitle,
  DetailButton,
} from "./styled";

interface CharacterCardProps {
  icon: ImageSourcePropType;
  title: string;
  department: string;
  jobTitle: string;
  selected: boolean;
  email?: string;
  phone?: string;
  showCheckbox?: boolean;
  onCardClick: () => void;
}

const CharacterCard = (props: CharacterCardProps): JSX.Element => {
  const {
    icon,
    selected = false,
    title,
    department,
    jobTitle,
    email,
    phone,
    showCheckbox = true,
    onCardClick,
  } = props;
  const theme = useContext(ThemeContext);

  const cardColorSchema = selected ? "red" : "neutral";
  const cardColor = selected
    ? theme.colors.complementary[cardColorSchema][3]
    : theme.colors.neutrals[7];
  const outlineColor = selected ? theme.colors.primary.red[4] : "transparent";

  const linkTo = (linkURL: string) => {
    Linking.canOpenURL(linkURL).then((success) => {
      if (success) {
        Linking.openURL(linkURL);
      }
    });
  };

  return (
    <Card
      testID="characterCard"
      onPress={onCardClick}
      underlayColor={colorPalette.neutrals[5]}
      outlineColor={outlineColor}
      cardColor={cardColor}
    >
      <Section flex={1} flexDirection="column">
        <Section flexDirection="row">
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
          {showCheckbox && (
            <Section flex={0.5} justify="flex-end">
              <Checkbox
                invertColors
                colorSchema="red"
                checked={selected}
                disabled
                onChange={undefined}
              />
            </Section>
          )}
        </Section>
        {(email || phone) && (
          <Section flexDirection="column" justify="flex-start">
            {phone && (
              <DetailButton
                colorSchema="neutral"
                fullWidth
                variant="link"
                onClick={() => linkTo(`tel:${phone}`)}
              >
                <Icon name="phone" />
                <Text type="h6">{phone}</Text>
              </DetailButton>
            )}
            {email && (
              <DetailButton
                colorSchema="neutral"
                fullWidth
                variant="link"
                onClick={() => linkTo(`mailto:${email}`)}
              >
                <Icon name="alternate-email" />
                <Text type="h6">{email}</Text>
              </DetailButton>
            )}
            <DetailButton
              colorSchema="neutral"
              fullWidth
              variant="link"
              onClick={() => linkTo("https://helsingborg.se/")}
            >
              <Icon name="chat-bubble-outline" />
              <Text type="h6">Chatta med oss</Text>
            </DetailButton>
          </Section>
        )}
      </Section>
    </Card>
  );
};
export default CharacterCard;
