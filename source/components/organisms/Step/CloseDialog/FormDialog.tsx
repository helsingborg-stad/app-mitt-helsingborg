import React from 'react';
import { View, Text } from 'react-native';
import CloseDialog, { Props as CloseDialogProps } from './CloseDialog';

type TemplateKeys = 'mainStep' | 'subStep';

const DIALOG_TEMPLATES: {
  [TemplateKeys: string]: CloseDialogProps;
} = {
  mainStep: {
    title: 'Vill du avbryta ansökan',
    body: 'Ansökan sparas i 3 dagar. Efter det raderas den och du får starta en ny.',
    buttons: [
      {
        text: 'Nej',
        color: 'red',
        clickHandler: () => {},
      },
      {
        text: 'Ja',
        color: 'blue',
        clickHandler: () => {},
      },
    ],
  },
  subStep: {
    title: 'Vill du stänga ner utan att spara?',
    body: '',
    buttons: [
      {
        text: 'Nej',
        color: 'red',
        clickHandler: () => {},
      },
      {
        text: 'Ja',
        color: 'blue',
        clickHandler: () => {},
      },
    ],
  },
};

interface Props extends Partial<CloseDialogProps> {
  template: TemplateKeys;
}

/** Template wrapper for CloseDialog within Form. Override template by forwarding props to CloseDialog */
const FormDialog = ({ template, ...props }: Props) => (
  <CloseDialog {...DIALOG_TEMPLATES[template]} {...props} />
);

export default FormDialog;
