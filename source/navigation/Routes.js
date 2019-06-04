import React, { Component } from 'react';
import { Route } from 'react-router-native';
import Login from "../components/Login";
import Home from "../components/Home";

class Routes extends Component {
    render() {
        return (
            <>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
            </>
        );
    }
}

export default Routes;
