import React from 'react';
import { action } from '@storybook/addon-actions';
import Header from './Header';
import StoryWrapper from '../StoryWrapper';

export default {
  component: Header,
  title: 'Header',
};

export const plainHeader = () => (
  <StoryWrapper>
    <Header />
  </StoryWrapper>
);
export const headerWithmessage = () => (
  <StoryWrapper>
    <Header message="Header Message" />
  </StoryWrapper>
);
export const headerWithTitle = () => (
  <StoryWrapper>
    <Header message="Header Message" title="Header Title" />
  </StoryWrapper>
);

export const headerWithBackButton = () => (
  <StoryWrapper>
    <Header
      message="Header Message"
      title="Cool"
      backButton={{ text: 'Go back', onClick: action('clicked back button') }}
    />
  </StoryWrapper>
);

export const headerTitleColor = () => (
  <StoryWrapper>
    <Header themeColor="green" message="Header message" title="Header Title" />
  </StoryWrapper>
);

const navItems = [
  {
    id: 1,
    active: false,
    title: 'Navigation',
  },
  {
    id: 2,
    active: true,
    title: 'Navigation',
  },
];

export const headerWithNavigation = () => (
  <StoryWrapper>
    <Header message="Header Message" title="Header Title" navItems={navItems} />
  </StoryWrapper>
);
