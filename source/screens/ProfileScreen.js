import React from 'react';
import styled from 'styled-components';
import mockImage from '../assets/screenshot_profile.png';

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
    <ProfileMockImage source={mockImage} />
  </ProfileContainer>
);

export default ProfileScreen;
