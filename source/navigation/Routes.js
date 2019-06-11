import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-native';
import DashboardScreen from "../components/DashboardScreen";
import LoginScreen from "../components/login/LoginScreen";
import EditLoginScreen from "../components/login/EditLoginScreen";

class Routes extends Component {

    render() {
        const { isAuthed, user, appSettings, setPno, setUser } = this.props;

        return (
            <>
                <Route exact path="/" render={(props) =>
                    (isAuthed ? (
                        <DashboardScreen {...props}
                            isAuthed={isAuthed}
                            user={user}
                            appSettings={appSettings}
                        />
                    ) : (<Redirect to="/login" />)
                    )} />

                <Route path="/login" render={(props) =>
                    (!isAuthed ? (
                        <LoginScreen {...props}
                            isAuthed={isAuthed}
                            user={user}
                            appSettings={appSettings}
                            setUser={setUser} />
                    ) : (<Redirect to="/" />)
                    )
                } />

                <Route path="/editlogin" render={(props) =>
                    <EditLoginScreen {...props}
                        isAuthed={isAuthed}
                        user={user}
                        appSettings={appSettings}
                        setPno={setPno} />
                } />
            </>
        );
    }
}

export default Routes;
