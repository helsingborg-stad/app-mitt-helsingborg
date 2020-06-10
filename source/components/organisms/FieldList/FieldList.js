/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Button, Text } from 'source/components/atoms';
import { EditableList } from 'source/components/molecules';

const InputWrapper = styled.View`
  padding-bottom: 16px;
`;

const InpulList = props => (
  <InputWrapper>
    <EditableList {...props} />
  </InputWrapper>
);

const FieldList = props => {
  const { fields, theme, onInputChange } = props;
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
                  inputsEditable={isAddressEditable}
                  onInputChange={onInputChange}
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

FieldList.propTypes = {
  /**
   * The array of fields that are going to be displayed in the Step
   */
  fields: PropTypes.arrayOf({}).isRequired,

  /**
   *  The function to handle field input changes
   */
  onInputChange: PropTypes.func.isRequired,
  /**
   * The theming of the component
   */
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

FieldList.propTypes = {
  theme: {
    list: {
      bg: '#FBF7F0',
      header: {
        color: '#5C3D38',
        bg: '#f5e0d8',
      },
      item: {
        label: {
          color: '#855851',
        },
        input: {
          color: '#00213f',
        },
      },
    },
  },
};

export default FieldList;
