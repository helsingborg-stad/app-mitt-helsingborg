import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, Button } from '../../atoms';

/**
 * EditableList
 * A Molecule Component to use for rendering a list with the possibility of editing the list values.
 */

const EditableListWrapper = styled.View`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: auto;

  background: ${props => props.bg};
  border-radius: 9.5px;
  overflow: hidden;
  margin-bottom: 16px;
  margin-top: 16px;
`;

const EditableListHeader = styled.View`
  background: ${props => props.bg};
  color: ${props => props.color};
  padding-left: 24px;
  padding-right: 12px;
  padding-top: 12px;
  padding-bottom: 10px;
  position: relative;
  flex-direction: row;
  align-items: center;
  min-height: 58px;
`;

const HeaderButtonWrapper = styled.View`
  justify-content: flex-end;
  flex-direction: row;
  flex: 1;
`;

const HeaderTitleWrapper = styled.View`
  flex-direction: row;
  flex: 1;
`;

const HeaderTitle = styled(Text)`
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const EditableListBody = styled.View`
  padding-top: 12px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  height: auto;
`;

const EditableListItem = styled.View`
  flex-direction: row;
  height: 38px;
`;

const EditableListItemLabelWrapper = styled.View`
  flex: 4;
  justify-content: center;
`;

const EditableListItemLabel = styled.Text`
  font-size: 16px;
  font-weight: normal;
  color: ${props => props.color};
`;

const EditableListItemInputWrapper = styled.View`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  flex: 5;
`;

// eslint-disable-next-line prettier/prettier
const EditableListItemInput = styled.TextInput`
  text-align: right;
  min-width: 80%;
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.color};
  padding: 6px;
`;

const getInitialState = (inputs, value) => {
  if (value && typeof value === 'object') {
    return inputs.reduce((prev, current) => ({ ...prev, [current.key]: value[current.key] }), {});
  }
  return inputs.reduce((prev, current) => ({ ...prev, [current.key]: current.value }), {});
};

function EditableList({ theme, title, inputs, value, onInputChange, inputIsEditable }) {
  const [editable, setEditable] = useState(false);
  const [state, setState] = useState(getInitialState(inputs, value));

  const changeEditable = () => setEditable(!editable);

  const onChange = (key, text) => {
    const updatedState = JSON.parse(JSON.stringify(state));
    updatedState[key] = text;
    onInputChange(updatedState);
    setState(updatedState);
  };

  const editStyle = {
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
  };

  return (
    <EditableListWrapper bg={theme.list.bg}>
      <EditableListHeader {...theme.list.header}>
        <HeaderTitleWrapper>
          <HeaderTitle> {title}</HeaderTitle>
        </HeaderTitleWrapper>
        {inputIsEditable && (
          <HeaderButtonWrapper>
            <Button z={0} size="small" onClick={changeEditable}>
              <Text>{editable ? 'Spara' : 'Ändra'}</Text>
            </Button>
          </HeaderButtonWrapper>
        )}
      </EditableListHeader>

      <EditableListBody>
        {inputs.map(input => (
          <EditableListItem key={input.key}>
            <EditableListItemLabelWrapper>
              <EditableListItemLabel color={theme.list.item.label.color}>
                {input.label}
              </EditableListItemLabel>
            </EditableListItemLabelWrapper>
            <EditableListItemInputWrapper>
              <EditableListItemInput
                style={editable ? editStyle : {}}
                color={theme.list.item.input.color}
                editable={editable}
                onChangeText={text => onChange(input.key, text)}
                value={value && value !== '' ? value[input.key] : state[input.key]}
              />
            </EditableListItemInputWrapper>
          </EditableListItem>
        ))}
      </EditableListBody>
    </EditableListWrapper>
  );
}

EditableList.propTypes = {
  /**
   * The values
   */
  value: PropTypes.object,
  /**
   * Function for handling input events
   */
  onInputChange: PropTypes.func.isRequired,

  /**
   * The title of the list
   */
  title: PropTypes.string.isRequired,

  /**
   * The inputs that will be rendered
   */
  inputs: PropTypes.arrayOf({
    label: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  /**
   * Decides of the inputs are editable or not
   */
  inputIsEditable: PropTypes.bool,

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
EditableList.defaultProps = {
  inputIsEditable: true,
  inputs: [],
  theme: {
    list: {
      bg: '#fbf7f0',
      header: {
        bg: '#f5e0d8',
        color: '#5C3D38',
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

export default EditableList;
