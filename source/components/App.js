import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeRouter } from 'react-router-native';
import Routes from "../navigation/Routes";
import Navigation from "./shared/Navigation";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthed: false,
            user: {},
            appSettings: {
                pno: ''
            }
        }
    }

    setPno(pno) {
        console.log(pno);
        this.setState({
            appSettings: {
                pno: pno
            }
        });
    }

    setUser(user) {
        this.setState({
            user,
            isAuthed: true
        });
    }

    render() {
        return (
            <NativeRouter>
                <View style={styles.body}>
                    {/* Nav for dev purposes, delete me later */}
                    <Navigation />
                    <Routes
                        {...this.state}
                        setPno={this.setPno.bind(this)}
                        setUser={this.setUser.bind(this)}
                    />
                </View>
            </NativeRouter>
        )
    }
}

export default App;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: 'whitesmoke',
    }
});
