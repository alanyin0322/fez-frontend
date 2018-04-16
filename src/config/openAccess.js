export const OPEN_ACCESS_ID_NOT_YET_ASSESSED = 453692;
export const OPEN_ACCESS_ID_DOI = 453693;
export const OPEN_ACCESS_ID_LINK_NO_DOI = 453694;
export const OPEN_ACCESS_ID_FILE_PUBLISHER_VERSION = 453695;
export const OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT = 453696;
export const OPEN_ACCESS_ID_OTHER = 453697;
export const OPEN_ACCESS_ID_NOT_OPEN_ACCESS = 453698;
export const OPEN_ACCESS_ID_MEDIATED_ACCESS = 453700;
export const OPEN_ACCESS_ID_PMC = 453954;

export const openAccessIds = [OPEN_ACCESS_ID_DOI, OPEN_ACCESS_ID_LINK_NO_DOI, OPEN_ACCESS_ID_FILE_PUBLISHER_VERSION,
    OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT, OPEN_ACCESS_ID_OTHER, OPEN_ACCESS_ID_PMC];
export const notOpenAccessIds = [OPEN_ACCESS_ID_NOT_YET_ASSESSED, OPEN_ACCESS_ID_NOT_OPEN_ACCESS, OPEN_ACCESS_ID_MEDIATED_ACCESS];
export const openAccessLinks = [OPEN_ACCESS_ID_DOI, OPEN_ACCESS_ID_LINK_NO_DOI, OPEN_ACCESS_ID_PMC];
export const openAccessFiles = [OPEN_ACCESS_ID_FILE_PUBLISHER_VERSION, OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT, OPEN_ACCESS_ID_OTHER];

export const labels = {
    [OPEN_ACCESS_ID_NOT_YET_ASSESSED]: 'Not yet assessed',
    [OPEN_ACCESS_ID_DOI]: 'DOI',
    [OPEN_ACCESS_ID_LINK_NO_DOI]: 'Link (no DOI)',
    [OPEN_ACCESS_ID_FILE_PUBLISHER_VERSION]: 'File (Publisher version)',
    [OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT]: 'File (Author post-print)',
    [OPEN_ACCESS_ID_OTHER]: 'Other',
    [OPEN_ACCESS_ID_NOT_OPEN_ACCESS]: 'Not Open Access',
    [OPEN_ACCESS_ID_MEDIATED_ACCESS]: 'Mediated Access',
    [OPEN_ACCESS_ID_PMC]: 'PMC'
};