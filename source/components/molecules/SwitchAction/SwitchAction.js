/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Button, Text } from 'source/components/atoms';
import EditableList from '../EditableList';

const InputWrapper = styled.View`
  padding-bottom: 16px;
`;

const InpulList = props => (
  <InputWrapper>
    <EditableList {...props} />
  </InputWrapper>
);

const SwitchAction = props => {
  const { fields, theme } = props;
  const [isAddressEditable, setisAddressEditable] = React.useState(false);
  const [isPersonalInfoEditable, setisPersonalInfoEditable] = React.useState(false);

  const addressButton = () => (
    <Button z={0} size="small" onClick={() => setisAddressEditable(true)} color="blue">
      <Text>Ändra</Text>
    </Button>
  );

  const personalInfoButton = () => (
    <Button z={0} size="small" onClick={() => setisPersonalInfoEditable(true)} color="blue">
      <Text>Ändra</Text>
    </Button>
  );

  // TODO: update data
  const onInputChange = () => {};

  const ComponentOptions =
    fields && fields.length
      ? fields.map(items => {
          switch (items.fieldType) {
            case 'address':
              return (
                <InpulList
                  key={items.fieldType}
                  title={items.title}
                  inputs={items.inputs}
                  headerButton={addressButton}
                  onInputChange={onInputChange}
                  inputsEditable={isAddressEditable}
                  theme={theme}
                />
              );
            case 'personal':
              return (
                <InpulList
                  key={items.fieldType}
                  title={items.title}
                  inputs={items.inputs}
                  headerButton={personalInfoButton}
                  onInputChange={onInputChange}
                  inputsEditable={isPersonalInfoEditable}
                  theme={theme}
                />
              );
            default:
              return null;
          }
        })
      : null;

  return <>{ComponentOptions}</>;
};

SwitchAction.propTypes = {
  fields: PropTypes.arrayOf({}),
  theme: PropTypes.shape({
    list: PropTypes.shape({
      bg: PropTypes.string,
      header: PropTypes.shape({
        bg: PropTypes.string,
        color: PropTypes.string,
      }),
      item: PropTypes.shape({
        label: PropTypes.shape({
          color: PropTypes.string,
        }),
        input: PropTypes.shape({
          color: PropTypes.string,
        }),
      }),
    }),
  }),
};

export default SwitchAction;
