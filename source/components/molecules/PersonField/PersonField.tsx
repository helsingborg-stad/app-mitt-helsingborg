import React, {useState} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { Avatar } from 'react-native-elements'
import { Text, Button } from '../../atoms'

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

const PersonFieldInputContainer = styled.View`
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

function PersonField(props) {
  const [editable, setEditable] = useState(props.editable);
  console.log(props);
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
              {`${props.firstName} ${props.lastName}`}
            </PersonFieldInfoName>
            <PersonFieldInfoRelation>
              {`${props.relation}`}
            </PersonFieldInfoRelation>
            <PersonFieldInfoPNO>

              Personnummer: {props.personalNumber}
            </PersonFieldInfoPNO>
          </PersonFieldDetails>
      </PersonFieldHeader>
      <PersonFieldDivider/>
      <PersonFieldBody>
        {props.inputs.map(input => (
           <PersonFieldInputContainer colorSchema={props.colorSchema} editable={props.editable}>
             <PersonFieldInputLabelWrapper>
                <PersonFieldInputLabel>
                  {input.label}
                </PersonFieldInputLabel>
             </PersonFieldInputLabelWrapper>
             <PersonFieldInputWrapper>
                 <PersonFieldInput
                    editable={editable}
                    value={input.value}
                  />
             </PersonFieldInputWrapper>
          </PersonFieldInputContainer>
        ))}
      </PersonFieldBody>
      { editable &&
        <PersonFieldFooter>
          <PersonFieldDeleteButton>
              <Text>
                {`Ta Bort ${props.firstName}`.toUpperCase()}
              </Text>
          </PersonFieldDeleteButton>
        </PersonFieldFooter>
      }
    </PersonFieldContainer>
  )
}

PersonField.propTypes = {
  colorSchema: PropTypes.oneOf(['blue', 'green', 'red', 'purple']),
  firstName: PropTypes.string.isRequired,
  middleName: PropTypes.string,
  lastName: PropTypes.string.isRequired,
  personalNumber: PropTypes.number.isRequired,
  relation: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  )
}

PersonField.defaultProps = {
  editable: false,
  colorSchema: 'blue'
}

export default PersonField


