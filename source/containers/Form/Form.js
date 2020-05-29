import React from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components/native';
import Stepper from '../../components/atoms/Stepper/Stepper';
import useForm from './hooks/useForm';

const FormContainer = styled.View``;
const FormStepper = styled(Stepper);

function Form({ startAt, steps }) {
  const initialState = {
    counter: startAt,
    steps,
  };

  const { formState, handleNext, handleBack, handleAbort } = useForm(initialState);

  return (
    <FormContainer>
      <FormStepper active={formState.counter}>{/* Render Steps here */}</FormStepper>
    </FormContainer>
  );
}

Form.propTypes = {
  startAt: PropTypes.number,
  steps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

Form.defaultProps = {
  startAt: 1,
};

export default Form;
