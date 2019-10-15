import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Button from './Button';
import Text from './Text';

// TODO: Improve style when used as ChatUserInput & show text 
export default ChatBankIdLoading = props => (<View style={styles.container}>
  <View style={styles.content}>
    <ActivityIndicator size="large" color="slategray" />
    {!props.isBankidInstalled &&
      <Text style={styles.infoText}>Väntar på att BankID ska startas på en annan enhet</Text>}
  </View>
  <View style={styles.loginContainer}>
    <Button block color={'purple'}><Text>Avbryt</Text></Button>
  </View>
</View>);


// TODO: Style with styled components
const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
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
});
