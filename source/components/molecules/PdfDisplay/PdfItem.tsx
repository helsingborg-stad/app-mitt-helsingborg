import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, GestureResponderEvent, Dimensions, Pressable } from 'react-native';
import PdfView from 'react-native-pdf';
import { Icon, Button, Text } from '../../atoms';
import { Modal, useModal } from '../Modal';
import { Pdf } from './PdfDisplay';

const Flex = styled.View`
  flex-direction: column;
  align-items: center;
  padding: 0;
  padding-top: 10px;
  padding-right: 20px;
  margin: 0;
  margin-bottom: 12px;
`;

const DeleteBackground = styled.View`
  position: absolute;
  top: 2px;
  right: 7px;
  padding: 4px;
  elevation: 3;
  background: #eeeeee;
  z-index: 1;
  border-radius: 20px;
`;

const Container = styled.View`
  margin: 2px
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  margin: 2px
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.4;
  shadow-radius: 5px;
  border: 1px solid transparent;
`;
const PdfInModal = styled(PdfView)<{width: number; height: number}>`
  background-color: white;
  flex: 1;
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
`;
const ButtonWrapper = styled.View`
  padding: 5px;
  flex-direction: row;
  justify-content: center;
`;

interface Props {
  pdf: Pdf;
  onRemove: () => void;
}

const PdfItem: React.FC<Props> = ({ pdf, onRemove }) => {
  const [modalVisible, toggleModal] = useModal();

  const handleRemove = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <>
      <Flex>
        <DeleteBackground>
          <TouchableOpacity onPress={handleRemove} activeOpacity={0.1}>
            <Icon name="clear" color="#00213F" />
          </TouchableOpacity>
        </DeleteBackground>
        <Container>
          <Pressable onPress={toggleModal}>
            <PdfView
              source={{ uri: pdf.uri }}
              style={{ flex: 1, width: 120, height: 170, backgroundColor: 'white' }}
              singlePage
            />
          </Pressable>
        </Container>
      </Flex>
      <Modal visible={modalVisible} hide={toggleModal}>
        <PdfInModal
          source={{ uri: pdf.uri }}
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').height * 0.89}
        />
        <ButtonWrapper>
          <Button colorSchema="red" onClick={toggleModal}>
            <Text>Stäng</Text>
          </Button>
        </ButtonWrapper>
      </Modal>
    </>
  );
};

export default PdfItem;
