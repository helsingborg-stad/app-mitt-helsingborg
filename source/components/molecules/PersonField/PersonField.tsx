import React, {useState} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { Avatar } from 'react-native-elements'
import { Text, Button } from '../../atoms'
import { InputRow } from '../RepeaterField/RepeaterField';

// TODO: BREAKOUT TO CARD COMPONENT REDUNDANT USE IN FIELDSET ALSO.
const PersonFieldContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  border-radius: 9.5px;
  overflow: hidden;
  margin-bottom: 24px;
  margin-top: 16px;
  padding-bottom: 20px;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${props => props.theme.colors.complementary.blue[3]};
`;

const PersonFieldHeader = styled.View`
  flex-direction: row;
`
const PersonFieldDetails = styled.View`
  margin-left: 20px;
  margin-top: 6px;
`

const PersonFieldInfoName = styled(Text)`
  font-weight: ${props => props.theme.fontWeights[1]};
  font-size: ${props => props.theme.fontSizes[4]};
`
const PersonFieldInfoRelation = styled(Text)`
  font-weight: ${props => props.theme.fontWeights[1]};
  color: ${props => props.theme.colors.primary.blue[1]};
`
const PersonFieldInfoPNO = styled(Text)`
margin-top: 6px;
  font-size: ${props => props.theme.fontSizes[3]};
`
const PersonFieldDivider = styled.View`
  height: 2px;
  margin: 0 -16px;
  margin-top: 20px;
  background: ${props => props.theme.colors.complementary.blue[1]};
`;

const PersonFieldFooter = styled.View`
  margin-top: 16px;
`;
const PersonFieldDeleteButton = styled(Button).attrs({
  z: 0,
  size: "small"
})`
  min-width: 100%;
  min-height: auto;
`;


const PersonFieldBody = styled.View`
  padding-top: 12px;
  padding-bottom: 20px;
  padding-right: 16px;
  height: auto;
`;

const PersonFieldInputContainer = styled.View<{editable: boolean; colorSchema: string;}>`
font-size: ${props => props.theme.fontSizes[4]}px;
  flex-direction: row;
  height: auto;
  background-color: transparent;
  border-radius: 4.5px;
  margin-bottom: 10px;
  ${props =>
    props.editable
      && `
      background-color: ${props.theme.colors.complementary[props.colorSchema][2]};
      padding: 10px;
      `
  };
`;


const PersonFieldInputLabelWrapper = styled.View`
  flex: 4;
  justify-content: center;
`;

const PersonFieldInputLabel = styled.Text`
  padding: 4px;
  font-weight: ${props => props.theme.fontWeights[1]};
  color: ${props => props.theme.colors.neutrals[1]};
`;

const PersonFieldInputWrapper = styled.View`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  flex: 6;
`;

// eslint-disable-next-line prettier/prettier
const PersonFieldInput = styled.TextInput`
  text-align: right;
  min-width: 70%;
  font-size: ${props => props.theme.fontSizes[3]}px;
  font-weight: bold;
`;

interface Input {
  label: string,
  key: string,
  type: 'text',
  value: string,
}
interface Props {
  firstName: string;
  lastName: string;
  middleName: string;
  personalNumber: string;
  relation: string;
  isEditable: boolean;
  inputs: Input[];
  onDelete: () => void;
  colorSchema: string;
}
function PersonField({firstName, lastName, isEditable, personalNumber, relation, colorSchema, inputs, onDelete}: Props) {
  return (
    <PersonFieldContainer>
      <PersonFieldHeader>
          <Avatar
              rounded
              size="medium"
              titleStyle={{ fontSize: 20, fontWeight: 'bold' }}
              title="FE"
            />
          <PersonFieldDetails>
            <PersonFieldInfoName>
              {`${firstName} ${lastName}`}
            </PersonFieldInfoName>
            <PersonFieldInfoRelation>
              {`${relation}`}
            </PersonFieldInfoRelation>
            <PersonFieldInfoPNO>

              Personnummer: {personalNumber}
            </PersonFieldInfoPNO>
          </PersonFieldDetails>
      </PersonFieldHeader>
      <PersonFieldDivider/>
      <PersonFieldBody>
        {inputs.map(input => (
           <PersonFieldInputContainer key={input.key} colorSchema={colorSchema} editable={isEditable}>
             <PersonFieldInputLabelWrapper>
                <PersonFieldInputLabel>
                  {input.label}
                </PersonFieldInputLabel>
             </PersonFieldInputLabelWrapper>
             <PersonFieldInputWrapper>
                 <PersonFieldInput
                    editable={isEditable}
                    value={input.value}
                  />
             </PersonFieldInputWrapper>
          </PersonFieldInputContainer>
        ))}
      </PersonFieldBody>
      { isEditable &&
        <PersonFieldFooter>
          <PersonFieldDeleteButton onPress={onDelete}>
              <Text>
                {`Ta Bort ${firstName}`.toUpperCase()}
              </Text>
          </PersonFieldDeleteButton>
        </PersonFieldFooter>
      }
    </PersonFieldContainer>
  )
}

PersonField.propTypes = {
  /**
   * The variation of color shcemas that can be used. blue is default.
   */
  colorSchema: PropTypes.oneOf(['blue', 'green', 'red', 'purple']),
  /**
   * A string representing the first name of a person.
   */
  firstName: PropTypes.string.isRequired,
  /**
   * A string representing the last name of a person.
   */
  lastName: PropTypes.string.isRequired,
  /**
   * A number representing the personalnumber of a person.
   */
  personalNumber: PropTypes.number.isRequired,
  /**
   * A string that represents the relation a person has to the user filling in the form (ie wife, husband, brother, child etc )
   */
  relation: PropTypes.string.isRequired,
  /**
   * Boolean for making the field editable. If true the field is editable.
   */
  isEditable: PropTypes.bool,
  /**
   * Function for triggering an onClick action on a remove button.
   */
  onDelete: PropTypes.func,
  /**
   * Array of inputs to be rendered in the field.
   */
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  )
}

PersonField.defaultProps = {
  isEditable: false,
  colorSchema: 'blue'
}

export default PersonField


