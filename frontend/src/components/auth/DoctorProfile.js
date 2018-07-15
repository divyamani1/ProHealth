import React from 'react';

const DoctorProfile = props => {
    const {user} = props;
    const {doctor_profile} = user;

    const sp_map = {
        S: 'General Surgery',
        G: 'Obesterics and Gynecology',
        P: 'General Physician',
        Or: 'Orthopedic',
        D: 'Dermatology & Venerology',
        A: 'Anesthesiology',
        N: 'Nephrology',
        Ps: 'Psychiatry',
        M: 'General Medicine',
        On: 'Oncology',
        Pd: 'Paediatrics',
        E: 'Ear Nose Throat',
        O: 'Opthalmology',
        De: 'Dental Surgeon',
        T: 'Physiotherapy',
    };

    return (
        <div className="profile__items">
            <h2 className="profile__user--name" style={{textAlign: 'left'}}>
                {user.first_name} {user.last_name}
            </h2>
            <h3>{doctor_profile.qualification}</h3>
            <div className="profile__item">
                <div className="profile__item--icon">
                    <i className="icon--normal material-icons">place</i>
                </div>
                <div className="profile__item--text">Pokhara</div>
            </div>
            <div className="profile__item">
                <div className="profile__item--icon">
                    <i className="icon--normal material-icons">my_location</i>
                </div>
                <div className="profile__item--text">
                    {sp_map[doctor_profile.speciality]}
                </div>
            </div>
            <div className="profile__item">
                <div className="profile__item--icon">
                    <i className="icon--normal material-icons">star</i>
                </div>
                <div className="profile__item--text">
                    {doctor_profile.exp || 0}
                </div>
            </div>
            <div className="profile__item">
                <div className="profile__item--icon">
                    <i className="icon--normal material-icons">
                        local_hospital
                    </i>
                </div>
                <div className="profile__item--text">
                    {doctor_profile.hospital}
                </div>
            </div>

            {doctor_profile.description}
        </div>
    );
};

export default DoctorProfile;
