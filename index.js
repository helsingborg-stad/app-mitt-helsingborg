/**
 * @format
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Nav from './source/components/Nav'


/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */
export default class MittHbg extends Component {
    static init() {

    }

    render() {
        return (
            <Nav />
        )
    }
}

AppRegistry.registerComponent(appName, () => MittHbg);
