import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, TouchableOpacity, View } from 'react-native';
import RnModal from 'react-native-modal';
import styled, { withTheme } from 'styled-components/native';
import Heading from '../../atoms/Heading';

const ModalContainer = styled(RnModal)`
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
  margin-top: 32px;
  border-top-left-radius: 17.5px;
  border-top-right-radius: 17.5px;
`;

const Header = styled.View`
  flex-direction: row;
  border: 1px solid ${props => props.theme.background.lighter};
  border-bottom-width: 2px;
  border-top-left-radius: 17.5px;
  border-top-right-radius: 17.5px;
  background-color: white;
  padding: 16px 16px 12px 16px;
`;

const Flex = styled.View`
  flex: 1;
`;

const FlexInner = styled.View`
  flex: 3;
`;

const FlexOuter = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const Title = styled(Heading)`
  text-align: center;
  color: ${props => props.theme.heading[props.color][1]};
`;

const Content = styled.ScrollView`
  background-color: ${props => props.theme.background.lightest};
`;

const ModalView = styled(View)`
  padding: 32px 16px 32px 16px;
`;

const Modal = ({ visible, heading, changeModal, color, children }) => (
  <ModalContainer
    animationInTiming={400}
    animationOutTiming={400}
    backdropOpacity={0}
    propagateSwipe
    swipeDirection="down"
    isVisible={visible}
    onSwipeComplete={() => {
      changeModal(false);
    }}
  >
    <Flex>
      <Header>
        <FlexOuter></FlexOuter>
        <FlexInner>
          <Title type="h4" color={color}>
            {heading}
          </Title>
        </FlexInner>
        <FlexOuter>
          <TouchableHighlight
            hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
            onPress={() => {
              changeModal(!visible);
            }}
            underlayColor="white"
          >
            {/* <Text>Klar</Text> */}
          </TouchableHighlight>
        </FlexOuter>
      </Header>
      <Content>
        {/* TouchableOpacity = Hack to make scrolling work inside swipeable modal */}
        <TouchableOpacity activeOpacity={1}>
          <ModalView>{children}</ModalView>
        </TouchableOpacity>
      </Content>
    </Flex>
  </ModalContainer>
);

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  heading: PropTypes.string.isRequired,
  changeModal: PropTypes.func.isRequired,
  color: PropTypes.oneOf(['blue', 'purple', 'red', 'green']),
  children: PropTypes.any,
};

Modal.defaultProps = {
  color: 'purple',
};

export default withTheme(Modal);
