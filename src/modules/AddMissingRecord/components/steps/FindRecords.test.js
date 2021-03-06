import FindRecords from './FindRecords';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    return getElement(FindRecords, testProps, isShallow);
}

describe('Search record', () => {
    it('should render stepper and a publication search form', () => {
        const wrapper = setup({history: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should perform search and navigate to results page', () => {
        const searchPublications = jest.fn();
        const navigateToResults = jest.fn();
        const history = {
            push: navigateToResults
        };

        const wrapper = setup({history: history, actions: {searchPublications: searchPublications}});
        wrapper.instance()._performSearch(Immutable.Map({searchQuery: 'bla'}));

        expect(searchPublications).toBeCalled();
        expect(navigateToResults).toBeCalled();
    });
});
