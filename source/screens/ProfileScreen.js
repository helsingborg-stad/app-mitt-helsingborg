import React from 'react';
import styled from 'styled-components';
import { SCREENSHOTS } from 'app/assets/images';

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
    <ProfileMockImage source={SCREENSHOTS.SCREENSHOT_PROFILE_PNG} />
  </ProfileContainer>
);

export default ProfileScreen;
