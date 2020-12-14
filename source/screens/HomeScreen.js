/* eslint-disable react/destructuring-assignment */
import React, { useState, useContext } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Text, Button } from 'app/components/atoms';
import { CaseDispatch } from 'app/store/CaseContext';
import FormList from 'app/components/organisms/FormList/FormList';
import AuthContext from '../store/AuthContext';
import UserInactivity from '../containers/UserInactivity/UserInactivity';

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  bottom: 0;
`;

const HomeScreenButton = styled(Button)`
  align-content: center;
  padding: 10px;
  margin: 15px;
  max-width: 90%;
`;

const HomeScreen = (props) => {
  const { navigation } = props;
  const { createCase } = useContext(CaseDispatch);

  return (
    <UserInactivity style={{ padding: 20, marginTop: 40, height: '73%' }}>
      <FormList
        heading="Ansökningsformulär"
        onClickCallback={async (form) => {
          createCase(
            form,
            async (newCase) => {
              navigation.navigate('Form', { caseData: newCase });
            },
            true
          );
        }}
      />
    </UserInactivity>
  );
};

export default HomeScreen;
