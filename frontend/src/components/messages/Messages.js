import React from 'react';
import {Link} from 'react-router-dom';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import MessagesList from './MessagesList';

import _ from 'lodash';

import {getMessages, readAllMessages} from '../../actions/messageActions';

class QuickLinks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: null,
        };
    }

    clearMessages = () => {
        readAllMessages().then(data => {
        });
        this.listMessages();
    };

    getMessageCount = () => {
        return this.state.messages.filter(message => !message.read).length;
    };

    listMessages = () => {
        getMessages().then(data => {

            var grouped = _.mapValues(_.groupBy(data, 'query'), clist =>
                clist.map(list => _.omit(list, 'query')),
            );

            this.setState({
                messages: data,
                grouped,
            });
        });
    };

    componentDidMount() {
        this.listMessages();
        try {
            setInterval(async () => {
                await this.listMessages();
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
                            <Link to="/messages">
                                <i className=" material-icons">message</i>
                            </Link>
                            {this.state.messages &&
                                this.getMessageCount() !== 0 && (
                                    <span className="badge">
                                        {this.getMessageCount()}
                                    </span>
                                )}
                        </span>
                        <div className="window window--notification notification-window">
                            <div className="window__head">
                                <div className="window__head--icon">
                                    <i className=" material-icons">message</i>
                                </div>
                                <div className="window__head--text">
                                    Messages
                                </div>
                                <div className="window__head--button">
                                    <a onClick={this.clearMessages}>
                                        Clear all
                                    </a>
                                </div>
                            </div>

                            <div className="window__content">
                                <div className="shadow-layer">
                                    {this.state.messages && (
                                        <MessagesList
                                            notifications={this.state.messages}
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
                        <h1 className="heading-primary">Messages</h1>
                        <a onClick={this.clearMessages}>Clear all</a>

                        {this.state.messages && (
                            <MessagesList notifications={this.state.messages} />
                        )}
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
