import React, { PureComponent } from 'react'
import env from 'react-native-config';

import StorageService from '../../services/StorageService';
import Auth from '../../helpers/AuthHelper';
import { authorize, bypassBankid, cancelRequest, resetCancel } from "../../services/UserService";
import { canOpenUrl } from "../../helpers/LinkHelper";

const FAKE_PERSONAL_NUMBER = '201111111111';
const FAKE_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjFlZDcyYzJjLWQ5OGUtNGZjMC04ZGY2LWY5NjRkOTYxMTVjYSIsImlhdCI6MTU2Mjc0NzM2NiwiZXhwIjoxNTYyNzUwOTc0fQ.iwmUMm51j-j2BYui9v9371DkY5LwLGATWn4LepVxmNk';

const USERKEY = 'user';

/**
 * Wraps a react component with user authentication component.
 *
 * @param {*} WrappedComponent
 *
 * example usage:
 *  export default withAuthentication(LoginScreen)
 *
 * from within the WrappedComponent (eg. LoginScreen) we can use:
 *  props.authentication.loginUser(), props.authentication.isLoading etc
 *
 */
const withAuthentication = (WrappedComponent) => {
    return class WithAuthentication extends PureComponent {
        constructor(props) {
            super(props);

            this.state = {
                user: {},
                isLoading: false,
                isBankidInstalled: false,
            };
        }

        componentDidMount() {
            this._setUserAsync();
            this._isBankidInstalled();
        }

        /**
         * Make authenticate request and log in user
         */
        loginUser = async (personalNumber) => {
            try {
                this.setState({ isLoading: true });
                // TODO: Safe to keep in production?
                if (personalNumber === FAKE_PERSONAL_NUMBER && env.APP_ENV === 'development') {
                    return await this._fakeLogin(personalNumber);
                }

                const authResponse = await authorize(personalNumber);
                if (authResponse.ok !== true) {
                    throw new Error(authResponse.data);
                }

                try {
                    const { user, accessToken } = authResponse.data;
                    await Auth.logIn(user, accessToken);
                } catch (error) {
                    throw new Error("Login failed");
                }

                return authResponse.data;
            } catch (error) {
                // TODO: Add dynamic error messages
                console.log("Authentication error: ", error);

                throw error;
            } finally {
                this.setState({ isLoading: false });
                // Reset cancel variable when done
                resetCancel();
            }
        };

        /**
         * Cancel BankID login request
         */
        cancelLogin = async () => {
            try {
                cancelRequest();
                return true;
            } catch (error) {
                console.log(error);
            } finally {
                // Clears access token and reset state
                Auth.logOut();
                this.setState({ isLoading: false });
            }
        };

        /**
         * Remove user from state, to be able to login as another user
         */
        resetUser = async () => {
            this.setState({ user: {} });
        };

        /**
         * Simulate login using fake user
         */
        _fakeLogin = async (personalNumber) => {
            try {
                const response = await bypassBankid(personalNumber);
                const { user } = response.data;

                try {
                    await Auth.logIn(
                        user,
                        FAKE_TOKEN
                    );
                } catch (e) {
                    // BY PASS REJECTION
                    // throw "Login failed";
                }

                return { user, FAKE_TOKEN };
            } catch (e) {
                throw (e);
            }
        }

        /**
         * Get user from async storage and add to state
         */
        _setUserAsync = async () => {
            try {
                const user = await StorageService.getData(USERKEY);
                if (typeof user !== 'undefined' && user !== null) {
                    this.setState({ user });
                    // Login the user automatically
                    this.loginUser(user.personalNumber);
                }
            } catch (error) {
                console.log("Something went wrong", error);
            }
        };

        /**
         * Check if BankID app is installed on this machine
         */
        _isBankidInstalled = async () => {
            const isBankidInstalled = await canOpenUrl('bankid:///');

            if (isBankidInstalled) {
                this.setState({ isBankidInstalled: true });
            }
        };

        render() {
            const { state, props, loginUser, cancelLogin, resetUser } = this;
            const instanceMethods = { loginUser, cancelLogin, resetUser };
            const injectProps = { ...instanceMethods, ...state };

            return (
                <WrappedComponent authentication={{ ...injectProps }} {...props} />
            )
        }
    };
}

export default withAuthentication;
