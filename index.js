/**
 * @format
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Nav from './source/components/Nav';
import StorybookUIRoot from './storybook/index';
import Config from 'react-native-config';
import {YellowBox} from 'react-native';

//TODO: Replace all imports of AsyncStorage with Community package
YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core']);

/**
 * Any setup and init for application goes here:
 * Platform specific handling, global listeners, providers, etc.
 */
export default class MittHbg extends Component {
    render() {
        if (Config.IS_STORYBOOK === 'true') {
            return <StorybookUIRoot />
        }

        return (
            <Nav />
        )
    }
}

// const componentToRegister = (Config.IS_STORYBOOK === 'true') ? StorybookUIRoot : MittHbg

AppRegistry.registerComponent(appName, () => MittHbg);
 