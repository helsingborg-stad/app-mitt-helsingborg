import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import styled, { css } from 'styled-components/native';

export default CompletedTasks = props => {

  renderItem = task =>
    <TaskItem>
      <View>
        <Service>{task.service}</Service>
        <Text>{task.status}</Text>
      </View>
      <TaskIcon name="chevron-right" />
    </TaskItem>
    ;

  return (
    <View>
      <Header type="h3">Avslutade</Header>
      <TaskList
        scrollEnabled={false}
        data={props.tasks}
        renderItem={item => renderItem(item.item)}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const Header = styled(Heading)`
  margin-bottom: 24px;
`;

const TaskItem = styled(View)`
  padding: 16px;
  borderBottomWidth: 1;
  borderColor: #E5E5E5;
  flex-direction: row;
  align-items: center;
`;

const TaskList = styled(FlatList)`
  borderTopWidth: 1;
  borderColor: #E5E5E5;
`;

const Service = styled(Text)`
  font-size: 12px;
  color: #3D3D3D;
  margin-bottom: 4px;
`;

const TaskIcon = styled(Icon)`
  color: #A3A3A3;
  margin-left: auto;
`;


CompletedTasks.propTypes = {
  tasks: PropTypes.object,
};



