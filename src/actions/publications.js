import {getPublications, getTrendingPublications} from 'repositories';
import * as actions from './actionTypes';

/**
 * Get latest publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchLatestPublications(userName) {
    return dispatch => {
        dispatch({type: actions.LATEST_PUBLICATIONS_LOADING});
        // TODO: try some authors who are students - org username or student name to use?
        getPublications({userName: userName, pageSize: 5})
            .then(response => {
                dispatch({
                    type: actions.LATEST_PUBLICATIONS_COMPLETED,
                    payload: response
                });
            })
            .catch(() => {
                dispatch({
                    type: actions.LATEST_PUBLICATIONS_FAILED,
                    payload: []
                });
            });
    };
}

/**
 * Get author's publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchAuthorPublications({userName, page = 1, pageSize = 20, sortBy, sortDirection, facets}) {
    return dispatch => {
        dispatch({type: actions.AUTHOR_PUBLICATIONS_LOADING});
        getPublications({
            userName: userName, page: page, pageSize: pageSize,
            sortBy: sortBy, sortDirection: sortDirection, facets: facets
        })
            .then(response => {
                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_COMPLETED,
                    payload: response
                });
            })
            .catch((error) => {
                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_FAILED,
                    payload: error
                });
            });
    };
}

/**
 * Get trending publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchTrendingPublications(authorUsername) {
    return dispatch => {
        dispatch({type: actions.TRENDING_PUBLICATIONS_LOADING});
        // TODO: try some authors who are students - org username or student name to use?
        getTrendingPublications(authorUsername)
            .then(response => {
                // TODO: this response will change when this api endpoint will be moved to fez
                dispatch({
                    type: actions.TRENDING_PUBLICATIONS_COMPLETED,
                    payload: Object.keys(response)
                        .filter(item => {
                            return item !== 'author_details';
                        })
                        .map(item => {
                            return {key: item, values: response[item]};
                        })
                });
            })
            .catch((error) => {
                dispatch({
                    type: actions.TRENDING_PUBLICATIONS_FAILED,
                    payload: error
                });
            });
    };
}
