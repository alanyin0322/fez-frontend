import {validation, openAccessConfig} from 'config';

const zeroPaddedYear = (value) => value ? ('0000' + value).substr(-4) : '*';

/**
 * Translate selected facets to query string parameters
 * @param {object} selected facets
 * @returns {object}
 */
export const getFacetsParams = (facets) => {
    const facetsParam = {};
    if (facets.hasOwnProperty('filters')) {
        Object.keys(facets.filters).map(key => {
            facetsParam[`filters[facets][${key}]`] = facets.filters[key];
        });
    }

    if (facets.hasOwnProperty('ranges')) {
        Object.keys(facets.ranges).map(key => {
            const {from, to} = facets.ranges[key];
            const fromValueForEs = (!!from && !!to && from > to) ? zeroPaddedYear(to) : zeroPaddedYear(from);
            const toValueForEs = (!!from && !!to && to < from) ? zeroPaddedYear(from) : zeroPaddedYear(to);
            facetsParam[`ranges[facets][${key}]`] = `[${fromValueForEs} TO ${toValueForEs}]`;
        });
    }

    return facetsParam;
};

export const getStandardSearchParams = ({exportPublicationsFormat = '', page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'desc', withUnknownAuthors = -1, facets = {}}) => {
    const unknownAuthors = withUnknownAuthors >= 0 ? {with_unknown_authors: withUnknownAuthors} : {};

    return {
        export_to: exportPublicationsFormat,
        page: page,
        per_page: pageSize,
        sort: sortBy,
        order_by: sortDirection.toLowerCase(),
        ...getFacetsParams(facets),
        ...(!!facets.showOpenAccessOnly ? {rek_oa_status: openAccessConfig.openAccessIds} : {}),
        ...unknownAuthors
    };
};

/**
 * getSearchType - based on data provided returns query string attribute
 * @param {string} pid/pubmed/string title to search
 * @returns {object} query string attribute based on input
 */
export const getSearchType = (searchQuery) => {
    if (!searchQuery) return {};

    if (validation.isValidDOIValue(searchQuery)) {
        return {doi: searchQuery.trim()};
    }

    if (validation.isValidPubMedValue(searchQuery)) {
        return {id: `pmid:${searchQuery.trim()}`};
    }

    return {rek_title: searchQuery};
};

export const CURRENT_ACCOUNT_API = () => (
    {apiUrl: 'account', options: {params: {ts: `${new Date().getTime()}`}}}
);
export const AUTHORS_SEARCH_API = ({query}) => (
    {apiUrl: 'fez-authors/search', options: {params: {query: query}}}
);
export const CURRENT_AUTHOR_API = () => (
    {apiUrl: 'fez-authors'}
);
export const AUTHOR_API = ({authorId}) => (
    {apiUrl: `fez-authors/${authorId}`}
);
export const AUTHOR_DETAILS_API = ({userId}) => (
    {apiUrl: `authors/details/${userId}`}
);
export const AUTHOR_ORCID_DETAILS_API = ({userId, params}) => (
    {apiUrl: `orcid/${userId}/request`, options: {params: {...params}}}
);

// academic stats apis
export const ACADEMIC_STATS_PUBLICATION_HINDEX_API = ({userId}) => (
    {apiUrl: `academic/${userId}/hindex`}
);
export const ACADEMIC_STATS_PUBLICATIONS_TRENDING_API = () => (
    {apiUrl: 'records/my-trending'}
);

// lookup apis
export const GET_ACML_QUICK_TEMPLATES_API = () => (
    {apiUrl: 'acml/quick-templates'}
);
export const GET_NEWS_API = () => (
    {apiUrl: 'fez-news'}
);
export const VOCABULARIES_API = ({id}) => (
    {apiUrl: `vocabularies/${id}`}
);
export const GET_PUBLICATION_TYPES_API = () => (
    {apiUrl: 'records/types'}
);

// file uploading apis
export const FILE_UPLOAD_API = ({pid, fileName}) => (
    {apiUrl: `file/upload/presigned/${pid}/${fileName}`}
);

// create/patch record apis
export const NEW_RECORD_API = () => (
    {apiUrl: 'records'}
);
export const EXISTING_RECORD_API = ({pid}) => (
    {apiUrl: `records/${pid}`}
);
export const RECORDS_ISSUES_API = ({pid}) => (
    {apiUrl: `records/${pid}/issues`}
);

// search/list records apis
export const POSSIBLE_RECORDS_API = ({facets = {}}) => (
    {apiUrl: 'records/search', options: {params: {rule: 'possible', ...getFacetsParams(facets)}}}
);
export const HIDE_POSSIBLE_RECORD_API = () => (
    {apiUrl: 'records/search', options: {params: {rule: 'possible'}}}
); // (POST: with data: [\'pid\' => \'UQ:1\', \'type\' => \'H\'])`);

export const CURRENT_USER_RECORDS_API = (values, route = 'search') => (
    {apiUrl: `records/${route}`, options: {params: {rule: 'mine', ...getStandardSearchParams(values)}}}
);
export const ACADEMIC_PUBLICATIONS_STATS_API = (values) => (
    {apiUrl: 'records/search', options: {params: {rule: 'mine', 'filters[stats_only]': true, ...getStandardSearchParams(values)}}}
);
export const TRENDING_PUBLICATIONS_API = () => ({apiUrl: 'records/trending'});

export const SEARCH_INTERNAL_RECORDS_API = (values, route = 'search') => {
    // values = {searchQuery (text value - title search, doi or pubmed id)
    // searchQueryParams = {} (search parameters, eg title, author etc)
    // page = 1, pageSize = 20, sortBy = 'published_date', sortDirection = 'desc', facets = {}}
    return {
        apiUrl: `records/${route}`,
        options: {
            params: {
                ...getSearchType(values.searchQuery),
                ...getStandardSearchParams(values),
                ...values.searchQueryParams
            }
        }
    };
};

export const SEARCH_EXTERNAL_RECORDS_API = ({source = 'wos', searchQuery = ''}) => (
    {apiUrl: 'external/records/search', options: {params: {source: source, ...getSearchType(searchQuery)}}}
);

export const SEARCH_KEY_LOOKUP_API = ({searchKey, searchQuery}) => (
    {
        apiUrl: 'records/search',
        options: {
            params: {
                rule: 'lookup',
                search_key: searchKey,
                lookup_value: searchQuery
            }
        }
    }
);
