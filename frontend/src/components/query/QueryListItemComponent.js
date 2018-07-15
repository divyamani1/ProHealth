import React from 'react';
import moment from 'moment';
import {Link, withRouter} from 'react-router-dom';

import {deleteQueryItem} from '../../actions/queryActions';

const QueryListItemComponent = props => {
    const deleteButton = (
        <div
            className="list-item__action--icon"
            onClick={e => {
                deleteQueryItem(props.item.id).then(data => {
                    props.updateQueries();
                });
            }}>
            <i className=" material-icons">delete</i>
        </div>
    );

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


    const editButton = (
        <div
            className="list-item__action--icon"
            onClick={e => {
                props.history.push(`/query/${props.item.id}/update`);
            }}>
            <i className=" material-icons">edit</i>
        </div>
    );

    const detailsButton = (
        <div className="list-item__action--icon">
            <Link to={`/query/${props.item.id}`}>
                <i className=" material-icons">more</i>
            </Link>
        </div>
    );

    return (
        <div>
            <div className="list-item query-list__item">
                <div className="list-item__title">
                    <Link to={`/query/${props.item.id}`}>
                        {props.item.title_problem}
                    </Link>
                </div>

                <div className="list-item__content">
                    {props.item.description}
                    {props.header && (
                        <div style={{marginTop: '1rem'}}>
                            <h4 style={{margin: 0}}>
                                Posted by
                                {'  '}
                                <small>
                                    {props.user.first_name +
                                        ' ' +
                                        props.user.last_name}
                                </small>
                            </h4>
                        </div>
                    )}
                    <h4>
                        Created{'   '}
                        <small>
                            {moment(props.item.date_of_submission).fromNow()}
                        </small>
                    </h4>
                    <span className="tag">{sp_map[props.item.tag]}</span>
                </div>

                {!props.header && (
                    <div className="list-item__action">
                        {detailsButton}
                        {editButton}
                        {deleteButton}
                    </div>
                )}
            </div>
        </div>
    );
};

export default withRouter(QueryListItemComponent);
