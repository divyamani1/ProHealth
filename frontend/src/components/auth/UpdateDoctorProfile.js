import React, {Component} from 'react';
import _ from 'lodash';
import {message, Icon, Input, Select, Alert} from 'antd';
import {updateDoctorProfile} from '../../actions/authActions';

const Option = Select.Option;
const {TextArea} = Input;

class UpdateDoctorProfile extends Component {
    // constructor and state initialization
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            showForm: false,

            hospital: '',
            qualification: '',
            description: '',
            speciality: '',
            photo_doc: {},
            document1: {},
            nmc_code: '',

            formErrors: {},
            nonFieldErrors: '',
            formValid: true,
        };
    }

    // state change and management
    //
    handleSelectChange = value => {
        this.setState({speciality: value});
    };

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleFileChange = e => {
        // console.log(e.target.files);
        this.setState({[e.target.name]: e.target.files[0]});
    };
    // form submittion

    handleSubmit = event => {
        event.preventDefault();
        const data = _.pick(this.state, [
            'hospital',
            'qualification',
            'description',
            'speciality',
            'nmc_code',
        ]);

        var form_data = new FormData();

        // convert js object to formdata
        for (var key in data) {
            form_data.append(key, data[key]);
        }

        // append files to formdata
        //
        //
        if (!this.state.user.doctor_profile.is_verified) {
            if (this.state.photo_doc) {
                form_data.append(
                    'photo_doc',
                    this.state.photo_doc,
                    this.state.photo_doc.name,
                );
            }

            if (this.state.document1) {
                form_data.append(
                    'document1',
                    this.state.document1,
                    this.state.document1.name,
                );
            }
        }
        // submit
        //
        for (var k in form_data) {
            console.log(k, form_data[k]);
        }
        updateDoctorProfile(this.state.user.doctor_profile.id, form_data)
            .then(({data, response}) => {
                if (response.ok) {
                    console.log(response);
                    message.success('profile updated successfully!');
                    this.props.updateUser().then(() => {
                        // this.props.tabChange('user');
                    });
                } else {
                    this.setState({formErrors: data});
                }
            })
            .catch(e => console.log(e));
    };

    renderError = key => {
        if (this.state.formErrors[key]) {
            return this.state.formErrors[key].map(e => (
                <li
                    style={{color: 'orangered', listStyle: 'none'}}
                    key={Math.random()}>
                    {e}
                </li>
            ));
        }
    };

    componentDidMount() {
        this.props.updateUser().then(data => {
            this.setState({...data.doctor_profile, user: data});
        });
    }

    toggleForm = () => {
        this.setState(prevState => ({showForm: !prevState.showForm}));
    };

    render() {
        let {is_verified, pending_verification} =
            this.state.user.doctor_profile || {};

        return (
            <div>
                {pending_verification && (
                    <div
                        class="info-box"
                        style={{
                            textAlign: 'center',
                            border: '1px solid #777',
                            padding: '1rem',
                        }}>
                        Your Volunteer request is being reviewed by out staffs
                        <br />
                        you can still update your submission until your profile
                        is verified
                    </div>
                )}

                {!is_verified && (
                    <div style={{textAlign: 'center'}}>
                        <h2 className="heading-secondary">Become a doctor</h2>

                        <div>
                            <p>
                                Join our Volunteer program to help the
                                underpriviledged community to get better health
                                cate oppertunities
                            </p>

                            {!this.state.showForm && (
                                <button
                                    className="btn"
                                    onClick={this.toggleForm}>
                                    {pending_verification && (
                                        <span>Edit Submission</span>
                                    )}
                                    {!pending_verification && (
                                        <span>Start Now</span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {is_verified && (
                    <div>
                        <h2 className="heading-secondary">Update Profile</h2>
                    </div>
                )}

                {(this.state.showForm || is_verified) && (
                    <div className="u-margin-bottom-small">
                        <div>
                            {!true && (
                                <div className="u-margin-bottom-small">
                                    <Alert
                                        message="error"
                                        type="error"
                                        showIcon
                                        description={'error message'}
                                    />
                                </div>
                            )}
                            <div className="section section--profile">
                                <form
                                    className="form"
                                    onSubmit={this.handleSubmit}>
                                    <div className="form__group">
                                        <label>Speciality</label>
                                        {this.renderError('speciality')}
                                        <Select
                                            showSearch
                                            style={{width: 200}}
                                            placeholder="Speciality"
                                            name="speciality"
                                            value={this.state.speciality}
                                            onChange={this.handleSelectChange}>
                                            <Option value="S">
                                                General Surgery
                                            </Option>
                                            <Option value="G">
                                                Obesterics and Gynecology
                                            </Option>
                                            <Option value="P">
                                                General Physician
                                            </Option>
                                            <Option value="Or">
                                                Orthopedic
                                            </Option>
                                            <Option value="D">
                                                Dermatology & Venerology
                                            </Option>
                                            <Option value="A">
                                                Anesthesiology
                                            </Option>
                                            <Option value="N">
                                                Nephrology
                                            </Option>
                                            <Option value="Ps">
                                                Psychiatry
                                            </Option>
                                            <Option value="M">
                                                General Medicine
                                            </Option>
                                            <Option value="On">Oncology</Option>
                                            <Option value="Pd">
                                                Paediatrics
                                            </Option>
                                            <Option value="E">
                                                Ear Nose Throat
                                            </Option>
                                            <Option value="O">
                                                Opthalmology
                                            </Option>
                                            <Option value="De">
                                                Dental Surgeon
                                            </Option>
                                            <Option value="T">
                                                Physiotherapy
                                            </Option>
                                        </Select>
                                    </div>

                                    <div className="form__group">
                                        <label>Hospital</label>
                                        {this.renderError('hospital')}
                                        <input
                                            placeholder="Hospital"
                                            type="text"
                                            name="hospital"
                                            value={this.state.hospital}
                                            onChange={this.handleChange}
                                        />
                                    </div>

                                    <div className="form__group">
                                        <label>Bio</label>
                                        {this.renderError('description')}
                                        <TextArea
                                            prefix={<Icon type="user" />}
                                            placeholder="Bio"
                                            value={this.state.description}
                                            autosize
                                            type="text"
                                            name="description"
                                            onChange={this.handleChange}
                                        />
                                    </div>

                                    <div className="form__group">
                                        <label>Qualification</label>
                                        {this.renderError('qualification')}
                                        <input
                                            placeholder="Qualification"
                                            type="text"
                                            value={this.state.qualification}
                                            name="qualification"
                                            onChange={this.handleChange}
                                        />
                                    </div>

                                    {!is_verified && (
                                        <div>
                                            <div className="form__group">
                                                <label>NMC Code</label>
                                                {this.renderError('nmc_code')}
                                                <input
                                                    placeholder="NMC Code"
                                                    type="text"
                                                    value={this.state.nmc_code}
                                                    name="nmc_code"
                                                    onChange={this.handleChange}
                                                />
                                            </div>

                                            <div className="form__group">
                                                <div className="upload-btn-wrapper">
                                                    <button className="btn btn--default btn--small">
                                                        Select A Document Photo
                                                    </button>
                                                    <input
                                                        type="file"
                                                        name="photo_doc"
                                                        onChange={
                                                            this
                                                                .handleFileChange
                                                        }
                                                        className="photos__input__field btn btn--default btn--small"
                                                    />
                                                    {this.state.photo_doc && (
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    '.7rem',
                                                                color: 'black',
                                                            }}>
                                                            {
                                                                this.state
                                                                    .photo_doc
                                                                    .name
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="form__group">
                                                <div className="upload-btn-wrapper">
                                                    <button className="btn btn--default btn--small">
                                                        Select A Document
                                                    </button>
                                                    <input
                                                        type="file"
                                                        onChange={
                                                            this
                                                                .handleFileChange
                                                        }
                                                        name="document1"
                                                        className="photos__input__field btn btn--default btn--small"
                                                    />
                                                    {this.state.document1 && (
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    '.7rem',
                                                                color: 'black',
                                                            }}>
                                                            {
                                                                this.state
                                                                    .document1
                                                                    .name
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="form__group">
                                        <button
                                            type="submit"
                                            disabled={!this.state.formValid}
                                            className="btn ">
                                            Submit
                                        </button>
                                    </div>

                                    {!is_verified &&
                                        this.state.showForm && (
                                            <div className="form__group">
                                                <button
                                                    type="submit"
                                                    onClick={this.toggleForm}
                                                    className="btn btn--danger ">
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default UpdateDoctorProfile;
