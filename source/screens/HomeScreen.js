import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { CaseDispatch } from 'app/store/CaseContext';
import FormList from 'app/components/organisms/FormList/FormList';
import ScreenWrapper from '../components/molecules/ScreenWrapper';

const HomeWrapper = styled(ScreenWrapper)`
  padding: 20px;
  margin-top: 40px;
  height: 80%;
`;

const HomeScreen = (props) => {
  const { navigation } = props;
  const { createCase } = useContext(CaseDispatch);

  return (
    <HomeWrapper>
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
    </HomeWrapper>
  );
};

export default HomeScreen;
