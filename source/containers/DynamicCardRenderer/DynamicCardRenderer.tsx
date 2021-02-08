/* eslint-disable default-case */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import Card from '../../components/molecules/Card/Card';
import PropTypes, { string } from 'prop-types';
import TextComponent from '../../components/atoms/Text';
import Icon from '../../components/atoms/Icon';
import icons from '../../helpers/Icons';
import { launchPhone, launchEmail } from '../../helpers/LaunchExternalApp';
import InfoModal from '../../components/molecules/InfoModal';
import { useModal } from '../../components/molecules/Modal';
/***** types describing how we should send in the data to render our cards  */
interface Image {
  type: 'image';
  image: keyof typeof icons;
  circle?: boolean;
  style?: React.CSSProperties;
}

interface Text {
  type: 'text';
  text: string;
  italic?: boolean;
}

interface Title {
  type: 'title';
  text: string;
}

interface Subtitle {
  type: 'subtitle';
  text: string;
}

interface ButtonBase {
  type: 'button';
  text: string;
  colorSchema?: 'blue' | 'red' | 'green' | 'purple';
  icon?: string;
  iconPosition?: 'left' | 'right';
}
type Button = ButtonBase & (
  { action: 'email'; email: string } |
  { action: 'phone'; phonenumber: string } |
  { action: 'url'; url: string } |
  { action: 'navigate'; screen: string } |
  { action: 'infoModal'; heading: string; markdownText: string; closeButtonText: string; }
);

type CardComponent = Image | Text | Title | Subtitle | Button;
type InfoModalButtonProps = ButtonBase & { action: 'infoModal'; heading: string; markdownText: string; closeButtonText: string; };
/***** end of types */

/** The info-button gets its own component, because it involves the useModal hook */
const InfoModalButton: React.FC<InfoModalButtonProps> = ({ heading, markdownText, closeButtonText, text, colorSchema, icon, iconPosition }) => {
  const [modalVisible, toggleModal] = useModal();
  return (
    <>
      <Card.Button onClick={toggleModal}>
        {icon && iconPosition && iconPosition === 'left' && <Icon name={icon} />}
        <TextComponent>{text}</TextComponent>
        {icon && (!iconPosition || iconPosition === 'right') && <Icon name={icon} />}
      </Card.Button>
      <InfoModal visible={modalVisible} toggleModal={toggleModal} markdownText={markdownText} heading={heading} colorSchema={colorSchema} buttonText={closeButtonText} />
    </>);
}

/** Handles the button clicks for action types email, phone, navigate and url */
const handleClick = (button: CardComponent & { type: 'button' }, navigation: any) => () => {
  switch (button.action) {
    case 'email':
      launchEmail(button.email)
      break;
    case 'phone':
      launchPhone(button.phonenumber)
      break;
    case 'navigate':
      if (navigation?.navigate) navigation.navigate(button.screen) // TODO think about sending parameters here
      break;
    case 'url':
      Linking.openURL(button.url);
      break;
  }
}

/** Maps an object to a Card child component */
const renderCardComponent = (component: CardComponent, navigation: any, index: any) => {
  switch (component.type) {
    case 'text':
      return <Card.Text key={`${index}-${component.type}`} italic={component.italic}>{component.text}</Card.Text>;
    case 'title':
      return <Card.Title key={`${index}-${component.type}`}>{component.text}</Card.Title>;
    case 'subtitle':
      return <Card.SubTitle key={`${index}-${component.type}`}>{component.text}</Card.SubTitle>;
    case 'image':
      return (
        <Card.Image
          key={`${index}-${component.type}`}
          source={icons[component.image]}
          style={component.style}
          circle={component.circle}
        />
      );
  }

  // Treat buttons separately, because they have some more complicated behavior
  if (component.type === 'button') {
    const { icon, iconPosition, text } = component;
    let onClick: () => void = () => null;

    // treat info-modal separately since it doesn't fit the same pattern as the other buttons.
    if (component.action === 'infoModal') {
      return <InfoModalButton key={`${index}-${component.type}`} {...component} />
    }

    return (
      <Card.Button key={`${index}-${component.type}`} onClick={handleClick(component, navigation)}>
        {icon && iconPosition && iconPosition === 'left' && <Icon name={icon} />}
        <TextComponent>{text}</TextComponent>
        {icon && (!iconPosition || iconPosition === 'right') && <Icon name={icon} />}
      </Card.Button>
    );
  }
};

interface Props {
  colorSchema?: 'blue' | 'red' | 'green' | 'purple' | 'neutral';
  backgroundColor?: 'blue' | 'red' | 'green' | 'purple' | 'neutral';
  shadow?: boolean;
  outlined?: boolean;
  components: CardComponent[];
}

/** Dynamically renders a card with the sent in children as an array of json objects. */
const DynamicCardRenderer: React.FC<Props> = ({
  colorSchema,
  backgroundColor,
  shadow,
  outlined,
  components,
}) => {
  let navigation: any = {};
  try {
    navigation = useNavigation();
  } catch (error) {
    console.log(error);
  }
  return (
    <Card colorSchema={colorSchema || 'neutral'}>
      <Card.Body color={backgroundColor || 'neutral'} shadow={shadow} outlined={outlined}>
        {components.map((component, index) => renderCardComponent(component, navigation, index))}
      </Card.Body>
    </Card>
  );
}

DynamicCardRenderer.propTypes = {
  /** Color schema for all child components */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'green', 'purple', 'neutral']),
  /** Card background color */
  backgroundColor: PropTypes.oneOf(['blue', 'red', 'green', 'purple', 'neutral']),
  /** Whether or not to have shadows, giving the card an elevated look */
  shadow: PropTypes.bool,
  /** Whether or not to have a solid outline around the card */
  outlined: PropTypes.bool,
  /** The child components in the card, as an array of objects */
  components: PropTypes.array,
}

export default DynamicCardRenderer;
