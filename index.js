/**
 * @format
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import Nav from './source/components/Nav';
import { PersistGate } from "redux-persist/integration/react";
import configureStore from './source/store/configureStore';

const { store, persistor} = configureStore();

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */
export default class MittHbg extends Component {
    static init() {

    }

    render() {
        return (
            <Provider store={ store }>
                <Nav />
            </Provider>
        )
    }
}

AppRegistry.registerComponent(appName, () => MittHbg);
