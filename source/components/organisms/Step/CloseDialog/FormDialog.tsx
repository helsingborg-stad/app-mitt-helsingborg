import React from 'react';
import { View, Text } from 'react-native';
import CloseDialog, { Props as CloseDialogProps } from './CloseDialog';

type DialogTemplateKeyType = 'mainStep' | 'subStep';

const DIALOG_TEMPLATES: {
  [DialogTemplateKeyType: string]: CloseDialogProps;
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
  template: DialogTemplateKeyType;
}

/** Simple popup dialog asking the user if they really want to exit the form. Partially masks the background. */
const FormDialog = ({ template, ...props }: Props) => (
  <CloseDialog {...DIALOG_TEMPLATES[template]} {...props} />
);

export default FormDialog;
