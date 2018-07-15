import React from 'react';
import QueryHeader from './QueryHeader';
import Chat from '../chat/Chat';
import QueryCta from './QueryCta';
import {GridLoader} from 'react-spinners';

import {getUserInfo} from '../../utils/authUtils';
import {getQueryItem} from '../../actions/queryActions';
import {readNotificationsByQuery} from '../../actions/notificationActions';
import {readMessageByQuery} from '../../actions/messageActions';

import {message} from 'antd';

class QueryDetailComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            query: {},
            user: {},
        };

        this.updateQuery = this.updateQuery.bind(this);
    }

    updateQuery() {
        this.setState({loading: true});
        getQueryItem(this.props.match.params.id)
            .then(data => {
                getUserInfo(data.user).then(user => {
                    this.setState({
                        user,
                        nonFieldErrors: '',
                        query: data,
                        loading: false,
                    });
                });
            })
            .catch(e => {
                message.error('failed to load resource');
            });
    }

    componentDidMount() {
        this.updateQuery();
        readNotificationsByQuery(this.props.match.params.id);
        readMessageByQuery(this.props.match.params.id);
    }

    render() {
        return (
            <div style={{position: 'realtive'}}>
                <div className="loading-icon">
                    <GridLoader
                        style={{display: 'inline-block'}}
                        color={'#f0386b'}
                        loading={this.state.loading}
                    />
                </div>

                {!this.state.loading && (
                    <div>
                        <div className="query-layout">
                            <div className="query-layout__main">
                                <QueryHeader
                                    {...this.props}
                                    user={this.state.user}
                                    query={this.state.query}
                                    updateQuery={this.updateQuery}
                                />
                                <Chat id={this.state.query.id} />
                            </div>
                            <div className="query-layout__cta">
                                <QueryCta
                                    {...this.props}
                                    query={this.state.query}
                                    updateQuery={this.updateQuery}
                                    user={this.state.user}
                                    id={this.state.query.id}
                                    loading={this.state.loading}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default QueryDetailComponent;
