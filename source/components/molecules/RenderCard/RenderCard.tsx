/* eslint-disable default-case */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Card from '../Card/Card';
import PropTypes from 'prop-types';
import TextComponent from '../../atoms/Text';
import Icon from '../../atoms/Icon';
import icons from '../../../helpers/Icons';
import { launchPhone, launchEmail } from '../../../helpers/LaunchExternalApp';

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

interface Button {
  type: 'button';
  text: string;
  colorSchema?: 'blue' | 'red' | 'green' | 'purple';
  icon?: string;
  iconPosition?: 'left' | 'right';
  action:
    | {
        type: 'email';
        email: string;
      }
    | {
        type: 'phone';
        phonenumber: string;
      }
    | {
        type: 'navigate';
        screen: string;
      }
    | {
        type: 'help';
        help: {
          text: string;
          tagline?: string;
          url?: string;
          title?: string;
        };
      };
}

type CardComponent = Image | Text | Title | Subtitle | Button;
/***** end of types */

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

  if (component.type === 'button') {
    const { icon, iconPosition, text, action } = component;
    let onClick: () => void = () => null;
    switch (action.type) {
      case 'email':
        onClick = () => { launchEmail(action.email)};
        break;
      case 'phone':
        onClick = () => { launchPhone(action.phonenumber)};
        break;
      case 'navigate':
        onClick = () => { if (navigation?.navigate) navigation.navigate(action.screen) }; // TODO think about sending parameters here
        break;
      case 'help':
        onClick = () => { console.log('open help...')}; // TODO: fix this more properly.
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
const RenderCard: React.FC<Props> = ({
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

RenderCard.propTypes = {
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

export default RenderCard;
