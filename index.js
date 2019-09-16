/**
 * @format
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Nav from './source/components/Nav';
import StorybookUIRoot from './storybook/index';
import Config from 'react-native-config';

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

const componentToRegister = (Config.IS_STORYBOOK === 'true') ? StorybookUIRoot : MittHbg

AppRegistry.registerComponent(appName, () => componentToRegister);
 