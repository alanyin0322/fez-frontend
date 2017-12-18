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
        reject({
            status: error.response.status,
            message: error.response.data
                ? error.response.data.message
                : 'Request error with status code ' + error.response.status
        });
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
    return new Promise((resolve, reject) => {
        api
            .put(encodeUrl ? encodeURI(apiUrl) : apiUrl, data, options)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                processError(error, resolve, reject);
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
    return new Promise((resolve, reject) => {
        api
            .post(encodeURI(apiUrl), data)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                processError(error, resolve, reject);
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
    return new Promise((resolve, reject) => {
        api.patch(encodeURI(apiUrl), data).then(response => {
            resolve(response.data);
        }).catch(error => {
            processError(error, resolve, reject);
        });
    });
}

/**
 * Send a get request
 * @param {string} apiUrl
 * @param {boolean} encode
 * @returns {Promise}
 */
export function get(apiUrl, encode = true) {
    return new Promise((resolve, reject) => {
        api.get(encode ? encodeURI(apiUrl) : apiUrl).then(response => {
            resolve(response.data);
        }).catch(error => {
            processError(error, resolve, reject);
        });
    });
}
