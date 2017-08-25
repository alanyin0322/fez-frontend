import {api, generateCancelToken} from 'config';
import {fileUploadActions} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
export const GET_FILE_UPLOAD_API = 'file/upload/presigned';

/**
 * Uploads a file directly into an S3 bucket via API
 * @param {string} pid of object, folder name to where file will be uploaded
 * @param {object} file to be uploaded
 * @param {function} dispatch
 * @returns {Promise}
 */
export function putUploadFile(pid, file, dispatch) {
    return new Promise((resolve, reject) => {
        api.get(`${GET_FILE_UPLOAD_API}/${pid}/${file.name}`).then(getPresignedResponse => {
            const options = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: event => {
                    const completed = Math.floor((event.loaded * 100) / event.total);
                    dispatch(fileUploadActions.notifyProgress(file.name, completed));
                },
                cancelToken: generateCancelToken().token
            };

            api.put(getPresignedResponse.data, file, options).then(uploadResponse => {
                resolve(uploadResponse.data);
            }).catch(uploadError => {
                dispatch(fileUploadActions.notifyUploadFailed(file.name));
                reject(uploadError);
            });
        }).catch((error) => {
            const { errorAlert } = locale.components.publicationForm;
            dispatch(fileUploadActions.notifyUploadFailed(file.name));
            reject(new Error(`${errorAlert.fileUploadMessage} (${error.message})`));
        });
    });
}

/**
 * Uploads a list of files
 * @param {string} pid of object, folder name to where file will be uploaded
 * @param {array} files to be uploaded
 * @param {function} dispatch
 * @returns {Promise.all}
 */
export function putUploadFiles(pid, files, dispatch) {
    const uploadFilesPromises = files.map(file => {
        return putUploadFile(pid, file, dispatch);
    });

    return Promise.all(uploadFilesPromises);
}
