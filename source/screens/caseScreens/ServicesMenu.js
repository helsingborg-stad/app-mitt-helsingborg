import React from 'react';
import { Heading, Text, Button } from 'app/components/atoms';
import { ListItem, ScreenWrapper } from 'app/components/molecules';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { caseTypes } from './CaseLogic';

const MenuWrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 100px;
  padding-bottom: 0;
  background-color: #f5f5f5;
`;

const Container = styled.ScrollView`
  padding-left: 16px;
  padding-right: 16px;
`;
const ButtonContainer = styled.ScrollView`
  flex: 1;
  position: absolute;
  bottom: 35px;
  left: 33%;
  width: 33%;
`;
const List = styled.View`
  margin-top: 24px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const ServicesMenu = ({ navigation }) => (
  <MenuWrapper>
    <Container>
      <List>
        <ListHeading type="h3">Tjänster</ListHeading>
        {caseTypes.length > 0 ? (
          caseTypes.map(caseType => (
            <ListItem
              key={`${caseType.name}`}
              highlighted
              text={caseType.name}
              onClick={() => {
                navigation.navigate('UserEvents', {
                  screen: caseType.navigateTo,
                  params: { caseType },
                });
              }}
            />
          ))
        ) : (
          <Text style={{ marginLeft: 4 }}>Inga tjänster hittades...</Text>
        )}
      </List>
    </Container>
    <ButtonContainer>
      <Button onClick={navigation.goBack} color="blue">
        <Text>Tillbaka</Text>
      </Button>
    </ButtonContainer>
  </MenuWrapper>
);

ServicesMenu.propTypes = {
  navigation: PropTypes.object,
};

export default ServicesMenu;
