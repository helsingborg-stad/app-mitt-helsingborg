import React from 'react';
import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import { Modal } from 'react-native';
import Button from '../../../atoms/Button';
import Heading from '../../../atoms/Heading';
import Text from '../../../atoms/Text';
import { PrimaryColor } from '../../../../styles/themeHelpers';

const BackgroundBlur = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const PopupContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.View`
  width: 80%;
  height: auto;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  /* @ts-ignore */
  background: ${(props) => props.theme.colors.neutrals[5]};
  padding: 12px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
`;

const Content = styled.View`
  padding: 12px;
`;

const Title = styled(Heading)`
  color: ${(props) => props.theme.colors.neutrals[1]};
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  margin: 0px;
  text-align: center;
`;

const DialogText = styled(Text)`
  margin: 12px;
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  text-align: center;
`;

const DialogButton = styled(Button)`
  ${({ colorSchema }) => colorSchema === 'neutral' && `background: #e5e5e5; `}
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0px;
`;

const ButtonText = styled(Text)`
  color: ${(props) => props.theme.colors.neutrals[1]};
  font-weight: ${(props) => props.theme.fontWeights[1]};
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;
export interface Props {
  visible?: boolean;
  closeForm?: () => void;
  closeDialog?: () => void;
  title: string;
  body: string;
  buttons: Array<{
    text: string;
    color?: PrimaryColor;
    clickHandler: () => void;
  }>;
}

/** Simple popup dialog asking the user if they really want to exit the form. Partially asks the background. */
const CloseDialog: React.FC<Props> = ({ visible, title, body, buttons }) => (
  <Modal
    visible={visible ?? false}
    transparent
    presentationStyle="overFullScreen"
    animationType="fade"
    statusBarTranslucent
  >
    <PopupContainer>
      <Dialog>
        <Content>
          <Title>{title}</Title>
          {body && body.length > 0 ? <DialogText>{body}</DialogText> : null}
        </Content>
        <ButtonRow>
          {buttons.map(({ text, color, clickHandler }, index) => (
            /* @ts-ignore */
            <ButtonWrapper key={index}>
              <DialogButton
                block
                z={0}
                colorSchema={color && color.length > 0 ? color : 'blue'}
                onClick={clickHandler}
              >
                {color === 'neutral' ? <ButtonText>{text}</ButtonText> : <Text>{text}</Text>}
              </DialogButton>
            </ButtonWrapper>
          ))}
        </ButtonRow>
      </Dialog>
      <BackgroundBlur blurType="dark" blurAmount={15} reducedTransparencyFallbackColor="white" />
    </PopupContainer>
  </Modal>
);

export default CloseDialog;
