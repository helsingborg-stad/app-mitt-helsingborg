import FormList from 'app/components/organisms/FormList/FormList';
import AuthContext from 'app/store/AuthContext';
import { CaseDispatch } from 'app/store/CaseContext';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { Button, Text } from '../components/atoms';
import Header from '../components/molecules/Header';
import ScreenWrapper from '../components/molecules/ScreenWrapper';
import StorageService from '../services/StorageService';

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const FieldWrapper = styled.View`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const DeveloperScreen = (props) => {
  const { navigation } = props;
  const { createCase } = useContext(CaseDispatch);
  const authContext = useContext(AuthContext);

  const colorSchema = 'neutral';

  return (
    <ScreenWrapper>
      <Header title="Utvecklarfunktioner" />

      <Container>
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

        <FieldWrapper>
          <Button
            block
            variant="outlined"
            colorSchema={colorSchema}
            onClick={async () => {
              StorageService.clearData();
              await authContext.handleLogout();
              navigation.navigate('Start');
            }}
          >
            <Text>Nollställ appdata</Text>
          </Button>
        </FieldWrapper>

        <FieldWrapper>
          <Button
            block
            variant="contained"
            colorSchema={colorSchema}
            onClick={async () => {
              navigation.navigate('App');
            }}
          >
            <Text>Tillbaka</Text>
          </Button>
        </FieldWrapper>
      </Container>
    </ScreenWrapper>
  );
};

DeveloperScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default DeveloperScreen;
