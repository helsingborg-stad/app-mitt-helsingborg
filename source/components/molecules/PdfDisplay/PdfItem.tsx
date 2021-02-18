/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Icon, Text } from '../../atoms';
import { Pdf } from './PdfDisplay';

const DefaultItem = styled.TouchableOpacity`
  margin-bottom: 20px;
`;
const Flex = styled.View`
  flex-direction: column;
  align-items: center;
  padding: 0;
  padding-top: 10px;
  padding-right: 20px;
  margin: 0;
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

const IconContainer = styled.View`
  margin: 2px
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.4;
  shadow-radius: 5px;
  border: 1px solid transparent;
  elevation: 1;
`;

interface Props {
  pdf: Pdf;
  onRemove: () => void;
}

const PdfItem: React.FC<Props> = ({ pdf, onRemove }) => {
  const handleRemove = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <>
      <DefaultItem onPress={toggleModal} activeOpacity={0.1}>
        <Flex>
          <DeleteBackground>
            <TouchableOpacity onPress={handleRemove} activeOpacity={0.1}>
              <Icon name="clear" color="#00213F" />
            </TouchableOpacity>
          </DeleteBackground>
          <IconContainer>
            <Text>{pdf.name}</Text>
          </IconContainer>
        </Flex>
      </DefaultItem>
    </>
  );
};

PdfItem.propTypes = {
  pdf: PropTypes.object,
  onRemove: PropTypes.func,
};

export default PdfItem;
