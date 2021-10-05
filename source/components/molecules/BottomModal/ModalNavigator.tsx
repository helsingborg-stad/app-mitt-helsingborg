import React from "react";
import { TouchableOpacity } from "react-native";

import Icon from "../../atoms/Icon";

import { NavigatorContainer, IconContainer, ModalText } from "./styled";

const SIZE = {
  ICON: 24,
  BACK_BUTTON: 12,
  TITLE: 18,
};

const ICON_NAME = {
  ARROW_BACK: "arrow-back",
  CLOSE: "close",
};

const FLEX_DIRECTION = {
  END: "flex-end",
  START: "flex-start",
};

interface ModalNavigatorProps {
  color: string;
  textColor: string;
  title?: string;
  backButtonText?: string;
  onBack?: () => void;
  onClose?: () => void;
}
const ModalNavigator = (props: ModalNavigatorProps): JSX.Element => {
  const { color, textColor, title, backButtonText, onBack, onClose } = props;

  return (
    <NavigatorContainer background={color}>
      <IconContainer flexDirection={FLEX_DIRECTION.START}>
        <TouchableOpacity onPress={onBack} disabled={!onBack}>
          {onBack && backButtonText && (
            <ModalText size={SIZE.BACK_BUTTON} color={textColor}>
              {backButtonText}
            </ModalText>
          )}

          {onBack && !backButtonText && (
            <Icon
              testID="modal-navigator-back-button"
              name={ICON_NAME.ARROW_BACK}
              size={SIZE.ICON}
              color={textColor}
            />
          )}
        </TouchableOpacity>
      </IconContainer>
      <ModalText size={SIZE.TITLE} color={textColor}>
        {title}
      </ModalText>
      <IconContainer flexDirection={FLEX_DIRECTION.END}>
        <TouchableOpacity disabled={!onClose} onPress={onClose}>
          {onClose && (
            <Icon
              testID="modal-navigator-close-button"
              name={ICON_NAME.CLOSE}
              size={SIZE.ICON}
              color={textColor}
            />
          )}
        </TouchableOpacity>
      </IconContainer>
    </NavigatorContainer>
  );
};

ModalNavigator.defaultProps = {
  title: undefined,
  backButtonText: undefined,
  onClose: undefined,
  onBack: undefined,
};

export default ModalNavigator;
