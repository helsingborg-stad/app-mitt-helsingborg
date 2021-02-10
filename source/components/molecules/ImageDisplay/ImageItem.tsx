/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import ImageZoom from 'react-native-image-pan-zoom';
import { TouchableOpacity, Dimensions, Image as RNImage } from 'react-native';
import { Icon, Button, Text } from '../../atoms';
import { Modal, useModal } from '../Modal';
import { Image } from './ImageDisplay';

const DefaultItem = styled.TouchableOpacity`
  background-color: white;
  margin-bottom: 20px;
`;
const Flex = styled.View`
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
`;
const Row = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0;
  margin: 0;
`;
const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 10px;
`;
const IconContainer = styled.View`
  border-top-left-radius: 12.5px;
  border-bottom-left-radius: 12.5px;
  padding: 0px;
  margin-left: 8px;
  margin-right: 8px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
`;
const ImageIcon = styled.Image`
  width: 126px;
  height: 178px;
`;

interface Props {
  image: Image;
  onRemove: () => void;
}

const ImageItem: React.FC<Props> = ({ image, onRemove }) => {
  const [modalVisible, toggleModal] = useModal();

  return (
    <>
      <DefaultItem onPress={toggleModal} activeOpacity={0.1}>
        <Flex>
          <IconContainer>
            <ImageIcon source={{ uri: image.path }} />
          </IconContainer>
          <Row>
            <TouchableOpacity onPress={onRemove} activeOpacity={0.4}>
              <Icon name="delete" color="#00213F" />
            </TouchableOpacity>
          </Row>
        </Flex>
      </DefaultItem>
      <Modal visible={modalVisible} hide={toggleModal}>
        {image && image?.path && (
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height * 0.9}
            imageWidth={image.width}
            imageHeight={image.height}
            panToMove
            enableCenterFocus={false}
            centerOn={{
              x: 0,
              y: 0,
              scale: Dimensions.get('window').width / image.width,
              duration: 10,
            }}
          >
            <RNImage
              style={{ width: image.width, height: image.height }}
              source={{ uri: image.path }}
            />
          </ImageZoom>
        )}
        <ButtonWrapper>
          <Button colorSchema="red" onClick={toggleModal}>
            <Text>Stäng</Text>
          </Button>
        </ButtonWrapper>
      </Modal>
    </>
  );
};

ImageItem.propTypes = {
  image: PropTypes.object,
  onRemove: PropTypes.func,
};

export default ImageItem;
