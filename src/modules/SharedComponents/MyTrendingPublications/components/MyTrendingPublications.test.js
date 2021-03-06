import {trendingPublications} from 'mock/data/testing/trendingPublications';
import MyTrendingPublications from './MyTrendingPublications';
import {transformTrendingPublicationsMetricsData} from 'actions/academicDataTransformers';

function setup(testProps, isShallow = true){
    const props = {
        actions: {
            searchTrendingPublications: jest.fn()
        },
        ...testProps
    };
    return getElement(MyTrendingPublications, props, isShallow);
}

describe('Component MyTrendingPublications', () => {
    it('should render trending publications', () => {
        const wrapper = setup({trendingPublicationsList: transformTrendingPublicationsMetricsData(trendingPublications)});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading indicator', () => {
        const wrapper = setup({loadingTrendingPublications: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should fetch data if account author details is loaded', () => {
        const testFn = jest.fn();
        setup({accountAuthorDetailsLoading: false, actions: {searchTrendingPublications: testFn}});
        expect(testFn).toHaveBeenCalled();
    });

    it('should not fetch data if account author details is still loading', () => {
        const testFn = jest.fn();
        setup({accountAuthorDetailsLoading: true, actions: {searchTrendingPublications: testFn}});
        expect(testFn).toHaveBeenCalledTimes(0);
    });
});
