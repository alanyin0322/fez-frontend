jest.dontMock('./ResearchReportForm');

import ResearchReportForm from './ResearchReportForm';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        submitting: testProps.submitting || false // : PropTypes.bool,
    };
    return getElement(ResearchReportForm, props, isShallow);
}

describe('ResearchReportForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 12 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(12);
    });

    it('component with 4 required input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field .requiredField').length).toEqual(3);
        expect(wrapper.find('Field .requiredHintField').length).toEqual(1);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });

    it('should normalize total pages field', () => {
        const wrapper = setup({});
        expect(wrapper.instance().getNumbersOnly('Four')).toBe('');
        expect(wrapper.instance().getNumbersOnly('12Three')).toBe('12');
        expect(wrapper.instance().getNumbersOnly('  01Three')).toBe('01');
        expect(wrapper.instance().getNumbersOnly('124')).toBe('124');
    })
});
