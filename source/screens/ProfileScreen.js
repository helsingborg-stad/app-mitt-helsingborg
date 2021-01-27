import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Button, Text, Heading, Icon } from 'app/components/atoms';
import { Header } from 'app/components/molecules';
import AuthContext from 'app/store/AuthContext';
import PropTypes from 'prop-types';
import { ScreenWrapper } from '../components/molecules';
import AppContext from '../store/AppContext';

const ProfileScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const BottomContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const SignOutButton = styled(Button)`
  margin-bottom: 16px;
`;

const ProfileInfoContainer = styled.View`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ProfileInfoHeading = styled(Heading)`
  margin-bottom: 8px;
`;

const EmptyValue = styled(Text)`
  font-style: italic;
  font-weight: normal;
`;

const Label = styled(Text)`
  margin-top: 12px;
  margin-bottom: 4px;
  color: ${(props) => props.theme.background.light};
`;

function ProfileScreen(props) {
  const {
    navigation: { navigate },
  } = props;
  const authContext = useContext(AuthContext);
  const { isDevMode } = useContext(AppContext);
  const { user } = authContext;
  const renderField = (value) =>
    value ? <Text>{value}</Text> : <EmptyValue>Ej angivet</EmptyValue>;

  return (
    <ProfileScreenWrapper>
      <Header title="Min profil" themeColor="purple" />
      <Container>
        <View>
          <ProfileInfoContainer>
            <ProfileInfoHeading type="h3">Personuppgifter</ProfileInfoHeading>
            <Label small>NAMN</Label>
            {renderField(`${user?.firstName || ''} ${user?.lastName || ''}`)}
            <Label small>PERSONNUMMER</Label>
            {renderField(user?.personalNumber)}
          </ProfileInfoContainer>
          <ProfileInfoContainer>
            <ProfileInfoHeading type="h3">Kontaktuppgifter</ProfileInfoHeading>
            <Label small>TELEFONNUMMER</Label>
            {renderField(user?.mobilePhone)}
            <Label small>E-POSTADRESS</Label>
            {renderField(user?.email)}
            <Label small>ADRESS</Label>
            {renderField(user?.address?.street)}
            {renderField(user?.address?.postalCode)}
          </ProfileInfoContainer>
        </View>
        <BottomContainer>
          <SignOutButton
            block
            colorSchema="blue"
            onClick={async () => {
              await authContext.handleLogout();
              navigate('Start');
            }}
          >
            <Text>Logga ut</Text>
          </SignOutButton>

          {isDevMode && (
            <Button
              block
              variant="outlined"
              colorSchema="neutral"
              onClick={() => navigate('DevFeatures')}
            >
              <Text>Utvecklarfunktioner</Text>
              <Icon name="construction" />
            </Button>
          )}
        </BottomContainer>
      </Container>
    </ProfileScreenWrapper>
  );
}

ProfileScreen.propTypes = {
  navigation: PropTypes.object,
};

export default ProfileScreen;
