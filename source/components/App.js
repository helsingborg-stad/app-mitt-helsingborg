import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeRouter } from 'react-router-native';
import Routes from "../navigation/Routes";
import Navigation from "./shared/Navigation";
import { sanitizePno } from "../helpers/ValidationHelper";
import { validatePno } from "../helpers/ValidationHelper";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthed: false,
            user: {},
            validPno: false,
            appSettings: {
                pno: ''
            }
        }
    }

    componentDidMount() {
        const { appSettings } = this.state;
        this.validatePno(appSettings.pno);
    }

    /**
     * Validate personal number
    */
    validatePno = (pno) => {
        if (validatePno(pno)) {
            this.setState({ validPno: true });
        } else {
            this.setState({ validPno: false });
        }
    }

    setPno(pno) {
        pno = sanitizePno(pno);

        this.validatePno(pno);

        this.setState({
            appSettings: {
                pno
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
        backgroundColor: '#C7C7CC',
    }
});
