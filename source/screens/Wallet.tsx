/* eslint-disable react/destructuring-assignment */
import React, { useState, useContext, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, Button, Icon } from '../components/atoms';
import { EditableList } from '../components/molecules';
import {
  getUser,
  getAllCases,
  clearCases,
  putUserInfo,
  VALIDATE_CREDENTIALS,
} from '../services/Wallet/WalletStorage';
import { UserInfo } from '../services/Wallet/types';
import AuthContext from '../store/AuthContext';
import { Case } from '../types/CaseType';
import CaseList from '../components/molecules/List/CaseList';

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;
  width: 100%;
  bottom: 0;
`;
const HomeScreenButton = styled(Button)`
  align-content: center;
  padding: 10px;
  margin: 15px;
  max-width: 90%;
`;

const ProfileInfoContainer = styled.View`
  margin-top: 20px;
  margin-bottom: 0px;
`;

const EmptyValue = styled(Text)`
  font-style: italic;
  font-weight: normal;
`;

type VerificationStatus = 'valid' | 'invalid' | 'loading';

const VerificationStatusComponent: React.FC<{
  status: VerificationStatus;
  successMessage: string;
  failMessage: string;
}> = ({ status, successMessage, failMessage }) => {
  if (status === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 40,
          paddingLeft: 40,
        }}
      >
        <Text>Verifierar...</Text>
        <ActivityIndicator />
      </View>
    );
  }
  if (status === 'valid') {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 40,
          paddingLeft: 40,
        }}
      >
        <Text>{successMessage}</Text>
        <Icon name="done" color="green" />
      </View>
    );
  }
  if (status === 'invalid') {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 40,
          paddingLeft: 40,
        }}
      >
        <Text>{failMessage}</Text>
        <Icon name="error_outline" color="red" />
      </View>
    );
  }
};

const emptyCaseList: Case[] = [];

const WalletScreen: React.FC<{ navigation: StackNavigationProp<any, any> }> = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});
  const [cases, setCases] = useState(emptyCaseList);
  const [update, triggerUpdate] = useState(0); // TODO: fix this ugly hack of a way to update things.
  const [userDataStatus, setUserDataStatus] = useState<VerificationStatus>('loading');
  const [caseDataStatus, setCaseDataStatus] = useState<VerificationStatus>('loading');

  const updateData = () => {
    const loadCases = async () => {
      const cs = await getAllCases();
      setCases(cs);
      if (cs) {
        setCaseDataStatus('valid');
      } else {
        setCaseDataStatus('invalid');
      }
    };
    const loadUserInfo = async () => {
      const ui = await getUser();
      setUserInfo(ui);
      if (ui) {
        setUserDataStatus('valid');
      } else {
        setUserDataStatus('invalid');
      }
    };
    loadCases();
    loadUserInfo();
  };

  useFocusEffect(React.useCallback(updateData, []));
  useEffect(() => {
    updateData();
  }, [update]);

  const contactInfoInputs = [
    {
      key: 'email',
      label: 'Email',
      type: 'text',
    },
    {
      key: 'phone',
      label: 'Telefon',
      type: 'number',
    },
  ];
  const personalInfoInputs = [
    {
      key: 'firstName',
      label: 'Förnamn',
      type: 'text',
    },
    {
      key: 'lastName',
      label: 'Efternamn',
      type: 'text',
    },
    {
      key: 'personalNumber',
      label: 'Personnummer',
      type: 'number',
    },
    {
      key: 'civilStatus',
      label: 'Civilstånd',
      type: 'text',
    },
  ];

  const updateContactInfo = (value: { email: string; phone: string }) => {
    setUserInfo(prev => {
      prev.contactInfo = value;
      return { ...prev };
    });
  };
  const updatePersonalInfo = (value: {
    firstName: string;
    lastName: string;
    personalNumber: string;
    civilStatus: 'OG' | 'G';
    citizenship: string;
  }) => {
    setUserInfo(prev => {
      prev.personalInfo = { ...prev.personalInfo, ...value };
      return { ...prev };
    });
  };

  return (
    <ScrollView style={{ padding: 10, marginTop: 50 }}>
      <ProfileInfoContainer>
        <EditableList
          onInputChange={updatePersonalInfo}
          onSave={() => putUserInfo({ personalInfo: userInfo.personalInfo })}
          inputs={personalInfoInputs}
          value={userInfo.personalInfo}
          title="Personuppgifter"
        />
      </ProfileInfoContainer>
      <ProfileInfoContainer>
        <EditableList
          onInputChange={updateContactInfo}
          onSave={() => putUserInfo({ contactInfo: userInfo.contactInfo })}
          inputs={contactInfoInputs}
          value={userInfo.contactInfo}
          title="Kontaktuppgifter"
        />
        {VALIDATE_CREDENTIALS && (
          <VerificationStatusComponent
            status={userDataStatus}
            successMessage="Personuppgifterna är verifierade"
            failMessage="Personuppgifterna kunde inte verifieras"
          />
        )}
      </ProfileInfoContainer>
      <CaseList cases={cases} navigation={navigation} />

      <ButtonContainer>
        <HomeScreenButton
          color="red"
          onClick={async () => {
            clearCases().then(() => triggerUpdate(i => i + 1));
          }}
          block
        >
          <Text>Rensa ärenden</Text>
        </HomeScreenButton>
        {VALIDATE_CREDENTIALS && (
          <VerificationStatusComponent
            status={caseDataStatus}
            successMessage="Ärende-data är verifierad"
            failMessage="Ärende-datan kunde inte verifieras"
          />
        )}
      </ButtonContainer>
    </ScrollView>
  );
};

WalletScreen.propTypes = {
  navigation: PropTypes.object,
};

export default WalletScreen;
