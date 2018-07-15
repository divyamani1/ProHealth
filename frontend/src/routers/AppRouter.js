import React from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {message} from 'antd';
import {GridLoader} from 'react-spinners';

import LoginComponent from '../components/auth/LoginComponent';
import SignupComponent from '../components/auth/SignupComponent';
import UpdatePassword from '../components/auth/UpdatePassword';
import ResetPassword from '../components/auth/ResetPassword';
import Profile from '../components/auth/Profile';
import ResetPasswordUpdate from '../components/auth/ResetPasswordUpdate';
import ActivatingAccount from '../components/auth/ActivatingAccount';
import UpdateDoctorProfile from '../components/auth/UpdateDoctorProfile';

import QueryCreateComponent from '../components/query/QueryCreateComponent';
import QueryUpdateComponent from '../components/query/QueryUpdateComponent';
import QueryDetailComponent from '../components/query/QueryDetailComponent';
import MyQueriesComponent from '../components/query/MyQueriesComponent';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer.js';
import DashboardPage from '../components/DashboardPage';
import FeaturePage from '../components/FeaturePage';
import NotFoundPage from '../components/NotFoundPage';

import NotificationsPage from '../components/notifications/NotificationsPage';
import MessagesPage from '../components/messages/MessagesPage';

import News from '../components/News';

import {connect} from 'react-redux';

import RequireAuth from './RequireAuth';
import RequireNoAuth from './RequireNoAuth';

const PrivateRoute = ({component: Component, auth, ...rest}) => {
    if (!auth) message.error('you must be logged in');
    return (
        <Route
            {...rest}
            render={props =>
                auth ? <Component {...props} /> : <Redirect to="/user/login" />
            }
        />
    );
};

class AppRouter extends React.Component {
    render() {
        const {dispatch} = this.props;

        return (
            <div>
                {this.props.loading && (
                    <div>
                        <div className="loading-icon">
                            <GridLoader
                                style={{display: 'inline-block'}}
                                color={'#f0386b'}
                                loading={this.props.loading}
                            />
                        </div>
                        <span className="loading-text">
                            Checking if you are authenticated
                        </span>
                    </div>
                )}


                {!this.props.loading && (
                    <BrowserRouter>
                        <div>
                            <Header dispatch={dispatch} />
                            <div className="container">
                                <Sidebar dispatch={dispatch} />
                                <div
                                    className="main-content"
                                    style={{position: 'relative'}}>
                                    <Switch>
                                        <Route
                                            path="/"
                                            component={DashboardPage}
                                            exact={true}
                                        />

                                        <Route
                                            path="/user/login"
                                            render={props => {
                                                return (
                                                    <LoginComponent
                                                        {...props}
                                                        dispatch={dispatch}
                                                    />
                                                );
                                            }}
                                        />

                                        <Route
                                            path="/user/signup"
                                            component={RequireNoAuth(props => {
                                                return (
                                                    <SignupComponent
                                                        {...props}
                                                        dispatch={dispatch}
                                                    />
                                                );
                                            })}
                                        />

                                        <Route
                                            path="/reset-password"
                                            auth={this.props.isAuthenticated}
                                            component={ResetPassword}
                                            exact
                                        />

                                        <Route
                                            path="/reset-password/:code"
                                            auth={this.props.isAuthenticated}
                                            component={ResetPasswordUpdate}
                                        />

                                        <Route
                                            path="/users/activate/:code"
                                            auth={this.props.isAuthenticated}
                                            component={ActivatingAccount}
                                        />

                                        <PrivateRoute
                                            path="/update-password"
                                            auth={this.props.isAuthenticated}
                                            component={UpdatePassword}
                                        />
                                        <PrivateRoute
                                            path="/query"
                                            exact
                                            auth={this.props.isAuthenticated}
                                            component={RequireAuth(
                                                MyQueriesComponent,
                                            )}
                                        />
                                        <PrivateRoute
                                            path="/query/create"
                                            auth={this.props.isAuthenticated}
                                            component={QueryCreateComponent}
                                        />
                                        <PrivateRoute
                                            path="/query/:id/update"
                                            auth={this.props.isAuthenticated}
                                            component={QueryUpdateComponent}
                                        />
                                        <PrivateRoute
                                            path="/query/:id"
                                            exact
                                            auth={this.props.isAuthenticated}
                                            component={QueryDetailComponent}
                                        />

                                        <PrivateRoute
                                            path="/query/:id/edit"
                                            auth={this.props.isAuthenticated}
                                            component={QueryCreateComponent}
                                        />

                                        <PrivateRoute
                                            path="/profile/:action"
                                            auth={this.props.isAuthenticated}
                                            component={Profile}
                                        />

                                        <Route path="/news" component={News} />

                                        <PrivateRoute
                                            path="/notifications"
                                            auth={this.props.isAuthenticated}
                                            component={NotificationsPage}
                                        />

                                        <PrivateRoute
                                            path="/messages"
                                            auth={this.props.isAuthenticated}
                                            component={MessagesPage}
                                        />

                                        <PrivateRoute
                                            path="/become-a-doctor"
                                            auth={this.props.isAuthenticated}
                                            component={UpdateDoctorProfile}
                                        />

                                        <Route
                                            path="/feature"
                                            component={FeaturePage}
                                        />

                                        <Route component={NotFoundPage} />
                                    </Switch>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    </BrowserRouter>
                )}
            </div>
        );
    }
}

AppRouter.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
    const {auth} = state;
    const {isAuthenticated, errorMessage} = auth;

    return {
        isAuthenticated,
        errorMessage,
    };
};

export default connect(mapStateToProps)(AppRouter);
