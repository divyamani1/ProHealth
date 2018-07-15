import React from 'react';

import PrescriptionForm from './PrescriptionForm';
import Prescription from './Prescription';
import Appointment from './Appointment';
import Actions from './Actions';
import {getPescription} from '../../actions/queryActions';
import {GridLoader} from 'react-spinners';
import {getUserById} from '../../actions/authActions';

// TODO: doctor status from localstorage
//
// const is_doctor = false;
class QueryCta extends React.Component {
    state = {
        prescription: null,
        loading: false,
        doctor: null,
    };

    updatePescription = () => {
        this.setState({loading: true});
        getPescription(this.props.id)
            .then(data => {
                if (data) {
                    this.setState({prescription: data, loading: false});
                }
                if (this.props.query.taken && this.props.query.taken_by) {
                    getUserById(this.props.query.taken_by).then(data => {
                        this.setState({doctor: data});
                    });
                }
            })
            .catch(e => {
                this.setState({loading: false})
            });
    };

    componentDidMount() {
        if (this.props.id) {
            this.updatePescription();
        }
    }

    render() {
        const is_doctor = localStorage.getItem('is_doctor') === 'true';
        const user_id = parseInt(localStorage.getItem('user_id'), 10);
        return (
            <div style={{height: '80vh', overflowY: 'scroll', position: 'relative'}}>
                <div className="loading-icon">
                    <GridLoader
                        style={{display: 'inline-block'}}
                        color={'#f0386b'}
                        loading={this.props.query.taken && this.state.loading}
                    />
                </div>
                {!this.props.loading && (
                    <div>
                        <Actions {...this.props} doctor={this.state.doctor} />
                        <Prescription
                            {...this.props}
                            prescription={this.state.prescription}
                            updatePescription={this.updatePescription}
                            loading={this.state.loading}
                            is_doctor={is_doctor}
                        />
                        {is_doctor &&
                            this.props.query &&
                            !this.props.query.resolved &&
                            this.props.query.taken_by === user_id &&
                            !(this.props.user.id === user_id) && (
                                <PrescriptionForm
                                    {...this.props}
                                    prescription={this.state.prescription}
                                    updatePescription={this.updatePescription}
                                    loading={this.state.loading}
                                    id={this.props.id}
                                />
                            )}
                        <Appointment
                            {...this.props}
                            user={this.props.user}
                            id={this.props.id}
                        />
                    </div>
                )}
            </div>
        );
    }
}
export default QueryCta;
