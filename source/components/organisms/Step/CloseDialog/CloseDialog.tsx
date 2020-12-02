import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import Button from '../../../atoms/Button';
import Text from '../../../atoms/Text';
import Card from '../../../molecules/Card';

const BackgroundBlur = styled.View`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0px;
  background-color: rgba(0, 0, 0, 0.25);
`;

const PopupContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: 33%;
  left: 10%;
  right: 10%;
  bottom: 0;
  padding: 0px;
  max-height: 50%;
  width: 80%;
  background-color: white;
  flex-direction: column;
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`;
const ContentContainer = styled.View`
  padding: 10px;
  padding-bottom: 20px;
  flex-direction: column;
  justify-content: space-between;
  flex: 10;
`;
const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  padding: 20px;
  margin-bottom: 10px;
`;

interface Props {
  visible: boolean;
  closeForm: () => void;
  closeDialog: () => void;
}
/** Simple popup dialog asking the user if they really want to exit the form. Partially masks the background. */
const CloseDialog: React.FC<Props> = ({ visible, closeForm, closeDialog }) => (
  <Modal visible={visible} transparent presentationStyle="overFullScreen" animationType="fade">
    <BackgroundBlur>
      <PopupContainer>
        <ContentContainer>
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
        </ContentContainer>
      </PopupContainer>
    </BackgroundBlur>
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
