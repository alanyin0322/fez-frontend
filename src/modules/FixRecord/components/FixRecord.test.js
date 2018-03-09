import FixRecord from './FixRecord';
import {mockRecordToFix} from 'mock/data/testing/records';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        recordToFix: testProps.recordToFix,
        loadingRecordToFix: testProps.loadingRecordToFix || false,

        accountAuthorLoading: testProps.accountAuthorLoading || false,
        author: testProps.author || {aut_id: 410},

        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues: testProps.initialValues ||
            Immutable.Map({
                publication: Immutable.Map(testProps.recordToFix || mockRecordToFix),
                author: Immutable.Map(testProps.author || {aut_id: 410})
            }),
        actions: testProps.actions || {},
        history: testProps.history || {go: jest.fn()},
        match: testProps.match || {},

        publicationToFixFileUploadingError: testProps.publicationToFixFileUploadingError || false
    };
    return getElement(FixRecord, props, isShallow);
}

describe('Component FixRecord', () => {

    it('should render loader when author is loading', () => {
        const wrapper = setup({recordToFix: mockRecordToFix, accountAuthorLoading: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loader when record is loading', () => {
        const wrapper = setup({recordToFix: mockRecordToFix, loadingRecordToFix: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect if author not linked', () => {
        const testMethod = jest.fn();
        const wrapper = setup({author: {aut_id: 1001}, recordToFix: mockRecordToFix, history: {go: testMethod}});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render record citation, two actions in select field and a cancel button', () => {
        const wrapper = setup({recordToFix: mockRecordToFix});
        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find('MenuItem').length).toEqual(2);
        expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
    });

    it('should render fix record form', () => {
        const wrapper = setup({recordToFix: mockRecordToFix});
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(4);
        expect(wrapper.find('RaisedButton').length).toEqual(2);
    });

    it('should set action for form', () => {
        const wrapper = setup({recordToFix: mockRecordToFix});
        wrapper.instance()._actionSelected('', 'fix');
        expect(wrapper.state().selectedRecordAction).toEqual('fix');
    });

    it('should render unclaim form', () => {
        const wrapper = setup({recordToFix: mockRecordToFix});
        wrapper.setState({selectedRecordAction: 'unclaim'});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('RaisedButton').length).toEqual(2);
        expect(wrapper.find('Field').length).toEqual(1);
    });

    it('should set local variables', () => {
        const wrapper = setup({recordToFix: mockRecordToFix});
        wrapper.setState({selectedRecordAction: 'unclaim'});
        wrapper.instance()._setSuccessConfirmation('successBox');
        expect(wrapper.instance().successConfirmationBox).toEqual('successBox');
    });

    it('should redirect to other pages', () => {
        const testMethod = jest.fn();

        const wrapper = setup({recordToFix: mockRecordToFix, history: {push: testMethod}});
        wrapper.instance()._navigateToMyResearch();
        expect(testMethod).toHaveBeenCalledWith('/records/mine');

        wrapper.instance()._navigateToDashboard();
        expect(testMethod).toHaveBeenCalledWith('/dashboard');
    });

    it('should return and render the alert details correctly', () => {
        const testCases = [
            {
                parameters: {submitting: true, alertLocale: {progressAlert: {title: 'submitting', message: 'submitting', type: 'info'}}},
            },
            {
                parameters: {submitSucceeded: true, alertLocale: {successAlert: {title: 'submitSucceeded', message: 'submitSucceeded', type: 'done'}}},
            },
            {
                parameters: {submitFailed: true, error: 'This is an error', alertLocale: {errorAlert: {title: 'submitFailed', message: jest.fn(), type: 'error'}}},
            },
            {
                parameters: {invalid: true, dirty: true, formErrors: {rek_title: 'one', comments: 'two'}, alertLocale: {validationAlert: {title: 'validationError'}}},
            },
            {
                parameters: {formErrors: {rek_link: 'one', comments: 'two', files: 'three'}, formValues: Immutable.Map({fixAction: 'fix'}),
                    alertLocale: {oneIsRequired:{ alert:{title: 'oneIsRequiredError'}}}},
            }
        ];

        testCases.forEach(testCase => {
            const wrapper = setup({...testCase.parameters, recordToFix: mockRecordToFix}).find('Alert').dive();
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    it('should clear record to fix when leaving the form', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({recordToFix: mockRecordToFix, actions: {clearFixRecord: actionFunction}});
        wrapper.instance().componentWillUnmount();
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should load record if record is not loaded', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({loadingRecordToFix: false, recordToFix: null, actions: {loadRecordToFix: actionFunction}, match: {params: {pid: 'UQ:1001'}}});
        // console.log(wrapper.instance().props.match.params.pid);
        wrapper.update;
        wrapper.instance().componentDidMount();
        expect(actionFunction).toHaveBeenCalledWith('UQ:1001');
    });

    it('should display confirmation box after successful submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({recordToFix: mockRecordToFix});
        wrapper.instance().successConfirmationBox = {showConfirmation: testMethod};
        wrapper.instance().componentWillReceiveProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render the confirm dialog box with an alert due to a file upload failure', () => {
        const wrapper = setup({recordToFix: mockRecordToFix, publicationToFixFileUploadingError: true});
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('should render the confirm dialog box without an alert due to a file upload success', () => {
        const wrapper = setup({recordToFix: mockRecordToFix, publicationToFixFileUploadingError: false});
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();

    });
});
