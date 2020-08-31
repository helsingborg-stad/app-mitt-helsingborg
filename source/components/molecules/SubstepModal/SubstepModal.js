import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Modal } from 'source/components/molecules';
import ScreenWrapper from 'app/components/molecules/ScreenWrapper';
import AuthContext from 'source/store/AuthContext';
import Form from 'source/containers/Form';
import FormContext from 'app/store/FormContext';
import { Text } from '../../atoms';

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 0;
  margin: 0;
`;

const SubstepModal = ({ visible, setVisible, value, formId, onChange, ...other }) => {
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});

  const updateAnswers = data => {
    onChange(data);
  };

  const handleSubmitForm = data => {
    onChange(data);
    setVisible(false);
  };

  // load the form from formContext once, store it in state.
  useEffect(() => {
    setLoading(true);
    if (formId && formId !== '') {
      getForm(formId)
        .then(res => {
          setForm(res);
        })
        .then(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);
  return (
    <Modal visible={visible}>
      <FormScreenWrapper>
        {loading ? (
          <Text>Loading form...</Text>
        ) : (
          <Form
            steps={form.steps}
            firstName={user.firstName}
            status="ongoing"
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
    </Modal>
  );
};

SubstepModal.propTypes = {
  /**
   * Whether or not to show the modal.
   */
  visible: PropTypes.bool,
  /**
   * Function that sets visibility of modal, used to close it.
   */
  setVisible: PropTypes.func,
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

SubstepModal.defaultProps = {
  value: {},
  onChange: () => {},
};

export default SubstepModal;
