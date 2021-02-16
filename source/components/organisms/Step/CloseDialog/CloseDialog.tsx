import React from 'react';
import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import Button from '../../../atoms/Button';
import Text from '../../../atoms/Text';
import Card from '../../../molecules/Card';

const BackgroundBlur = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;
const PopupContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: 33%;
  left: 10%;
  right: 10%;
  width: 80%;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.neutrals[7]};
  padding: 10px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  padding: 15px;
  margin-bottom: 0px;
`;

interface Props {
  visible: boolean;
  closeForm: () => void;
  closeDialog: () => void;
}
/** Simple popup dialog asking the user if they really want to exit the form. Partially masks the background. */
const CloseDialog: React.FC<Props> = ({ visible, closeForm, closeDialog }) => (
  <Modal
    visible={visible}
    transparent
    presentationStyle="overFullScreen"
    animationType="fade"
    statusBarTranslucent
  >
    <PopupContainer>
      <Card colorSchema="neutral">
        <Card.Body>
          <Card.Title>Vill du avbryta ansökan?</Card.Title>
          <Card.Text>
            Ansökan sparas i 3 dagar. Efter det raderas den och du får starta en ny.
          </Card.Text>
        </Card.Body>
      </Card>
      <ButtonRow>
        <Button colorSchema="red" onClick={closeDialog}>
          <Text>Nej</Text>
        </Button>
        <Button
          small
          onClick={() => {
            closeDialog();
            closeForm();
          }}
        >
          <Text>Ja</Text>
        </Button>
      </ButtonRow>
    </PopupContainer>
    <BackgroundBlur blurType="light" blurAmount={15} reducedTransparencyFallbackColor="white" />
  </Modal>
);

CloseDialog.propTypes = {
  /** whether to show the dialog or not */
  visible: PropTypes.bool,
  /** callback to navigate out of the form */
  closeForm: PropTypes.func,
  /** callback to close the dialog */
  closeDialog: PropTypes.func,
};

export default CloseDialog;
