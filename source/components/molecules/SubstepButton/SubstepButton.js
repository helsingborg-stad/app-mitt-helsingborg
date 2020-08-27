import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import { Text, Button, Icon } from '../../atoms';
import SubstepModal from '../SubstepModal/SubstepModal';

const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    marginLeft: '-17%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    width: '135%',
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    margin: 2,
  },
});

const SubStepButton = styled(Button)`
  margin: 2px;
`;

function SubstepButton({
  text,
  iconName,
  iconColor,
  value,
  formId,
  onChange,
  color,
  size,
  ...other
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <View>
      <SubStepButton
        style={styles.button}
        size={size}
        color={color}
        onClick={() => setShowForm(true)}
      >
        {iconName ? <Icon name={iconName} color={iconColor} /> : null}
        <Text>{text}</Text>
      </SubStepButton>
      <SubstepModal
        visible={showForm}
        setVisible={setShowForm}
        value={value}
        formId={formId}
        onChange={onChange}
        {...other}
      />
    </View>
  );
}

SubstepButton.propTypes = {
  /**
   * The text to display on the button
   */
  text: PropTypes.string,
  /**
   * If the button should have an icon
   */
  iconName: PropTypes.string,
  iconColor: PropTypes.string,
  /**
   * The value to fill the subform with
   */
  value: PropTypes.any,
  /**
   * The id that specifies the sub-form in the backend
   */
  formId: PropTypes.string,
  /**
   * what happens when a value change
   */
  onChange: PropTypes.func,
  /**
   * remaining things
   */
  other: PropTypes.any,
  /**
   * The color theme that specifies the button
   */
  color: PropTypes.string,
  /**
   * The size for the button; essentially allows it to be set to small
   */
  size: PropTypes.string,
};

SubstepButton.defaultProps = {
  color: 'light',
  iconColor: 'black',
};

export default SubstepButton;
