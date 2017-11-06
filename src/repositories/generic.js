import {api} from '../config';
/**
 * @param error
 * @param resolve
 * @param reject
 */
function processError(error, resolve, reject) {
    if (error.hasOwnProperty('response')
        && error.response !== null && typeof(error.response) !== 'undefined'
        && error.response.hasOwnProperty('status')
        && (error.response.status === 403 || error.response.status === 404
            || error.response.status === 500 || error.response.status === 422
            || error.response.status === 504)) {
        reject({status: error.response.status, message: error.response.message});
    } else {
        reject(error);
    }
}

/**
 * Send a put request
 * @param {string} apiUrl
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function put(apiUrl, data, options, encodeUrl = false) {
    console.log('PUT: ' + apiUrl);
    return new Promise((resolve, reject) => {
        api
            .put(encodeUrl ? encodeURI(apiUrl) : apiUrl, data, options)
            .then(response => {
                console.log(response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.log('PUT api call error');
                console.log(error);
                reject(error);
            });
    });
}

/**
 * Send a post request
 * @param {string} apiUrl
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function post(apiUrl, data) {
    console.log('POST: ' + apiUrl);
    console.log(data);
    return new Promise((resolve, reject) => {
        api
            .post(encodeURI(apiUrl), data)
            .then(response => {
                console.log(response.data);
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * Send a patch request
 * @param {string} apiUrl
 * @param {object} data to be posted, refer to backend API
 * @returns {Promise}
 */
export function patch(apiUrl, data) {
    console.log('PATCH: ' + apiUrl);
    console.log(data);
    return new Promise((resolve, reject) => {
        api.patch(encodeURI(apiUrl), data).then(response => {
            console.log(response.data);
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * Send a get request
 * @param {string} apiUrl
 * @returns {Promise}
 */
export function get(apiUrl) {
    console.log('GET: ' + apiUrl);
    return new Promise((resolve, reject) => {
        api.get(encodeURI(apiUrl)).then(response => {
            console.log(response.data);
            resolve(response.data);
        }).catch(error => {
            processError(error, resolve, reject);
        });
    });
}
