import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { Button, Text, Heading, Box, Icon } from 'app/components/atoms';
import { ScreenWrapper, Header } from 'app/components/molecules';
import AuthContext from 'app/store/AuthContext';
import PropTypes from 'prop-types';

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const Card = styled(Box)`
  background-color: ${props => props.theme.colors.neutrals[7]};
  border-color: ${props => props.theme.border.default};
`;

function ProfileScreen(props) {
  const {
    navigation: { navigate },
  } = props;

  return (
    <ScreenWrapper>
      <Header title="Dina ärenden" />
      <Container>
        <Text strong>Aktiva</Text>
        <Card
          borderStyle="solid"
          borderWidth="1px"
          borderRadius="8px"
          mb="10px"
          p="10px"
          height="100px"
        >
          <Text>This box has a border radius</Text>
          <Button colorSchema="red" block size="small" rounded>
            <Text>Icon right</Text>
            <Icon name="arrow-forward" />
          </Button>
        </Card>
      </Container>
    </ScreenWrapper>
  );
}

ProfileScreen.propTypes = {
  navigation: PropTypes.object,
};

export default ProfileScreen;
