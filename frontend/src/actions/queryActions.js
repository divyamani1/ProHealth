import {QueryUrls} from '../constants/urls';

// return configuration for api according to data and type of request
//
export const apiConfig = (type = 'get', data = null) => {
    return {
        method: type.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: data ? JSON.stringify(data) : null,
    };
};

// API request for creating new query
//
export const createQuery = form_data => {
    return fetch(QueryUrls.USER_QUERY, apiConfig('post', form_data))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                Promise.reject(Error('Unable to Create Query'));
            }
        })
        .catch(e => {
            Promise.reject(e.message);
        });
};

// API request for fetching all querys
//
export const getQueries = () => {
    return fetch(QueryUrls.USER_QUERY, apiConfig())
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                Promise.reject(Error('Unable to get Queries'));
            }
        })
        .catch(e => {
            Promise.reject(e.message);
        });
};


export const getTakenQueries = () => {
    return fetch(QueryUrls.TAKEN_QUERIES, apiConfig())
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                Promise.reject(Error('Unable to get Queries'));
            }
        })
        .catch(e => {
            Promise.reject(e.message);
        });
};


// API request for fetching one query item
//
export const getQueryItem = id => {
    return fetch(QueryUrls.USER_QUERY + id, apiConfig())
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                Promise.reject(Error('unable to fetch query'));
            }
        })
        .catch(e => {
            Promise.reject(e.message);
        });
};

// API request for updating one query item
//
export const updateQueryItem = (form_data, id) => {
    return fetch(QueryUrls.USER_QUERY + id, apiConfig('patch', form_data))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                Promise.reject(Error('unable to update query'));
            }
        })
        .catch(e => {
            Promise.reject(e.message);
        });
};

// API request for deleting one query item
//
export const deleteQueryItem = id => {
    return fetch(QueryUrls.USER_QUERY + id, apiConfig('delete'))
        .then(response => {
            if (response.ok) {
                return;
            } else {
                Promise.reject(Error('unable to delete query'));
            }
        })
        .catch(e => {
            Promise.reject(e.message);
        });
};

// Api request for creating new appointment item for a query
//
export const setAppointment = (form_data, id) => {
    return fetch(QueryUrls.APPOINTMENT(id), apiConfig('post', form_data))
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                Promise.reject(Error('unable to set Appointment'));
            }
        })
        .catch(e => {
            Promise.reject(Error('failed to post resources'));
        });
};

// API request for fetching appointment of a query
//
export const getAppointment = id => {
    return fetch(QueryUrls.APPOINTMENT(id), apiConfig())
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                Promise.reject(Error('unable to load appointment'));
            }
        })
        .catch(e => {
            Promise.reject(e.message);
        });
};

// API request for creating pescription for a query item
//
export const pescribe = (form_data, id) => {
    return fetch(QueryUrls.PESCRIPTION(id), apiConfig('post', form_data))
        .then(response => {
            console.log(response)
            if (response.ok) {
                return response.json();
            } else {
                console.log(response.json())
                return Promise.reject('unable to post data');
            }
        })
        .catch(e => {
            console.log(e);
        });
};

// API request for fetching prescription of a query
//

export const getPescription = id => {
    return fetch(QueryUrls.PESCRIPTION(id), apiConfig())
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject('unable to load resources');
            }
        })
        .catch(e => {
            Promise.reject(e.message);
        });
};

// API request for deleting a medicine(med_id) of a prescription of a query(id)
//
export const deleteMedicine = (id, med_id) => {
    return fetch(QueryUrls.MEDICINE(id, med_id), apiConfig('delete'))
        .then(response => {
            if (response.ok) {
                return;
            } else {
                return Promise.reject('unable to delete resources');
            }
        })
        .catch(e => {
            Promise.reject(e.message);
        });
};

export const uploadFile = (id, form_data) => {
    return fetch(QueryUrls.FILES(id), {
        method: 'POST',
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: form_data,
    })
        .then(response => {
            if (response.ok) {
                return;
            } else {
                Promise.reject(Error('unable to upload file'));
            }
        })
        .catch(e => {
            Promise.reject(Error(e.message));
        });
};

export const getFile = id => {
    return fetch(QueryUrls.FILES(id), apiConfig())
        .then(response => {
            if (response.ok) {
                return;
            } else {
                Promise.reject(Error('unable to upload file'));
            }
        })
        .catch(e => {
            Promise.reject(Error(e.message));
        });
};

export const resolveQuery = id => {
    return fetch(QueryUrls.RESOLVE(id), apiConfig('post'))
        .then(response => {
            if (response.ok) {
                return;
            } else {
                Promise.reject(Error('unable to resolve query'));
            }
        })
        .catch(e => {
            Promise.reject(Error(e.message));
        });
};

export const takeQuery = id => {
    return fetch(QueryUrls.TAKE(id), apiConfig('post'))
        .then(response => {
            if (response.ok) {
                return;
            } else {
                Promise.reject(Error('unable to take query'));
            }
        })
        .catch(e => {
            Promise.reject(Error(e.message));
        });
};
