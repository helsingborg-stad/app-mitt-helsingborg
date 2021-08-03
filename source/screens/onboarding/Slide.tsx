import React from 'react';
import styled from 'styled-components/native';
import { Platform, Dimensions, View, Image } from 'react-native';

const COAT_OF_ARMS_IMAGE = require('../../assets/images/slides/logo_3.png');

const Heading = styled.Text`
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0.025px;
  color: ${(props) => props?.headingColor || '#003359'};
  padding-top: 38px;
  font-family: 'Roboto';
`;

const SliderContainer = styled.View`
  padding-top: 50px;
  padding-left: 58px;
  padding-right: 58px;
  width: ${Dimensions.get('window').width}px;
`;

const CoatOfArms = styled.Image`
  height: 53px;
  width: 34px;
`;

const HorizontalRule = styled.View`
  padding-top: 16px;
  width: 32px;
  border-bottom-width: 2px;
  border-bottom-color: rgba(0, 0, 0, 0.48);
`;

const SliderImageContainer = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: flex-end;
`;

const TitleContainer = styled.View`
  height: 100px;
  justify-content: center;
  flex-direction: row;
  flex: 1;
`;

const Title = styled.Text`
  font-size: 30px;
  line-height: 44px;
  font-weight: ${Platform.OS === 'android' ? 'bold' : '900'};
  color: #000000;
  text-align: left;
  font-family: 'Roboto';
`;

const Content = styled.Text`
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  padding-top: 16px;
  font-family: 'Roboto';
`;

interface SliderPropsInterface {
  title: string;
  content: string;
  picture?: number;
  headingColor?: string;
}

const Slide = ({ headingColor, title, content, picture }: SliderPropsInterface) => (
  <SliderContainer>
    <View>
      <CoatOfArms source={COAT_OF_ARMS_IMAGE} />
      <Heading headingColor={headingColor}>Mitt Helsingborg</Heading>
      <HorizontalRule />
    </View>
    <SliderImageContainer>
      <Image
        source={picture}
        style={{
          flex: 1,
          width: null,
          height: null,
          resizeMode: 'contain',
        }}
        resizeMode="cover"
      />
    </SliderImageContainer>
    <TitleContainer>
      <Title>{title}</Title>
    </TitleContainer>
    <Content>{content}</Content>
  </SliderContainer>
);

export default Slide;
