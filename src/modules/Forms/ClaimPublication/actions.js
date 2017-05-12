// repositories
import {loadUsersPublicationData}  from '../../../repositories/claimPublication';

// module imports
import {showSnackbar} from '../../App';

export const PUBLICATION_RESULTS_CLEARED = 'PUBLICATION_RESULTS_CLEARED';
export const PUBLICATION_SELECTED_CLEARED = 'PUBLICATION_SELECTED_CLEARED';
export const PUBLICATION_SELECTED = 'PUBLICATION_SELECTED';
export const USERS_PUBLICATIONS_LOADING = 'USERS_PUBLICATIONS_LOADING';
export const USERS_PUBLICATIONS_LOADED = 'USERS_PUBLICATIONS_LOADED';

/**
 * Shows the cancel message within the snackbar
 * @returns {function(*)}
 */
export function claimThisPublicationCancelled(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}

/**
 * Shows the claim publication message within the snackbar
 * @returns {function(*)}
 */
export function claimThisPublication(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}

/**
 * Clear the selected publication
 * @returns {object}
 */
export function clearSelectedPublication() {
    return {
        type: PUBLICATION_SELECTED_CLEARED,
        payload: {}
    };
}

/**
 * Load the selected publication data
 * @returns {number}
 */
export function loadSelectedPublication(id) {
    return {
        type: PUBLICATION_SELECTED,
        payload: id
    };
}

/**
 * Clear the publication search results
 * @returns {object}
 */
export function clearPublicationResults() {
    return {
        type: PUBLICATION_RESULTS_CLEARED,
        payload: {}
    };
}


/**
 * Loads the publication types into the application
 * @returns {Promise}
 */
export function loadUsersPublications(userid) {
    return dispatch => {
        dispatch({type: USERS_PUBLICATIONS_LOADING});
        loadUsersPublicationData(userid).then(data => {
            dispatch({
                type: USERS_PUBLICATIONS_LOADED,
                payload: data
            });
        }).catch((error) => {
            throw(error);
        });
    };
}