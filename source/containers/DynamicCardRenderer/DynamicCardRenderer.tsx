import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";

import Card from "../../components/molecules/Card/Card";
import InfoModal from "../../components/molecules/InfoModal";
import { useModal } from "../../components/molecules/Modal";

import TextComponent from "../../components/atoms/Text";
import Icon from "../../components/atoms/Icon";

import { launchPhone, launchEmail } from "../../helpers/LaunchExternalApp";
import MarkdownConstructor from "../../helpers/MarkdownConstructor";

import { replaceText } from "../Form/hooks/textReplacement";
import AuthContext from "../../store/AuthContext";

import ICON from "../../assets/images/icons";

import type { PartnerInfo, User } from "../../types/UserTypes";

interface Image {
  type: "image";
  image: keyof typeof ICON;
  circle?: boolean;
  style?: React.CSSProperties;
}

interface Text {
  type: "text";
  text: string;
  italic?: boolean;
}

interface Title {
  type: "title";
  text: string;
}

interface Subtitle {
  type: "subtitle";
  text: string;
}

interface Props {
  colorSchema?: "blue" | "red" | "green" | "purple" | "neutral";
  backgroundColor?: "blue" | "red" | "green" | "purple" | "neutral";
  shadow?: boolean;
  outlined?: boolean;
  components: CardComponent[];
  completionsClarification?: string;
}

interface ButtonBase {
  type: "button";
  text: string;
  colorSchema?: "blue" | "red" | "green" | "purple";
  icon?: string;
  iconPosition?: "left" | "right";
}

type Button = ButtonBase &
  (
    | { action: "email"; email: string }
    | { action: "phone"; phonenumber: string }
    | { action: "url"; url: string }
    | { action: "navigate"; screen: string }
    | {
        action: "infoModal";
        heading: string;
        markdownText: string;
        closeButtonText: string;
      }
  );

type CardComponent = Image | Text | Title | Subtitle | Button;
type InfoModalButtonProps = ButtonBase & {
  heading: string;
  markdownText: string;
  closeButtonText: string;
};

const InfoModalButton: React.FC<InfoModalButtonProps> = ({
  heading,
  markdownText,
  closeButtonText,
  text,
  colorSchema,
  icon,
  iconPosition,
}) => {
  const [modalVisible, toggleModal] = useModal();
  return (
    <>
      <Card.Button colorSchema={colorSchema} onClick={toggleModal}>
        {icon && iconPosition && iconPosition === "left" && (
          <Icon name={icon} />
        )}
        <TextComponent>{text}</TextComponent>
        {icon && (!iconPosition || iconPosition === "right") && (
          <Icon name={icon} />
        )}
      </Card.Button>
      <InfoModal
        visible={modalVisible}
        toggleModal={toggleModal}
        markdownText={markdownText}
        heading={heading}
        colorSchema={colorSchema}
        buttonText={closeButtonText}
      />
    </>
  );
};

const handleClick =
  (button: CardComponent & { type: "button" }, navigation: unknown) => () => {
    switch (button.action) {
      case "email":
        launchEmail(button.email);
        break;
      case "phone":
        launchPhone(button.phonenumber);
        break;
      case "navigate":
        if (navigation?.navigate) {
          navigation.navigate(button.screen); // TODO think about sending parameters here
        }
        break;
      case "url":
        Linking.openURL(button.url) as Promise<unknown>;
        break;
      default:
        break;
    }
  };

const renderCardComponent = (
  component: CardComponent,
  navigation: unknown,
  index: number,
  user: User,
  partner?: PartnerInfo,
  completionsClarificationMessage?: string
) => {
  switch (component.type) {
    case "text": {
      const replacedText = replaceText(
        component.text,
        user,
        undefined,
        partner,
        undefined,
        completionsClarificationMessage
      );

      return (
        <MarkdownConstructor
          key={`${index}-${component.type}`}
          rawText={replacedText}
          italic={component.italic ?? false}
        />
      );
    }
    case "title":
      return (
        <Card.Title key={`${index}-${component.type}`}>
          {component.text}
        </Card.Title>
      );
    case "subtitle":
      return (
        <Card.SubTitle key={`${index}-${component.type}`}>
          {component.text}
        </Card.SubTitle>
      );
    case "image":
      return (
        <Card.Image
          key={`${index}-${component.type}`}
          source={ICON[component.image]}
          style={component.style}
          circle={component.circle}
        />
      );
    case "button": {
      const { iconPosition: buttonIconPosition = "right" } = component;

      if (component.action === "infoModal") {
        return (
          <InfoModalButton key={`${index}-${component.type}`} {...component} />
        );
      }

      return (
        <Card.Button
          key={`${index}-${component.type}`}
          onClick={handleClick(component, navigation)}
        >
          {component.icon && buttonIconPosition === "left" && (
            <Icon name={component.icon} />
          )}

          <TextComponent>{component.text}</TextComponent>

          {component.icon && buttonIconPosition === "right" && (
            <Icon name={component.icon} />
          )}
        </Card.Button>
      );
    }
    default:
      return null;
  }
};

const DynamicCardRenderer: React.FC<Props> = ({
  colorSchema,
  backgroundColor,
  shadow,
  outlined,
  components,
  completionsClarification,
}) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <Card colorSchema={colorSchema || "neutral"}>
      <Card.Body
        color={backgroundColor || "neutral"}
        shadow={shadow}
        outlined={outlined}
      >
        {components.map((component, index) =>
          renderCardComponent(
            component,
            navigation,
            index,
            user,
            undefined,
            completionsClarification
          )
        )}
      </Card.Body>
    </Card>
  );
};

export default DynamicCardRenderer;
