/* eslint-disable import/no-unused-modules */
import React from "react";
import Card from "../Card";
import ICON from "../../../assets/images/icons";
import MarkdownConstructor from "../../../helpers/MarkdownConstructor";

interface ContactCardProps {
  name: string;
  description: string;
}

export default function ContactCard({
  name,
  description,
}: ContactCardProps): JSX.Element {
  return (
    <Card key={name} colorSchema="red">
      <Card.Body shadow color="neutral">
        <Card.Section>
          <Card.Image
            style={{ width: 50, height: 50 }}
            circle
            source={ICON.ICON_CONTACT_PERSON}
          />
          <Card.Title colorSchema="neutral">{name}</Card.Title>
          <MarkdownConstructor italic={false} rawText={description} />
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
