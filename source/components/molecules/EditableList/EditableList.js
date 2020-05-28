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

  background: ${props => props.bg};
  border-radius: 9.5px;
  overflow: hidden;
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
  color: ${props => props.color};
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
  color: ${props => props.color};
`;

function EditableList({
  theme,
  title,
  inputs,
  onInputChange,
  inputsEditable,
  headerButton: HeaderButton,
}) {
  return (
    <EditableListWrapper bg={theme.list.bg}>
      <EditableListHeader {...theme.list.header}>
        <HeaderTitleWrapper>
          <HeaderTitle> {title}</HeaderTitle>
        </HeaderTitleWrapper>
        {HeaderButton && (
          <HeaderButtonWrapper>
            <HeaderButton />
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
                color={theme.list.item.input.color}
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
  /**
   * The right side component in the list header
   */
  headerButton: PropTypes.node,

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
  headerButton: undefined,
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
