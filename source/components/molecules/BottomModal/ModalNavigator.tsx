import React from "react";
import { TouchableOpacity } from "react-native";

import Icon from "../../atoms/Icon";

import { NavigatorContainer, IconContainer, ModalText } from "./styled";

interface ModalNavigatorProps {
  color: string;
  textColor: string;
  title: string | undefined;
  backButtonText: string | undefined;
  onBack: () => void | undefined;
  onClose: () => void | undefined;
}
const ModalNavigator = (props: ModalNavigatorProps): JSX.Element => {
  const { color, textColor, title, backButtonText, onBack, onClose } = props;

  return (
    <NavigatorContainer background={color}>
      <IconContainer flexDirection="flex-start">
        <TouchableOpacity onPress={onBack} disabled={!onBack}>
          {onBack && backButtonText && (
            <ModalText size={12} color={textColor}>
              {backButtonText}
            </ModalText>
          )}

          {onBack && !backButtonText && (
            <Icon
              testID="modal-navigator-back-button"
              name="arrow-back"
              size={24}
              color={textColor}
            />
          )}
        </TouchableOpacity>
      </IconContainer>
      <ModalText size={18} color={textColor}>
        {title}
      </ModalText>
      <IconContainer flexDirection="flex-end">
        <TouchableOpacity disabled={!onClose} onPress={onClose}>
          {onClose && (
            <Icon
              testID="modal-navigator-close-button"
              name="close"
              size={24}
              color={textColor}
            />
          )}
        </TouchableOpacity>
      </IconContainer>
    </NavigatorContainer>
  );
};

export default ModalNavigator;
