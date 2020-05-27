import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, Button } from '../../atoms';

/**
 * EditableList
 * A Molecule Component to use for rendering a list with the possibility of editing the list values.
 */

const EditableListWrapper = styled.View`
  background: red;
  display: flex;
  flex-direction: column;

  width: 382px;
  height: auto;

  background: #fbf7f0;
  border-radius: 9.5px;
  overflow: hidden;
`;

const EditableListHeader = styled.View`
  background: #f5e0d8;
  padding-left: 24px;
  padding-right: 12px;
  padding-top: 12px;
  padding-bottom: 10px;
  position: relative;
  flex-direction: row;
  align-items: center;
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
  font-size: 12px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const EditableListBody = styled.View`
  padding-top: 18px;
  padding-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  height: auto;
`;

const EditableListItem = styled.View`
  flex-direction: row;
  height: 38px;
`;

const EditableListItemLabelWrapper = styled.View`
  flex: 2;
  justify-content: center;
`;

const EditableListItemLabel = styled.Text`
  font-size: 18px;
  font-weight: normal;
  color: #855851;
`;

const EditableListItemInputWrapper = styled.View`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  flex: 4;
`;

const EditableListItemInput = styled.TextInput`
  font-size: 18px;
  font-weight: bold;
  color: #00213f;
`;

function EditableList({ title, inputs, onInputChange, inputsEditable }) {
  return (
    <EditableListWrapper>
      <EditableListHeader>
        <HeaderTitleWrapper>
          <HeaderTitle>{title}</HeaderTitle>
        </HeaderTitleWrapper>
        <HeaderButtonWrapper color="purple" size="small">
          <Button size="small" z={0}>
            <Text>Ändra</Text>
          </Button>
        </HeaderButtonWrapper>
      </EditableListHeader>

      <EditableListBody>
        {inputs.map(input => (
          <EditableListItem key={input.key}>
            <EditableListItemLabelWrapper>
              <EditableListItemLabel>{input.label}</EditableListItemLabel>
            </EditableListItemLabelWrapper>
            <EditableListItemInputWrapper>
              <EditableListItemInput
                editable={inputsEditable}
                onChangeText={onInputChange}
                value={input.value}
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
  inputsEditable: PropTypes.bool,
};
EditableList.defaultProps = {
  inputsEditable: false,
  inputs: [
    {
      key: 'key-1',
      label: 'Adress',
      type: 'text',
      value: 'Storgatan 9, Helsingborg',
    },
    {
      key: 'key-2',
      label: 'Storlek',
      type: 'text',
      value: '1 rum & kök',
    },
    {
      key: 'key-3',
      label: 'Hyresvärd',
      type: 'text',
      value: 'Helsingborgshem',
    },
  ],
};

export default EditableList;
