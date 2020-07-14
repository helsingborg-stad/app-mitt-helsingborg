import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Modal, StyleSheet, View, Dimensions } from 'react-native';
import { ScreenWrapper } from 'app/components/molecules';
import AuthContext from 'source/store/AuthContext';
import Form from 'source/containers/Form';
import { Text, Button } from '../../atoms';

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
});

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 1;
  margin: 0;
`;

function SubstepButton({ text, value, formId, onChange, ...other }) {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState(formId);
  const screenWidth = Math.round(Dimensions.get('window').width);

  const updateAnswers = data => {
    setAnswers(data);
    onChange(data);
  };

  const handleSubmitForm = data => {
    setAnswers(data);
    onChange(data);
    setShowForm(false);
  };

  return (
    <View>
      <Button onClick={() => setShowForm(true)}>
        <Text>{text}</Text>
      </Button>
      <Modal animationType="slide" transparent visible={showForm} onRequestClose={() => {}}>
        <View style={{ width: screenWidth, ...styles.centeredView }}>
          <View style={styles.modalView}>
            <FormScreenWrapper>
              <Form
                steps={form.steps}
                firstName={user.firstName}
                onClose={() => {
                  setShowForm(false);
                }}
                onStart={() => {}}
                onSubmit={handleSubmitForm}
                initialAnswers={typeof value !== 'object' ? answers : value}
                updateCaseInContext={updateAnswers}
                {...other}
              />
            </FormScreenWrapper>
          </View>
        </View>
      </Modal>
    </View>
  );
}

SubstepButton.defaultProps = {
  color: 'light',
};

export default SubstepButton;
