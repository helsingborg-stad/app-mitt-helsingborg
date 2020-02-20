/* eslint-disable global-require */
import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ProfileMockImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ProfileScreen = () => (
  <ProfileContainer>
    <ProfileMockImage source={require('../../assets/screenshot_profile.png')} />
  </ProfileContainer>
);

export default ProfileScreen;
