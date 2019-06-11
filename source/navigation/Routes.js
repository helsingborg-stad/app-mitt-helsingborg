import React, { Component } from 'react';
import { Route } from 'react-router-native';
import Home from "../components/Home";
import Login from "../components/login/Login";
import EditLogin from "../components/login/EditLogin";

class Routes extends Component {
    render() {
        return (
            <>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/editlogin" component={EditLogin} />
            </>
        );
    }
}

export default Routes;
