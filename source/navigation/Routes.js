import React, { Component } from 'react';
import DashboardScreen from "../components/DashboardScreen";
import LoginScreen from "../components/login/LoginScreen";

class Routes extends Component {

    render() {
        const { isAuthed, user, loginUser, resetUser } = this.props;

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
                            loginUser={loginUser}
                            resetUser={resetUser}
                        />
                    ) : (<Redirect to="/" />)
                    )
                } />

            </>
        );
    }
}

export default Routes;
