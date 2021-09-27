import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { render } from '../../../../../test-utils';

import { colorPalette } from '../../../../styles/palette';
import icons from '../../../../helpers/Icons';

import CharacterCard from '..';

jest.mock('../../../../helpers/Icons', () => ({
  default: 'mockTitle.png',
}));

const { ICON_CONTACT_PERSON_1 } = icons;

const mockTitle = 'mockTitle';
const mockAppartment = 'mockAppartment';
const mockJobTitle = 'mockJobTitle';

it('displays the provided props', () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <CharacterCard
      icon={ICON_CONTACT_PERSON_1}
      title={mockTitle}
      appartment={mockAppartment}
      jobTitle={mockJobTitle}
      onCardClick={mockCallback}
    />
  );

  const titleElement = getByText(mockTitle);
  const appartmentElement = getByText(mockAppartment);
  const jobTitleElement = getByText(mockJobTitle);

  expect(titleElement).toHaveTextContent(mockTitle);
  expect(appartmentElement).toHaveTextContent(mockAppartment);
  expect(jobTitleElement).toHaveTextContent(mockJobTitle);
});

it('calls the callback function on card click', () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <CharacterCard
      icon={ICON_CONTACT_PERSON_1}
      title={mockTitle}
      appartment={mockAppartment}
      jobTitle={mockJobTitle}
      onCardClick={mockCallback}
    />
  );

  const titleElement = getByText(mockTitle);
  fireEvent.press(titleElement);

  expect(mockCallback).toHaveBeenCalled();
});

it('changes color when selected', () => {
  const mockCallback = jest.fn();

  const { getByTestId } = render(
    <CharacterCard
      icon={ICON_CONTACT_PERSON_1}
      title={mockTitle}
      appartment={mockAppartment}
      jobTitle={mockJobTitle}
      onCardClick={mockCallback}
      selected
    />
  );

  const bodyElement = getByTestId('characterCard');

  expect(bodyElement).toHaveStyle({
    backgroundColor: colorPalette.complementary.red[3],
    borderColor: colorPalette.primary.red[4],
  });
});
