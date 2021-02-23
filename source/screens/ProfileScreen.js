import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Button, Text, Heading, Icon } from '../components/atoms';
import { ScreenWrapper, Header } from '../components/molecules';
import AuthContext from '../store/AuthContext';
import AppContext from '../store/AppContext';
import Label from '../components/atoms/Label/Label';

const ProfileScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const BottomContainer = styled.View`
  margin-top: 32px;
  margin-bottom: 16px;
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
  color: ${(props) => props.theme.text.darkest};
  margin-top: 16px;
  margin-bottom: 0px;
`;

const ProfileInfoText = styled(Text)`
  font-size: 16px;
  color: ${(props) => props.theme.text.darkest};
`;

const ProfileInfoTextItalic = styled(ProfileInfoText)`
  font-style: italic;
  font-weight: normal;
`;

const ProfileLabel = styled(Label)`
  font-size: 12px;
  margin-top: 16px;
  margin-bottom: 0px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  color: ${(props) => props.theme.text.blue[4]};
`;

function ProfileScreen(props) {
  const {
    navigation: { navigate },
  } = props;
  const authContext = useContext(AuthContext);
  const { isDevMode } = useContext(AppContext);
  const { user } = authContext;
  const renderField = (value) =>
    value ? (
      <ProfileInfoText>{value}</ProfileInfoText>
    ) : (
      <ProfileInfoTextItalic>Ej angivet</ProfileInfoTextItalic>
    );

  return (
    <ProfileScreenWrapper>
      <Header title="Min profil" themeColor="purple" />
      <Container>
        <View>
          <ProfileInfoContainer>
            <ProfileInfoHeading type="h5">Personuppgifter</ProfileInfoHeading>
            <ProfileLabel underline={false} small>
              NAMN
            </ProfileLabel>
            {renderField(`${user?.firstName || ''} ${user?.lastName || ''}`)}
            <ProfileLabel underline={false} small>
              PERSONNUMMER
            </ProfileLabel>
            {renderField(user?.personalNumber)}
          </ProfileInfoContainer>
          <ProfileInfoContainer>
            <ProfileInfoHeading type="h5">Kontaktuppgifter</ProfileInfoHeading>
            <ProfileLabel underline={false} small>
              TELEFONNUMMER
            </ProfileLabel>
            {renderField(user?.mobilePhone)}
            <ProfileLabel underline={false} small>
              E-POSTADRESS
            </ProfileLabel>
            {renderField(user?.email)}
          </ProfileInfoContainer>
          <ProfileInfoContainer>
            <ProfileInfoHeading type="h5">Adress</ProfileInfoHeading>
            <ProfileLabel underline={false} small>
              GATUADRESS
            </ProfileLabel>
            {renderField(user?.address?.street)}
            <ProfileLabel underline={false} small>
              POSTNUMMER
            </ProfileLabel>
            {renderField(user?.address?.postalCode)}
            <ProfileLabel underline={false} small>
              ORT
            </ProfileLabel>
            {renderField(user?.address?.city)}
          </ProfileInfoContainer>
          <ProfileInfoTextItalic>
            Dessa uppgifter hämtade vi från Skatteverket när du identifierade dig med BankID
          </ProfileInfoTextItalic>
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
