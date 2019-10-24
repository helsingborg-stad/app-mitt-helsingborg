import React from 'react';
import styled from 'styled-components';
import { ActivityIndicator } from 'react-native';
import Button from './Button';
import Text from './Text';

// TODO: Improve style when used as ChatUserInput & show text
export default ChatBankIdLoading = props =>
    <Container>
        <ActivityIndicator size="large" color="slategray" />
        {!props.isBankidInstalled &&
            <InfoText>Väntar på att BankID ska startas på en annan enhet</InfoText>
        }
        <Button block color={'purple'} onClick={props.onClick} ><Text>Avbryt</Text></Button>
    </Container>;

const Container = styled.View`
    padding: 16px;
    align-items: center;
    justify-content: center;
`;

const InfoText = styled(Text)`
    text-align: center;
    margin-top: 24px;
    margin-bottom: 24px;
`;
