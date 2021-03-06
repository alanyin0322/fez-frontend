import PubmedCentralLink from './PubmedCentralLink';

function setup(testProps, isShallow = true) {
    const props = {
        pubmedCentralId: testProps.pubmedCentralId
    };

    return getElement(PubmedCentralLink, props, isShallow);
}

describe('PubmedCentralLink test ', () => {
    it('should render component with empty span', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with pubmedCentralId', () => {
        const wrapper = setup({pubmedCentralId: 'PMC12345677'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
