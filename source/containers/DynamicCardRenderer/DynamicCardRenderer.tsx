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
type InfoButtonProps =  ButtonBase & { action: 'infoModal'; heading: string; markdownText: string; closeButtonText: string; };
/***** end of types */

/** The info-button gets its own component, because it involves the useModal hook */
const InfoButton: React.FC<InfoButtonProps> = ({ heading, markdownText, closeButtonText, text, colorSchema, icon, iconPosition}) => {
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

/** Maps an object to a Card child component */
const renderCardComponent = (component: CardComponent, navigation: any) => {
  switch (component.type) {
    case 'text':
      return <Card.Text italic={component.italic}>{component.text}</Card.Text>;
    case 'title':
      return <Card.Title>{component.text}</Card.Title>;
    case 'subtitle':
      return <Card.SubTitle>{component.text}</Card.SubTitle>;
    case 'image':
      return (
        <Card.Image
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
      return <InfoButton {...component} />
    }

    switch (component.action) {
      case 'email':
        onClick = () => { launchEmail(component.email)};
        break;
      case 'phone':
        onClick = () => { launchPhone(component.phonenumber)};
        break;
      case 'navigate':
        onClick = () => { if (navigation?.navigate) navigation.navigate(component.screen) }; // TODO think about sending parameters here
        break;
      case 'url':
        onClick = () => { Linking.openURL(component.url)};
        break;
    }
    return (
      <Card.Button onClick={onClick}>
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
        {components.map(component => renderCardComponent(component, navigation))}
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
