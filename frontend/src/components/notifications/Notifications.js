import React from 'react';
import {Link} from 'react-router-dom';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import NotificationsList from './NotificationsList';

import {
    getNotifications,
    readAllNotifications,
} from '../../actions/notificationActions';

class QuickLinks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
        };
    }

    clearNotifications = () => {
        readAllNotifications().then(data => {
            console.log(data);
        });
        this.listNotifications();
    };

    getNotificationCount = () => {
        return this.state.notifications.filter(n => !n.viewed).length;
    };

    listNotifications = () => {
        getNotifications().then(data => {
            this.setState({
                notifications: data,
            });
        });
    };

    getClassName = notifications => {
        return notifications.viewed
            ? 'list-item list-item--notification'
            : 'list-item list-item--notification list-item--selected';
    };

    componentDidMount() {
        this.listNotifications();
        try {
            setInterval(async () => {
                await this.listNotifications();
            }, 3000);
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <div>
                {this.props.window && (
                    <div className="sidebar__head--icon sidebar__head--icon--notification">
                        <span className="icon--badge">
                            <Link to="/notifications">
                                <i className=" material-icons">notifications</i>
                            </Link>
                            {this.state.notifications &&
                                this.getNotificationCount() !== 0 && (
                                    <span className="badge">
                                        {this.getNotificationCount()}
                                    </span>
                                )}
                        </span>
                        <div className="window window--notification notification-window">
                            <div className="window__head">
                                <div className="window__head--icon">
                                    <i className=" material-icons">
                                        notifications
                                    </i>
                                </div>
                                <div className="window__head--text">
                                    Notifications
                                </div>
                                <div className="window__head--button">
                                    <a onClick={this.clearNotifications}>
                                        Clear all
                                    </a>
                                </div>
                            </div>

                            <div className="window__content">
                                <div className="shadow-layer">
                                    {this.state.notifications && (
                                        <NotificationsList
                                            notifications={
                                                this.state.notifications
                                            }
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="window__footer">
                                <Link to="/notifications">see all</Link>
                            </div>
                        </div>
                    </div>
                )}

                {!this.props.window && (
                    <div>
                        <h1 className="heading-primary">Notifications</h1>
                        <a onClick={this.clearNotifications}>Clear all</a>

                        <NotificationsList
                            notifications={this.state.notifications}
                        />
                    </div>
                )}
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

export default connect(mapStateToProps)(QuickLinks);
