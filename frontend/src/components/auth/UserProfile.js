import React from 'react';

import moment from 'moment';

import DoctorProfile from './DoctorProfile';
import {GridLoader} from 'react-spinners';

const UserProfile = props => {
    let loading = true;
    loading = props.loading;
    const {user} = props;

    return (
        <div>
            <div style={{width: '100%', textAlign: 'center'}}>
                <GridLoader
                    style={{display: 'inline-block'}}
                    color={'#3772ff'}
                    loading={loading}
                />
            </div>
            {!loading &&
                user && (
                    <div>
                        <div className="profile">
                            <div className="profile__user">
                                <div className="profile__photo">
                                    <img
                                        style={{height: 200}}
                                        src={user.user_profile.profile_photo}
                                        alt="User"
                                    />
                                </div>
                                <h2 className="profile__user--name">
                                    {user.first_name} {user.last_name}
                                </h2>
                                <h3 className="profile__user--email">
                                    {user.email}
                                </h3>

                                <div className="profile__items">
                                    <div className="profile__item">
                                        <div className="profile__item--icon">
                                            <i className="icon--normal material-icons">
                                                keyboard_arrow_right
                                            </i>
                                        </div>
                                        <div className="profile__item--text">
                                            Joined on 13th may 2013
                                        </div>
                                    </div>

                                    {user.date_of_birth && (
                                        <div className="profile__item">
                                            <div className="profile__item--icon">
                                                <i className="icon--normal material-icons">
                                                    keyboard_arrow_right
                                                </i>
                                            </div>
                                            <div className="profile__item--text">
                                                Born on{' '}
                                                {moment(
                                                    user.date_of_birth,
                                                ).format('DD MMM, YYYY')}
                                            </div>
                                        </div>
                                    )}
                                    <div className="profile__item">
                                        <div className="profile__item--icon">
                                            <i className="icon--normal material-icons">
                                                keyboard_arrow_right
                                            </i>
                                        </div>
                                        <div className="profile__item--text">
                                            Gender:{' '}
                                            {user.gender === 'M'
                                                ? 'Male'
                                                : 'Female'}
                                        </div>
                                    </div>
                                </div>
                                <p />
                            </div>

                            {props.user.is_doctor && (
                                <div className="profile__doctor">
                                    <DoctorProfile user={user} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
};

export default UserProfile;
/*
src={ROOT_URL + user.user_profile.profile_photo}
* */
