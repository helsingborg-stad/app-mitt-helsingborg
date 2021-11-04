import React from "react";
import { Card } from "..";
import { Icon, Text } from "../../atoms";
import { TitleText, AddressText, StyledButton, AddressWrapper } from "./styled";
import { colorPalette } from "../../../styles/palette";

interface DateTimeCardProps {
  addressLines: string[];
  geocode?: string;
}

const DateTimeCard = ({
  addressLines,
  geocode,
}: DateTimeCardProps): JSX.Element => (
  <Card
    underlayColor={colorPalette.neutrals[5]}
    cardColor={colorPalette.neutrals[7]}
  >
    <Card.Body shadow color="neutral">
      <TitleText>ADRESS</TitleText>
      <AddressWrapper>
        {addressLines.map((line) => (
          <AddressText key={`addressLine-${line}`}>{line}</AddressText>
        ))}
      </AddressWrapper>
      {geocode && (
        <StyledButton
          variant="link"
          colorSchema="red"
          fullWidth
          onClick={() => true}
        >
          <Text>Hitta hit</Text>
          <Icon name="room" />
        </StyledButton>
      )}
    </Card.Body>
  </Card>
);

export default DateTimeCard;
