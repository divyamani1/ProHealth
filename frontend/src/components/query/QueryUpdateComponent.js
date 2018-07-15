import React from 'react';
import _ from 'lodash';

import {updateQueryItem, getQueryItem} from '../../actions/queryActions';

import {message, Select} from 'antd';

// import validate from '../../utils/validate';

const Option = Select.Option;

class QueryCreateComponent extends React.Component {
    // constructor and state initialization

    constructor(props) {
        super(props);

        this.state = {
            // form input  stuff
            title_problem: '',
            description: '',
            name_of_patient: '',
            age_of_patient: '',
            weight_of_patient: '',
            height_of_patient: '',
            tag: '',
            query_id: this.props.match.params.id,

            // image-upload stuff
            previewVisible: false,
            previewImage: '',
            fileList: [],

            formErrors: {},
            nonFieldErrors: '',
            formValid: true,
        };
    }

    // state change and management

    handleChange = e => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value});
    };

    handleSelectChange = value => {
        this.setState({tag: value});
    };

    // form submittion
    //
    handleSubmit = event => {
        event.preventDefault();
        const form_data = _.pick(this.state, [
            'title_problem',
            'description',
            'name_of_patient',
            'age_of_patient',
            'weight_of_patient',
            'height_of_patient',
            'tag',
        ]);
        updateQueryItem(form_data, this.state.id)
            .then(data => {
                const id = data.id;
                this.props.history.push('/query/' + id);
            })
            .catch(e => {
                message.error(e.message);
            });
    };

    resizeIt = () => {
        var txt = document.getElementById('description-text');
        var str = txt.value;
        var cols = txt.cols;

        var linecount = 0;
        _(str.split('\n')).forEach(l => {
            linecount += Math.ceil(l.length / cols); // Take into account long lines
        });

        linecount = str.split('\n').length
        txt.rows = linecount + 1;
    };

    componentDidMount() {
        // You could attach to keyUp, etc. if keydown doesn't work
        var txt = document.getElementById('description-text');
        txt.rows = 5;
        //txt.addEventListener('keydown', this.resizeIt);

        // this.resizeIt();

        getQueryItem(this.props.match.params.id)
            .then(data => {
                this.setState({...data});
            })
            .catch(e => {
                message.error('unable to load resources');
            });
    }

    render() {
        return (
            <div className="section section--form section--form--wide">
                <div className="card">
                    <h1 className="heading-primary u-margin-top-small">
                        Ask A Question
                    </h1>
                    <form className="form" onSubmit={this.handleSubmit}>
                        {this.state.nonFieldErrors && (
                            <div className="form__error">
                                <h3 className="form__error--title">Error</h3>
                                <p className="form__error--text">
                                    {this.props.errorMessage}
                                </p>
                            </div>
                        )}

                        <div className="form__group">
                            <label>Title</label>
                            <input
                                placeholder="Title"
                                type="text"
                                name="title_problem"
                                value={this.state.title_problem}
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className="form__group">
                            <label>Description</label>
                            <textarea
                                id="description-text"
                                placeholder="Description"
                                name="description"
                                value={this.state.description}
                                autosize
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className="form__group">
                            <label>Related</label>
                            <br />
                            <Select
                                showSearch
                                style={{width: 200}}
                                placeholder="Related"
                                value={this.state.tag}
                                onChange={this.handleSelectChange}>
                                <Option value='S' >General Surgery</Option>
                                <Option value='G' >Obesterics and Gynecology</Option>
                                <Option value='P' >General Physician</Option>
                                <Option value='Or'>Orthopedic</Option>
                                <Option value='D' >Dermatology & Venerology</Option>
                                <Option value='A' >Anesthesiology</Option>
                                <Option value='N' >Nephrology</Option>
                                <Option value='Ps'>Psychiatry</Option>
                                <Option value='M' >General Medicine</Option>
                                <Option value='On'>Oncology</Option>
                                <Option value='Pd'>Paediatrics</Option>
                                <Option value='E' >Ear Nose Throat</Option>
                                <Option value='O' >Opthalmology</Option>
                                <Option value='De'>Dental Surgeon</Option>
                                <Option value='T' >Physiotherapy</Option>
                            </Select>
                        </div>

                        <div className="patient-stats">
                            <h3>Patient Stats</h3>

                            <div className="form__group">
                                <label>Name of Patient</label>
                                <input
                                    placeholder="Name of Patient"
                                    name="name_of_patient"
                                    value={this.state.name_of_patient}
                                    onChange={this.handleChange}
                                />
                            </div>

                            <div className="patient-stats__data">
                                <div className="form__group">
                                    <label>Age Of Patient</label>
                                    <input
                                        placeholder="Age of Patient"
                                        name="age_of_patient"
                                        type="number"
                                        value={this.state.age_of_patient}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form__group">
                                    <label>Weight of Patient</label>
                                    <input
                                        placeholder="Weight of Patient"
                                        name="weight_of_patient"
                                        value={this.state.weight_of_patient}
                                        type="number"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form__group">
                                    <label>Height of Patient</label>
                                    <input
                                        placeholder="Height of Patient"
                                        name="height_of_patient"
                                        value={this.state.height_of_patient}
                                        type="number"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <button

                            type="primary"
                            htmlType="submit"
                            className="login-form-button btn btn--default">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default QueryCreateComponent;
