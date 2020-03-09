import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import FormAgent from '../organisms/FormAgent/FormAgent';
import Button from '../atoms/Button/Button';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import ChatBubble from '../atoms/ChatBubble';

const ButtonStackWrapper = styled.View``;

const ModifiedButton = styled(Button)`
  justify-content: flex-start;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 6px;
  margin-bottom: 6px;
`;

const ButtonStack = props => {
  const {
    items,
    chat,
    navigation: { navigate },
  } = props;

  /**
   * Adds different on click actions
   * @param {object} params
   *
   * TODO: Get click action from props
   */
  const onClick = params => {
    const { content, action } = params;
    const { type: actionType, value: actionValue, callback: actionCallback } = action;

    // Do custom actions
    if (actionType && actionValue) {
      switch (actionType) {
        case 'form':
          // Trigger form service
          chat.switchAgent(props => (
            <FormAgent
              {...props}
              formId={actionValue}
              callback={actionCallback ? props => actionCallback(props) : undefined}
            />
          ));
          break;
        case 'navigate':
          // Navigate to given route
          navigate(actionValue);
          return;
        default:
          return;
      }
    }

    const message = [
      {
        Component: ChatBubble,
        componentProps: {
          content,
          modifiers: ['user'],
        },
      },
    ];

    // Add message
    chat.addMessages(message);
  };

  const renderItem = (item, index) => {
    const { icon, value } = item;
    let { action } = item;
    action = typeof action === 'object' && action !== null ? action : {};

    const buttonProps = {
      label: value,
      // eslint-disable-next-line no-nested-ternary
      iconColor: icon === 'check' ? '#50811B' : icon === 'close' ? '#AE0B05' : undefined,
      icon: icon || 'message',
      clickAction: () => onClick({ content: value, action }),
    };

    return <ActionButton {...buttonProps} key={`${item}-${index}`} />;
  };

  return <ButtonStackWrapper>{items.map(renderItem)}</ButtonStackWrapper>;
};

const ActionButton = props => {
  const { clickAction, iconColor, icon, label } = props;

  return (
    <ModifiedButton onClick={clickAction} color="light" rounded block>
      <Icon color={iconColor} name={icon} />
      <Text>{label}</Text>
    </ModifiedButton>
  );
};

ButtonStack.propTypes = {
  items: PropTypes.array.isRequired,
  chat: PropTypes.object.isRequired,
  navigation: PropTypes.shape({ navigate: PropTypes.func }),
};

ActionButton.propTypes = {
  iconColor: PropTypes.string,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  clickAction: PropTypes.func,
};

export default withNavigation(ButtonStack);
