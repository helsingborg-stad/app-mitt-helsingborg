/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableHighlight } from 'react-native';
import { Icon } from '../../atoms';

const DefaultItem = styled.TouchableHighlight`
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
  filename: string;
  onRemove: () => void;
}

const ImageItem: React.FC<Props> = ({ filename, onRemove }) => (
  <DefaultItem>
    <Flex>
      <IconContainer>
        <ImageIcon source={{ uri: filename }} />
      </IconContainer>
      <Row>
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
};

export default ImageItem;
