import React from 'react';
import {
    message,
    Form,
    Input,
    Button,
    DatePicker,
    Modal,
    TimePicker,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';

import {setAppointment} from '../../actions/queryActions';

const format = 'HH:mm';

class AppointmentForm extends React.Component {
    // constructor and state
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            hospital: '',
            venue: '',
            appointed_doc: '',
            appointed_date: '',
            appoint_time: '10:00',
        };
    }

    // Form field change handlers
    //
    handleChange = e => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value});
    };

    onDateChange = (date, dateString) => {
        this.setState({appointed_date: dateString});
    };

    onTimeChange = (time, timeString) => {
        console.log(time);
        this.setState({appointed_time: timeString});
    };

    // Modal handlers
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({loading: true});
        const form_data = _.pick(this.state, [
            'hospital',
            'appointed_doc',
            'appointed_date',
            'appoint_time',
            'venue',
        ]);

        setAppointment(form_data, this.props.match.params.id)
            .then(data => {
                this.props.update();
                this.setState({loading: false, visible: false});
                this.props.update();
            })
            .catch(e => {
                message.error(e.message);
            });
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    // render method
    render() {
        return (
            <div>
                <div>
                    <div>
                        <button
                            className="action__button btn btn--small"
                            onClick={this.showModal}>
                            Set Appointment
                        </button>
                        <Modal
                            visible={this.state.visible}
                            title="Give Prescription"
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" onClick={this.handleCancel}>
                                    Return
                                </Button>,
                                <Button
                                    key="submit"
                                    type="primary"
                                    loading={this.state.loading}
                                    onClick={this.handleOk}>
                                    Done
                                </Button>,
                            ]}>
                            <Form
                                layout="vertical"
                                onSubmit={this.handleSubmit}>
                                <Input
                                    type="text"
                                    placeholder="Hospital"
                                    onChange={this.handleChange}
                                    name="hospital"
                                />

                                <Input
                                    type="text"
                                    placeholder="Doctor"
                                    onChange={this.handleChange}
                                    name="appointed_doc"
                                />

                                <Input
                                    type="text"
                                    onChange={this.handleChange}
                                    placeholder="Venue"
                                    name="venue"
                                />

                                <DatePicker
                                    onChange={this.onDateChange}
                                    name="appointed_date"
                                />

                                <TimePicker
                                    defaultValue={moment('10:00', format)}
                                    format={format}
                                    onChange={this.onTimeChange}
                                    name="appoint_time"
                                />
                            </Form>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppointmentForm;
