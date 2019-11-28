
import React from 'react';
import styled from 'styled-components/native';
import { TextInput } from 'react-native';
import Header from '../molecules/Header';
import ScreenWrapper from '../molecules/ScreenWrapper';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import Icon from '../atoms/Icon';
import { input } from '../atoms/Input';

const TaskDetailScreen = (props) => {
    const {navigation} = props;

    const answers = navigation.getParam('answers', false)
    const form = navigation.getParam('form', false)

    const groups = [
        {
            name: "partner",
            title: "Make/Maka",
            questions: []
        },
        {
            name: "wedding",
            title: "Om vigseln",
            questions: []
        },
        {
            name: "witness",
            title: "Vittnen",
            questions: []
        }
    ]

    form.questions.forEach(question =>  {
        const { details } = question;
        if (details && details.show) {
            const group = groups.find(g => g.name === question.details.group)
            group.questions.push(question)
        }
    })


    return (
        <TaskDetailScreenWrapper>
            <Header
                title={form.name}
                themeColor="purple"
                backButton={
                    {
                        text: "Ärenden",
                        onClick: () => navigation.goBack()
                    }
                }
            />
            <Container>
                {groups.map( group => (
                    <List>
                        <ListHeading type="h3">{group.title}</ListHeading>
                        {   
                            group.questions.map( question => (
                                <Field 
                                    key={question.id}
                                    label={question.details.label}
                                    icon={question.details.icon}
                                    input={{
                                        editable: false,
                                        value: answers[question.id]
                                        }
                                    }
                                />
                            ))
                        }
                    </List>
                ))
                
                }
            </Container>
        </TaskDetailScreenWrapper>
    );
}


export default TaskDetailScreen;

const TaskDetailScreenWrapper = styled(ScreenWrapper)`
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    background-color: #FCFCFC;
`;

const Container = styled.ScrollView`
    padding-left: 16px;
    padding-right: 16px;
`;

const List = styled.View`
    margin-top: 24px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

// TODO: Lift out Field Component
const Field = ({label, icon, input}) => {
    return (
      <FieldWrapper>
         {label && 
             <FieldLabel>
                 {label}
             </FieldLabel>
         }
 
         <FieldInputWrapper>
             { icon && <FieldInputIcon name={icon}/>}
             <FieldInput {...input} />
         </FieldInputWrapper>
 
     </FieldWrapper>
    )
 }
 
const FieldWrapper = styled.View`
    padding-top: 15px;
`
 
const FieldLabel = styled(Text)`
    margin-bottom: 5px;
    margin-left: 4px;
    margin-right: 10px;
    font-weight: normal;
    font-size: 14px;
`
 
const FieldInputWrapper = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    ${input}
    padding: 10px;
    padding-left: 5px;
`

const FieldInputIcon = styled(Icon)`
    font-size: 16px;
    color: #999
`

const FieldInput = styled(TextInput)`
    padding-left: 5px;
`