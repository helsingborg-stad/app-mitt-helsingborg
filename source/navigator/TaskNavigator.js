import { createStackNavigator } from 'react-navigation-stack';
import { TaskDetailScreen, TaskScreen } from 'app/screens';

export const TaskStack = {
  Task: {
    screen: TaskScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  TaskDetails: {
    screen: TaskDetailScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
};

export default createStackNavigator(TaskStack);
