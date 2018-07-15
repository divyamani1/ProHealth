import React from 'react';

import QueryListItemComponent from './QueryListItemComponent';

import {getQueries, getTakenQueries} from '../../actions/queryActions';

import {GridLoader} from 'react-spinners';

class MyQueriesComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query_list: [],
            loading: false,
            is_doctor: localStorage.getItem('is_doctor') === 'true',
        };
    }

    updateQueries = () => {
        this.setState({loading: true});

        if (!this.state.is_doctor) {
            getQueries()
                .then(data => {
                    this.setState({
                        nonFieldErrors: '',
                        loading: false,
                        query_list: data,
                    });
                })
                .catch(error => {
                    this.setState({nonFieldErrors: error.message});
                });
        } else {
            getTakenQueries()
                .then(data => {
                    this.setState({
                        nonFieldErrors: '',
                        loading: false,
                        query_list: data,
                    });
                })
                .catch(error => {
                    this.setState({nonFieldErrors: error.message});
                });
        }
    };

    componentDidMount() {
        this.updateQueries();
    }

    render() {
        return (
            <div style={{position: 'realtive'}}>

                {!this.state.is_doctor &&
                <h1 className="heading heading-primary">Questions you Asked</h1>
                }
                {this.state.is_doctor &&
                <h1 className="heading heading-primary">Your Questions</h1>
                }
                <div className="loading-icon">
                    <GridLoader
                        color={'#3772ff'}
                        loading={this.state.loading}
                    />
                </div>
                {this.state.query_list && (
                    <div>
                        {!this.state.loading && (
                            <div className="query-list">
                                {this.state.query_list.map(item => (
                                    <QueryListItemComponent
                                        updateQueries={this.updateQueries}
                                        key={item.id}
                                        item={item}
                                        header={false}
                                        loading={this.state.loading}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default MyQueriesComponent;
