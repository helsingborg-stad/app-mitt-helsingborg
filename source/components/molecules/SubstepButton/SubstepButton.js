import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { ScreenWrapper } from 'app/components/molecules';
import AuthContext from 'source/store/AuthContext';
import Form from 'source/containers/Form';
import { Text, Button } from '../../atoms';

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 1;
`;

function SubstepButton({ text, value, form, onChange, ...other }) {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [answers, setAnswers] = useState({});

  const updateAnswers = data => {
    setAnswers(data);
    onChange(data);
  };

  const handleSubmitForm = data => {
    setAnswers(data);
    onChange(data);
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)}>
        <Text>{text}</Text>
      </Button>
    );
  }
  return (
    <FormScreenWrapper
      style={{ borderWidth: 1, borderColor: 'black', borderRadius: 10, margin: 4 }}
    >
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
  );
}

SubstepButton.propTypes = {
  /**
   * The values
   */
  value: PropTypes.object,
  /**
   * The form that should be opened; i.e. the JSON-object describing the form
   */
  form: PropTypes.object.isRequired,

  /**
   * Text to display on the button
   */
  text: PropTypes.string.isRequired,

  /**
   * What should happen when some data is inputted
   */
  onChange: PropTypes.func,

  /**
   * Color theme of the button
   */
  color: PropTypes.string,
};

SubstepButton.defaultProps = {
  color: 'light',
};

export default SubstepButton;
