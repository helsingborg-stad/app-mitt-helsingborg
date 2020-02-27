import { createStackNavigator } from 'react-navigation-stack';
import TaskDetailScreen from '../components/screens/TaskDetailScreen';
import TaskScreen from '../components/screens/TaskScreen';

const TaskStack = createStackNavigator({
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
});

export default TaskStack;
