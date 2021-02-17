import React from 'react';
import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import { Modal } from 'react-native';
import Button from '../../../atoms/Button';
import Heading from '../../../atoms/Heading';
import Text from '../../../atoms/Text';
import Card from '../../../molecules/Card';
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

const ButtonText = styled(Text)`
  color: ${(props) => props.theme.colors.neutrals[1]};
  font-weight: ${(props) => props.theme.fontWeights[1]};
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

const ButtonDivider = styled.View`
  width: 8px;
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

/** Simple popup dialog asking the user if they really want to exit the form. Partially masks the background. */
const CloseDialog: React.FC<Props> = ({ visible, title, body, buttons }) => (
  <Modal
    visible={visible ?? false}
    transparent
    presentationStyle="overFullScreen"
    animationType="fade"
  >
    <BackgroundBlur>
      <PopupContainer>
        <ContentContainer>
          <Card colorSchema="neutral">
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              {body && body.length > 0 && <Card.Text>{body}</Card.Text>}
            </Card.Body>
          </Card>
          <ButtonRow>
            {buttons.map(({ text, color, clickHandler }) => (
              /* @ts-ignore */
              <Button
                colorSchema={color && color.length > 0 ? color : 'blue'}
                onClick={clickHandler}
              >
                <Text>{text}</Text>
              </Button>
            ))}
          </ButtonRow>
        </ContentContainer>
      </PopupContainer>
    </BackgroundBlur>
const CloseDialog: React.FC<Props> = ({ visible, closeForm, closeDialog }) => (
  <Modal
    visible={visible}
    transparent
    presentationStyle="overFullScreen"
    animationType="fade"
    statusBarTranslucent
  >
    <PopupContainer>
      <Dialog>
        <Content>
          <Title>Vill du avbryta ansökan?</Title>
          <DialogText>
            Ansökan sparas i 3 dagar. Efter det raderas den och du får starta en ny.
          </DialogText>
        </Content>
        <ButtonRow>
          <ButtonWrapper>
            <DialogButton block z={0} colorSchema="neutral" onClick={closeDialog}>
              <ButtonText>Nej</ButtonText>
            </DialogButton>
          </ButtonWrapper>
          <ButtonDivider />
          <ButtonWrapper>
            <DialogButton
              block
              z={0}
              colorSchema="blue"
              onClick={() => {
                closeDialog();
                closeForm();
              }}
            >
              <Text>Ja</Text>
            </DialogButton>
          </ButtonWrapper>
        </ButtonRow>
      </Dialog>
      <BackgroundBlur blurType="dark" blurAmount={15} reducedTransparencyFallbackColor="white" />
    </PopupContainer>
  </Modal>
);

export default CloseDialog;
