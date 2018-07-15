import React from 'react';

import {createQuery} from '../../actions/queryActions';

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

            formErrors: {},
            nonFieldErrors: '',
            formValid: true,
        };
    }

    // state change and management
    //
    //
    handleCancel = () => this.setState({previewVisible: false});

    handleChange = e => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value});
    };

    handleCheckbox = e => {
        console.log(e);
        this.setState({is_doctor: e.target.checked});
    };

    handleSelectChange = value => {
        this.setState({tag: value});
    };

    // form submittion
    //
    handleSubmit = event => {
        event.preventDefault();
        const form_data = {
            title_problem: this.state.title_problem,
            description: this.state.description,
            name_of_patient: this.state.name_of_patient,
            age_of_patient: this.state.age_of_patient,
            weight_of_patient: this.state.weight_of_patient,
            height_of_patient: this.state.height_of_patient,
            tag: this.state.tag,
        };
        createQuery(form_data)
            .then(data => {
                const id = data.id;
                this.props.history.push('/query/' + id);
            })
            .catch(e => {
                message.error(e.message);
            });
    };

    componentDidMount() {
        return;
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
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form__group">
                            <label>Description</label>
                            <textarea
                                placeholder="Description"
                                name="description"
                                className="form__description"
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form__group">
                            <label>Related</label>
                            <Select
                                showSearch
                                style={{width: 200}}
                                placeholder="Related"
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
                                <input
                                    placeholder="Name of Patient"
                                    name="name_of_patient"
                                    onChange={this.handleChange}
                                />
                            </div>

                            <div className="patient-stats__data">
                                <div className="form__group">
                                    <input
                                        placeholder="Age"
                                        name="age_of_patient"
                                        type="number"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form__group">
                                    <input
                                        placeholder="Weight"
                                        name="weight_of_patient"
                                        type="number"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form__group">
                                    <input
                                        placeholder="Height"
                                        name="height_of_patient"
                                        type="number"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={this.handleSubmit}
                            type="submit"
                            className="btn">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default QueryCreateComponent;
