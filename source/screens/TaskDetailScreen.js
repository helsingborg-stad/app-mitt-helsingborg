import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/native';
import { TextInput } from 'react-native';
import { input } from 'app/components/atoms/Input';
import { Heading, Text, Icon } from 'app/components/atoms';
import { Header, ScreenWrapper } from 'app/components/molecules';

const TaskDetailScreenWrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  background-color: #fcfcfc;
`;

const Container = styled.ScrollView`
  padding-left: 16px;
  padding-right: 16px;
`;

const List = styled.View`
  margin-top: 20px;
  margin-bottom: 30px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const FieldWrapper = styled.View`
  padding-top: 15px;
`;

const FieldLabel = styled(Text)`
  margin-bottom: 5px;
  margin-left: 4px;
  margin-right: 10px;
  font-weight: normal;
  font-size: 14px;
`;

const FieldInputWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  ${input}
  padding: 10px;
  padding-left: 5px;
`;

const FieldInputIcon = styled(Icon)`
  font-size: 16px;
  color: #999;
`;

const FieldInput = styled(TextInput)`
  padding-left: 5px;
`;

// TODO: Lift out Field Component
const Field = props => {
  const { label, icon, input } = props;
  return (
    <FieldWrapper>
      {label && <FieldLabel>{label}</FieldLabel>}

      <FieldInputWrapper>
        {icon && <FieldInputIcon name={icon} />}
        <FieldInput {...input} />
      </FieldInputWrapper>
    </FieldWrapper>
  );
};

Field.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, false]),
  input: PropTypes.object,
  label: PropTypes.string,
};

const TaskDetailScreen = props => {
  const { navigation } = props;

  const answers = navigation.getParam('answers', false);
  const form = navigation.getParam('form', false);

  const groups = form.groups.map(group => ({
    ...group,
    questions: form.questions
      .filter(
        question =>
          question.details &&
          question.details.show &&
          question.details.group &&
          question.details.group === group.name
      )
      .map(question => ({ ...question, value: answers[question.id] ? answers[question.id] : '' })),
  }));

  return (
    <TaskDetailScreenWrapper>
      <Header
        title={form.name}
        themeColor="purple"
        backButton={{
          text: 'Ärenden',
          onClick: () => navigation.goBack(),
        }}
      />
      <Container>
        {groups.map(group => (
          <List key={group.title}>
            <ListHeading type="h3">{group.title}</ListHeading>
            {group.questions.map(question => (
              <Field
                key={question.id}
                label={question.details.label}
                icon={question.details.icon ? question.details.icon : false}
                input={{
                  editable: false,
                  value: question.value,
                }}
              />
            ))}
          </List>
        ))}
      </Container>
    </TaskDetailScreenWrapper>
  );
};

TaskDetailScreen.propTypes = {
  navigation: PropTypes.object,
};

export default TaskDetailScreen;
