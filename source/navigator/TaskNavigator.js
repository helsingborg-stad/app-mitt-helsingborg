import { createStackNavigator } from 'react-navigation-stack';
import { CaseArchiveScreen } from 'app/screens';

export const CaseStack = {
  CaseArchive: {
    screen: CaseArchiveScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
};

export default createStackNavigator(CaseStack);
