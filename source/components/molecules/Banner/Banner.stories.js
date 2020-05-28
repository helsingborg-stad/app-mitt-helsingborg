import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import StoryWrapper from '../StoryWrapper';
import Banner from './Banner';

const COAPPLICATION = require('source/images/illu_sammanstallning.png');
const LOGO = require('source/images/illu_ekonomiskt-bistand.png');
const INCOME = require('source/images/illu_inkomster.png');
const ADD_INCOME = require('source/images/illu_lagg-till-inkomst.png');
const MEDICINE = require('source/images/illu_sjukvard.png');
const EXPENSE_PAGE = require('source/images/illu_utgifter15.png');
const EXPENSE_LIST = require('source/images/illu_utgifter15.png');
const MESSAGE = require('source/images/illu_beratta.png');
const COMPLETE = require('source/images/illu_fardig.png');

const styles = StyleSheet.create({
  smallIcon: {
    top: '80%',
    right: -30,
  },
  incomeIcon: {
    top: '8%',
    margin: 0,
    padding: 0,
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  addIncomeIcon: {
    top: '35%',
    right: -30,
    marginRight: 0,
    paddingRight: 0,
    flex: 1,
    resizeMode: 'contain',
  },
  medicineIcon: {
    top: '70%',
    right: -30,
    marginRight: 0,
    paddingRight: 0,
  },
  expenseIcon: {
    top: '8%',
    right: '15%',
    margin: 0,
    padding: 0,
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  messageIcon: {
    top: '70%',
    right: -30,
    marginRight: 0,
    paddingRight: 0,
  },
});

storiesOf('Banner', module)
  .add('Logo', props => (
    <StoryWrapper {...props}>
      <Banner imageSrc={LOGO} imageStyle={styles.smallIcon} />
    </StoryWrapper>
  ))
  .add('CoApplication', props => (
    <StoryWrapper {...props}>
      <Banner imageSrc={COAPPLICATION} imageStyle={styles.smallIcon} height="25%" />
    </StoryWrapper>
  ))
  .add('Income', props => (
    <StoryWrapper {...props}>
      <Banner imageSrc={INCOME} imageStyle={styles.incomeIcon} backgroundColor="#75C9A8" />
    </StoryWrapper>
  ))
  .add('AddIncome', props => (
    <StoryWrapper {...props}>
      <Banner
        imageSrc={ADD_INCOME}
        imageStyle={styles.addIncomeIcon}
        backgroundColor="#193752"
        height="25%"
      />
    </StoryWrapper>
  ))
  .add('medicine', props => (
    <StoryWrapper {...props}>
      <Banner
        imageSrc={MEDICINE}
        imageStyle={styles.medicineIcon}
        backgroundColor="#193752"
        height="25%"
      />
    </StoryWrapper>
  ))
  .add('ExpensePage', props => (
    <StoryWrapper {...props}>
      <Banner imageSrc={EXPENSE_PAGE} imageStyle={styles.expenseIcon} backgroundColor="#75C9A8" />
    </StoryWrapper>
  ))
  .add('ExpenseList', props => (
    <StoryWrapper {...props}>
      <Banner imageSrc={EXPENSE_LIST} imageStyle={styles.expenseIcon} />
    </StoryWrapper>
  ))
  .add('Message', props => (
    <StoryWrapper {...props}>
      <Banner
        imageSrc={MESSAGE}
        imageStyle={styles.messageIcon}
        height="25%"
        backgroundColor="#75C9A8"
      />
    </StoryWrapper>
  ))
  .add('complete', props => (
    <StoryWrapper {...props}>
      <Banner imageSrc={COMPLETE} imageStyle={styles.messageIcon} height="25%" />
    </StoryWrapper>
  ));
