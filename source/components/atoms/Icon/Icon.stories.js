/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import StoryWrapper from '../../molecules/StoryWrapper';

import Icon from './index';
import Heading from '../Heading';

import { categories } from '../../../assets/material-icons.json';

storiesOf('Icon', module).add('Material Icons', (props) => (
  <StoryWrapper {...props}>
    <Flex>
      <IconCategory {...categories.find((category) => category.name === 'navigation')} />
    </Flex>
  </StoryWrapper>
));

const Flex = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const IconCategory = (props) => {
  const { name, icons } = props;

  return (
    <>
      <Flex>
        <Heading type="h3">{name.charAt(0).toUpperCase() + name.slice(1)}</Heading>
      </Flex>
      <Flex>
        {icons.map(({ name: iconName }) => (
          <Icon
            size={48}
            name={iconName.split(' ').join('-')}
            key={iconName.split(' ').join('-')}
          />
        ))}
      </Flex>
    </>
  );
};

IconCategory.propTypes = {
  name: PropTypes.string.isRequired,
  icons: PropTypes.array.isRequired,
};
