import React from 'react';
import {Link} from 'react-router-dom';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import Notifications from './notifications/Notifications';
import Messages from './messages/Messages';

import {logoutUser} from '../actions/authActions';

class QuickLinks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
        };
    }

    logout = () => {
        this.props.dispatch(logoutUser(this.props.history));
    };

    render() {
        return (
            <div className="sidebar">
                {/* Show Sidebar icons only if user is Authenticated */}
                {this.props.isAuthenticated && (
                    <div className="sidebar__head">
                        <Notifications window={true} />
                        <Messages window={true} />
                    </div>
                )}

                <div className="sidebar__links">
                    {this.props.isAuthenticated && (
                        <Link to="/query/create" className="sidebar__link">
                            <i className="sidebar__icon icon ion-md-quote" />
                            <div className="sidebar__text">Ask A Question</div>
                        </Link>
                    )}
                    <Link className="sidebar__link" to="/news">
                        <i className="sidebar__icon material-icons">live_tv</i>
                        <div className="sidebar__text">News</div>
                    </Link>

                    {/*
                   
                    <div className="sidebar__link">
                        <i className="sidebar__icon material-icons">
                            directions_bike
                        </i>
                        <div className="sidebar__text">Health Tips</div>
                    </div>
                    <div className="sidebar__link">
                        <i className="sidebar__icon icon ion-md-analytics" />
                        <div className="sidebar__text">Health Stats</div>
                    </div>
                    <div className="sidebar__link">
                        <i className="sidebar__icon icon ion-ios-paper-plane" />
                        <div className="sidebar__text">Contact</div>
                    </div>
                            */}
                    {this.props.isAuthenticated && (
                        <Link
                            className="sidebar__link"
                            to="/"
                            onClick={this.logout}>
                            <i className="sidebar__icon icon ion-md-log-out" />
                            <div className="sidebar__text">Logout</div>
                        </Link>
                    )}
                </div>
            </div>
        );
    }
}

QuickLinks.propTypes = {
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

export default withRouter(connect(mapStateToProps)(QuickLinks));
