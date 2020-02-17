import React, { Component } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import ScreenWrapper from '../molecules/ScreenWrapper';

class UserSettingsScreen extends Component {
  state = { switchState: false };

  toggleSwitch = value => {
    this.setState({
      switchState: value,
    });
  };

  render() {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <Text>Some Text</Text>
          <Switch onValueChange={this.toggleSwitch} value={this.state.switchState} />
        </View>
      </ScreenWrapper>
    );
  }
}

export default UserSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'stretch',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    flex: 0,
    width: '100%',
    marginBottom: 30,
  },
});
