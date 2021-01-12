/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { ActivityIndicator, TouchableHighlight } from 'react-native';
import { Icon } from '../../atoms';
import { ImageStatus } from './ImageUploader';

const DefaultItem = styled.TouchableHighlight`
  border-bottom-width: 1px;
  border-color: #c3c3c3;
  background-color: white;
  margin-bottom: 20px;
  border-radius: 8px;
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

const IconContainer = styled.View`
  border-top-left-radius: 12.5px;
  border-bottom-left-radius: 12.5px;
  padding: 5px;
`;
const ImageIcon = styled.Image`
  width: 126px;
  height: 178px;
`;
const UploadIconContainer = styled.View`
  padding-left: 12px;
  padding-right: 12px;
`;

interface Props {
  filename: string;
  onRemove: () => void;
  status: ImageStatus;
}

const ImageItem: React.FC<Props> = ({ filename, onRemove, status }) => (
  <DefaultItem>
    <Flex>
      <IconContainer>
        <ImageIcon source={{ uri: filename }} />
      </IconContainer>
      {/* <Content>
        <Text small>{fileName}</Text>
      </Content> */}
      <Row>
        <UploadIconContainer>
          {status === 'uploaded' ? (
            <Icon name="cloud-upload" color="green" />
          ) : status === 'loading' ? (
            <ActivityIndicator size="large" color="slategray" />
          ) : (
            <Icon name="error" color="red" />
          )}
        </UploadIconContainer>
        <TouchableHighlight onPress={onRemove}>
          <Icon name="delete" color="#00213F" />
        </TouchableHighlight>
      </Row>
    </Flex>
  </DefaultItem>
);
ImageItem.propTypes = {
  filename: PropTypes.string,
  onRemove: PropTypes.func,
  status: PropTypes.string,
};

export default ImageItem;
