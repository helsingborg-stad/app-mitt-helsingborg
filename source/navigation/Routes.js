import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-native';
import DashboardScreen from "../components/DashboardScreen";
import LoginScreen from "../components/login/LoginScreen";

class Routes extends Component {

    render() {
        const { isAuthed, user, setUser } = this.props;

        return (
            <>
                <Route exact path="/" render={(props) =>
                    (isAuthed ? (
                        <DashboardScreen {...props}
                            isAuthed={isAuthed}
                            user={user}
                        />
                    ) : (<Redirect to="/login" />)
                    )} />

                <Route path="/login" render={(props) =>
                    (!isAuthed ? (
                        <LoginScreen {...props}
                            isAuthed={isAuthed}
                            user={user}
                            setUser={setUser}
                        />
                    ) : (<Redirect to="/" />)
                    )
                } />

            </>
        );
    }
}

export default Routes;
