/* eslint-disable global-require */
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  smallIcon: {
    top: '90%',
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
    top: '55%',
    margin: 0,
    padding: 0,
    flex: 1,
    zIndex: 10,
    resizeMode: 'contain',
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
});

const AddIncomeContainer = styled.View({
  top: 0,
  margin: 0,
  padding: 32,
  width: '100%',
  height: '25%',
  backgroundColor: '#193752' /* #00213f */,
});

const SmallImageContainer = styled.View`
  position: relative;
  top: 0;
  margin: 0;
  padding: 32px;
  width: 100%;
  height: ${props => (props.inputHeight ? '25%' : '35%')};
  background-color: ${props => (props.inputColor ? '#75C9A8' : '#FBF7F0')};
`;
const LargeImageContainer = styled.View`
  position: relative;
  top: 0;
  margin: 0;
  padding: 0;
  height: 35%;
  background-color: ${props => (props.inputColor ? '#75C9A8' : '#FBF7F0')};
`;

const Banner = ({ image }) => {
  const SetImage = () => {
    switch (image) {
      case 'logo':
        return (
          <SmallImageContainer>
            <Image
              source={require('source/images/illu_ekonomiskt-bistand.png')}
              style={styles.smallIcon}
            />
          </SmallImageContainer>
        );
      case 'coApplication':
        return (
          <SmallImageContainer inputHeight>
            <Image
              source={require('source/images/illu_sammanstallning.png')}
              style={styles.smallIcon}
            />
          </SmallImageContainer>
        );
      case 'income':
        return (
          <LargeImageContainer inputColor>
            <Image source={require('source/images/illu_inkomster.png')} style={styles.incomeIcon} />
          </LargeImageContainer>
        );
      case 'addIncome':
        return (
          <AddIncomeContainer>
            <Image
              source={require('source/images/illu_lagg-till-inkomst.png')}
              style={styles.addIncomeIcon}
            />
          </AddIncomeContainer>
        );
      case 'medicine':
        return (
          <AddIncomeContainer>
            <Image source={require('source/images/illu_sjukvard.png')} style={styles.smallIcon} />
          </AddIncomeContainer>
        );
      case 'expensePage':
        return (
          <LargeImageContainer inputColor>
            <Image
              source={require('source/images/illu_utgifter15.png')}
              style={styles.expenseIcon}
            />
          </LargeImageContainer>
        );
      case 'expenseList':
        return (
          <LargeImageContainer>
            <Image
              source={require('source/images/illu_utgifter15.png')}
              style={styles.expenseIcon}
            />
          </LargeImageContainer>
        );
      case 'message':
        return (
          <SmallImageContainer inputHeight inputColor>
            <Image source={require('source/images/illu_beratta.png')} style={styles.smallIcon} />
          </SmallImageContainer>
        );
      case 'complete':
        return (
          <SmallImageContainer inputHeight>
            <Image source={require('source/images/illu_fardig.png')} style={styles.smallIcon} />
          </SmallImageContainer>
        );
      default:
        return <AddIncomeContainer />;
    }
  };

  return (
    <>
      <SetImage />
    </>
  );
};
Banner.propTypes = {
  image: PropTypes.string.isRequired,
};

export default Banner;
