import React from 'react';
import styled from 'styled-components/native';
import { Text, Heading } from '../components/atoms';
import { Header, ScreenWrapper } from '../components/molecules';

const AboutScreenWrapper = styled(ScreenWrapper)`
  flex: 1;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px 16px;
  padding-top: 32px;
`;

const Paragraph = styled(Text)`
  font-size: 16px;
  margin-top: 16px;
  line-height: 24px;
`;

const AboutScreen = () => (
  <AboutScreenWrapper>
    <Header title="Om Appen" themeColor="purple" />
    <Container>
      <Heading type="h1">Hej! 👋</Heading>
      <Paragraph>
        Just nu utvecklar Helsingborgs stad appen Mitt Helsingborg, för att testa att
        görasjälvservice enklare och mer personligt.
      </Paragraph>
      <Paragraph>
        I första steget jobbar vi på att göra det lättare att ansöka om ekonomiskt bistånd, men
        påsikt ska du kunna hitta fler tjänster, mer information och personlig service från
        kommunenhär.
      </Paragraph>
    </Container>
  </AboutScreenWrapper>
);

export default AboutScreen;
