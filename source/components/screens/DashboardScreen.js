import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Button } from 'react-native';
import Auth from '../../helpers/AuthHelper';
import StorageService from '../../services/StorageService';
import { sign, cancelRequest, resetCancel } from "../../services/UserService";
import { canOpenUrl } from "../../helpers/UrlHelper";
import ScreenWrapper from '../molecules/ScreenWrapper';

const USERKEY = 'user';
class DashboardScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      isBankidInstalled: false,
      isLoading: false,
    }
  }

  componentDidMount() {
    this.setUserAsync();
    this.isBankidInstalled();
  }

  isBankidInstalled = async () => {
    const isBankidInstalled = await canOpenUrl('bankid:///');

    if (isBankidInstalled) {
      this.setState({ isBankidInstalled: true });
    }
  };

  setUserAsync = async () => {
    try {
      const user = await StorageService.getData(USERKEY);
      console.log("getUserAsync dashboard", user);
      if (user) {
        this.setState({ user });
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  signWithBankid = async () => {
    const { user } = this.state;

    this.setState({ isLoading: true });

    try {
      const signResponse = await sign(
        user.personalNumber,
        'Sign some stuff please'
      );

      if (signResponse.ok === true) {
        this.setState({ isLoading: false });
        Alert.alert("Great success 🤘");
      } else {
        throw (signResponse.data);
      }
    } catch (error) {
      this.setState({ isLoading: false });
      if (error !== 'cancelled') {
        Alert.alert(error);
      }
    }

    resetCancel();
  };

  cancelSign = () => {
    try {
      cancelRequest();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  logOut = async () => {
    await Auth.logOut().then(() => {
      this.props.navigation.navigate('AuthLoading');
    });
  };

  removeUser = async () => {
    await StorageService.removeData('accessToken');
    await StorageService.removeData('user');

    this.props.navigation.navigate('AuthLoading');
  };

  render() {
    const { user, isLoading, isBankidInstalled } = this.state;

    return (
      <ScreenWrapper>
        {isLoading ? (
          <View style={styles.container}>
            <View style={styles.content}>
              <ActivityIndicator size="large" color="slategray" />
              {!isBankidInstalled &&
                <Text style={styles.infoText}>Väntar på att BankID ska startas på en annan enhet</Text>
              }
            </View>
            <View style={styles.loginContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.cancelSign}
                underlayColor='#fff'>
                <Text style={styles.buttonText}>Avbryt</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
            <View
              style={styles.container}
              accessible={false}
              testID={"ViewGreetings"}
            >
              <Text style={styles.header}>Greetings {user.given_name}!</Text>
              <Text style={{ fontSize: 60 }}>🦄</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={this.signWithBankid}
                underlayColor='#fff'
              >
                <Text style={styles.buttonText}>Sign some stuff</Text>
              </TouchableOpacity>

              <Button
                accessible={true}
                testID={'ButtonSignOut'}
                onPress={this.logOut}
                title="Sign out"
              />

              <Button
                accessible={true}
                testID={'ButtonRemoveUser'}
                onPress={this.removeUser}
                title="Remove this user"
              />

            </View >
          )
        }
      </ScreenWrapper>
    );
  }
}

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    flex: 0,
    width: '100%',
    marginBottom: 30
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24
  },
  header: {
    fontSize: 20
  },
  button: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#007AFF',
    borderRadius: 7,
    marginTop: 80
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
