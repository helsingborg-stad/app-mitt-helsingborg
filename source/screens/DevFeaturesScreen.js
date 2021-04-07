import FormList from 'app/components/organisms/FormList/FormList';
import AuthContext from 'app/store/AuthContext';
import { CaseDispatch, CaseState } from 'app/store/CaseContext';
import PropTypes from 'prop-types';
import React, { useContext, useState, useEffect } from 'react';
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
  const { cases } = useContext(CaseState);
  const { createCase, getCase } = useContext(CaseDispatch);
  const [newCaseId, setNewCaseId] = useState(undefined);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (newCaseId && getCase(newCaseId)) {
      const newCase = getCase(newCaseId);
      navigation.navigate('Form', { caseData: newCase, caseId: newCase.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases, newCaseId]);

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
              async ({ id }) => {
                setNewCaseId(id);
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
