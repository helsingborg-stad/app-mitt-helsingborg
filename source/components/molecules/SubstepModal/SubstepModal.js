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

function SubstepModal({ visible, setVisible, value, formId, onChange, ...other }) {
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const screenWidth = Math.round(Dimensions.get('window').width);

  const updateAnswers = data => {
    onChange(data);
  };

  const handleSubmitForm = data => {
    onChange(data);
    setVisible(false);
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
    <Modal animationType="slide" transparent visible={visible} onRequestClose={() => {}}>
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
                  setVisible(false);
                }}
                onStart={() => {}}
                onSubmit={handleSubmitForm}
                initialAnswers={typeof value !== 'object' ? {} : value}
                updateCaseInContext={updateAnswers}
                {...other}
              />
            )}
          </FormScreenWrapper>
        </View>
      </View>
    </Modal>
  );
}

SubstepModal.propTypes = {
  /**
   * Whether or not to show the modal.
   */
  visible: PropTypes.bool,
  /**
   * Function that sets visibility of modal, used to close it.
   */
  setVisible: PropTypes.bool,
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
};

SubstepModal.defaultProps = {};

export default SubstepModal;
