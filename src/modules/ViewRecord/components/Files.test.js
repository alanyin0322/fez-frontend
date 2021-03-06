import {journalArticle} from 'mock/data/testing/records';
import files from "./Files";
import PropTypes from "prop-types";

const moment = require('moment');

function setup(testProps, isShallow = true){
    const props = {
        publication: journalArticle,
        hideCulturalSensitivityStatement: false,
        setHideCulturalSensitivityStatement: jest.fn(),
        ...testProps
    };
    return getElement(files, props, isShallow);
}

describe('Files Component ', () => {

    beforeEach(() => {
        Date.now = jest.genMockFunction().mockReturnValue('2020-01-01T00:00:00.000Z');
    });

    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('FileName').length).toEqual(1);
    });

    it('should not render cultural message', () => {
        const wrapper = setup({publication: {...journalArticle, fez_record_search_key_advisory_statement: {rek_advisory_statement: 'hello'}}, hideCulturalSensitivityStatement: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render cultural message', () => {
        const wrapper = setup({publication: {...journalArticle, fez_record_search_key_advisory_statement: {rek_advisory_statement: 'hello'}}, hideCulturalSensitivityStatement: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render component with no files', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication.fez_datastream_info;
        const wrapper = setup({publication:publication});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.fileName').length).toEqual(0);
    });

    it('should render bytes correctly', () => {
        const wrapper = setup({});
        expect(wrapper.instance().formatBytes(0)).toEqual('0 Bytes');
        expect(wrapper.instance().formatBytes(1024)).toEqual('1 KB');
        expect(wrapper.instance().formatBytes(1048576)).toEqual('1 MB');
    });

    it('should render icon for mimeType', () => {
        const wrapper = setup({});
        expect(shallow(wrapper.instance().renderFileIcon('UQ:1', 'blablabla'))).toMatchSnapshot();
        expect(shallow(wrapper.instance().renderFileIcon('UQ:1', 'image/jpg'))).toMatchSnapshot();
        expect(shallow(wrapper.instance().renderFileIcon('UQ:1', 'video/quicktime'))).toMatchSnapshot();
        expect(shallow(wrapper.instance().renderFileIcon('UQ:1', 'audio/mp3'))).toMatchSnapshot();
        expect(shallow(wrapper.instance().renderFileIcon('UQ:1', 'app/pdf'))).toMatchSnapshot();
    });

    it('should set state on showPreview', () => {
        const wrapper = setup({});
        const mediaUrl = 'mediaUrl';
        const previewMediaUrl = 'previewMediaUrl';
        const mimeType = 'image/jpeg';
        wrapper.instance().showPreview(mediaUrl, previewMediaUrl, mimeType);
        expect(wrapper.state().preview.previewMediaUrl).toEqual(previewMediaUrl);
        expect(wrapper.state().preview.mediaUrl).toEqual(mediaUrl);
        expect(wrapper.state().preview.mimeType).toEqual(mimeType);
    });

    it('should calculate OA status of files', () => {
        const publicationEmbargoOAFile = {
            rek_created_date: '2019-12-01T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695
            },
            fez_datastream_info: [
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "UQ357538_OA.pdf",
                    "dsi_embargo_date": "2021-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                },
                {
                    "dsi_pid": "UQ:1232313",
                    "dsi_dsid": "earlierFile.pdf",
                    "dsi_embargo_date": "2021-11-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                },
                {
                    "dsi_pid": "UQ:1232313",
                    "dsi_dsid": "earlierFile.pdf",
                    "dsi_embargo_date": "2019-12-02",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                },
                {
                    "dsi_pid": "UQ:1232313",
                    "dsi_dsid": "earlierFile.pdf",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                }],
        };
        const wrapper = setup({});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[0].dsi_embargo_date))
            .toEqual({"embargoDate": "1st December 2021", "isOpenAccess": false, "openAccessStatusId": 453695});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[1].dsi_embargo_date))
            .toEqual({"embargoDate": "1st November 2021", "isOpenAccess": false, "openAccessStatusId": 453695});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[2].dsi_embargo_date))
            .toEqual({"embargoDate": null, "isOpenAccess": true, "openAccessStatusId": 453695});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[3].dsi_embargo_date))
            .toEqual({"embargoDate": null, "isOpenAccess": true, "openAccessStatusId": 453695});

    });
    it('should clean up state on hidePreview', () => {
        const wrapper = setup({});
        const mediaUrl = 'mediaUrl';
        const previewMediaUrl = 'previewMediaUrl';
        const mimeType = 'image/jpeg';
        wrapper.instance().showPreview(mediaUrl, previewMediaUrl, mimeType);
        wrapper.instance().hidePreview();
        expect(wrapper.state().preview.previewMediaUrl).toEqual(null);
        expect(wrapper.state().preview.mediaUrl).toEqual(null);
        expect(wrapper.state().preview.mimeType).toEqual(null);
    });

    it('should not calculate OA of files if search key not present', () => {
        const publicationEmbargoOAFile = {
            rek_created_date: '2019-12-01T00:00:00Z',
            rek_pid: 'pid:111',
            fez_datastream_info: [
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "UQ357538_OA.pdf",
                    "dsi_embargo_date": "2021-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                }],
        };
        const wrapper = setup({});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[0].dsi_embargo_date))
            .toEqual({"embargoDate": null, "isOpenAccess": false, "openAccessStatusId": null});
    });

    it('should correctly get dataStream item for thumbnail and preview images', () => {
        const thumbnailFileName = 'thumbnail_AL_LH_01.jpg';
        const previewFileName = 'preview_AL_LH_01.jpg';
        const fez_datastream_info = [
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "AL_LH_01.tif",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "",
                "dsi_mimetype": "image/tiff",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 27932352
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "FezACML_AL_LH_01.tif.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - AL_LH_01.tif",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 64
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "FezACML_UQ_107683.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for PID - UQ:107683",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3633
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "presmd_AL_LH_01.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 239623
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "preview_AL_LH_01.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 95360
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "thumbnail_AL_LH_01.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3912
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "web_AL_LH_01.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 163244
            }
        ];

        const wrapper = setup({});
        expect(wrapper.instance().searchByKey(fez_datastream_info, 'dsi_dsid', thumbnailFileName)).toEqual({
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "thumbnail_AL_LH_01.jpg",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "",
            "dsi_mimetype": "image/jpeg",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 3912
        });

        expect(wrapper.instance().searchByKey(fez_datastream_info, 'dsi_dsid', previewFileName)).toEqual({
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "preview_AL_LH_01.jpg",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "",
            "dsi_mimetype": "image/jpeg",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 95360
        });
    });
});
