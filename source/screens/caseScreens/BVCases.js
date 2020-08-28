import React from 'react';
import { Text } from 'app/components/atoms';
import { Header, ScreenWrapper } from 'app/components/molecules';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const Wrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  background-color: #f5f5f5;
`;

const Container = styled.ScrollView`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 100px;
`;

const BVCases = () => (
  <Wrapper>
    <Header title="Borgerlig Vigsel" themeColor="purple" />
    <Container>
      <Text>Not implemented yet, sorry...</Text>
    </Container>
  </Wrapper>
);

export default BVCases;
