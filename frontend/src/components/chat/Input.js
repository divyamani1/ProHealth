import React from 'react';
import _ from 'lodash';

import {sendMessage} from '../../actions/chatActions';

class ChatInput extends React.Component {
    state = {message: ''};

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        const form_data = _.pick(this.state, ['message']);

        if (this.state.message) {
            sendMessage(this.props.query_id, form_data)
                .then(() => {
                    this.setState({message: ''});
                    this.props.fetchMessage();
                })
                .catch(e => {});
        }
    };

    render() {
        return (
            <form className="form" id="message-form">
                <input
                    name="message"
                    type="text"
                    placeholder="type your message here"
                    autoFocus
                    autoComplete="off"
                    value={this.state.message}
                    onChange={this.handleChange}
                />

                <button className="btn" onClick={this.handleSubmit}>
                    <div className="send-button material-icons">send</div>
                </button>
            </form>
        );
    }
}

export default ChatInput;
