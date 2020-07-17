import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Modal, StyleSheet, View, Dimensions } from 'react-native';
import { ScreenWrapper } from 'app/components/molecules';
import AuthContext from 'source/store/AuthContext';
import Form from 'source/containers/Form';
import FormContext from 'app/store/FormContext';
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
  button: {
    margin: 2,
  },
});

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 1;
  margin: 0;
`;

function SubstepButton({ text, value, formId, onChange, color, size, ...other }) {
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({});
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

  // load the form from formContext once, store it in state.
  useEffect(() => {
    getForm(formId).then(res => {
      setForm(res);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <Button style={styles.button} size={size} color={color} onClick={() => setShowForm(true)}>
        <Text>{text}</Text>
      </Button>
      <Modal animationType="slide" transparent visible={showForm} onRequestClose={() => {}}>
        <View style={{ width: screenWidth, ...styles.centeredView }}>
          <View style={styles.modalView}>
            <FormScreenWrapper>
              {loading ? (
                <Text>Loading form...</Text>
              ) : (
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
              )}
            </FormScreenWrapper>
          </View>
        </View>
      </Modal>
    </View>
  );
}

SubstepButton.propTypes = {
  /**
   * The text to display on the button
   */
  text: PropTypes.string,
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
};

export default SubstepButton;
