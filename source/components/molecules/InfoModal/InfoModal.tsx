import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, Dimensions } from 'react-native';
import { PrimaryColor, getValidColorSchema } from '../../../styles/themeHelpers';
import { Modal } from '../Modal';
import { Button, Text, Heading } from '../../atoms';
import MarkdownConstructor from '../../../helpers/MarkdownConstructor';

const UnifiedPadding = [12, 24]; // Vertical padding, Horizontal padding

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
const PopupContainer = styled.View<{ height: number }>`
  position: absolute;
  z-index: 1000;
  top: 15%;
  left: 10%;
  right: 10%;
  height: ${(props) => props.height}px;
  padding: 0px;
  width: 80%;
  background-color: white;
  flex-direction: column;
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`;
const Wrapper = styled.View`
  max-height: 100%;
`;
const Header = styled.View`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
  border-bottom-color: ${(props) => props.theme.colors.complementary.neutral[1]};
  border-bottom-width: 1px;
  margin: 10px;
  margin-bottom: 0px;
  justify-content: center;
  flex-direction: row;
`;
const Form = styled.ScrollView`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
  max-height: 90%;
  min-height: 30%;
  border-bottom-color: ${(props) => props.theme.colors.complementary.neutral[1]};
  border-bottom-width: 1px;
  margin: 10px;
  margin-top: 0px;
`;

const Footer = styled.View`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
`;

interface Node {
  content: string;
  key: string;
}

const markdownRules = {
  text: (node: Node) => (
    <Text style={{ fontSize: 16 }} key={node.key}>
      {node.content}
    </Text>
  ),
  bullet_list: (node: Node, children, parent, styles) => (
    <View key={node.key} style={[styles.list, styles.listUnordered]}>
      {children}
    </View>
  ),
};

interface Props {
  visible: boolean;
  toggleModal: () => void;
  heading?: string;
  markdownText: string;
  buttonText?: string;
  colorSchema?: PrimaryColor;
}

const InfoModal: React.FC<Props> = ({
  visible,
  toggleModal,
  heading,
  markdownText,
  buttonText,
  colorSchema,
  ...other
}) => {
  const validColorSchema = getValidColorSchema(colorSchema);
  const windowHeight = Dimensions.get('window').height;
  const [height, setHeight] = useState(800);

  return (
    <Modal
      visible={visible}
      hide={toggleModal}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
      {...other}
    >
      <BackgroundBlur>
        <PopupContainer height={Math.min(0.7 * windowHeight, height)}>
          <Wrapper
            onLayout={(layoutEvent) => {
              setHeight(layoutEvent.nativeEvent.layout.height);
            }}
          >
            {heading && (
              <Header>
                <Heading>{heading}</Heading>
              </Header>
            )}
            <Form>
              <MarkdownConstructor rules={markdownRules} rawText={markdownText} />
            </Form>
            <Footer>
              <Button z={0} block onClick={toggleModal} colorSchema={validColorSchema}>
                <Text>{buttonText || 'Stäng'}</Text>
              </Button>
            </Footer>
          </Wrapper>
        </PopupContainer>
      </BackgroundBlur>
    </Modal>
  );
};

InfoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  heading: PropTypes.string,
  markdownText: PropTypes.string,
  buttonText: PropTypes.string,
  colorSchema: PropTypes.oneOf(['green', 'blue', 'red', 'neutral', 'purple']),
};

export default InfoModal;
