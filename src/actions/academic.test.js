import {publicationYearsSmall, publicationStats, hindexResponse} from '../mock/data/academicStats';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as academicActions from './academic';

describe('Academic action creators', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch 3 actions on successful fetch of academic stats by publication year data', async () => {
        mockApi
            .onAny()
            .reply(200, publicationYearsSmall);

        const expectedActions = [
            actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING,
            actions.ACADEMIC_PUBLICATIONS_COUNT_LOADED,
            actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED
        ];

        await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsByYear('testuser'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 3 actions on successful fetch of academic stats (missing facets_count) on response by publication year data', async () => {
        delete publicationYearsSmall.facet_counts;

        mockApi
            .onAny()
            .reply(200, publicationYearsSmall);

        const expectedActions = [
            actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING,
            actions.ACADEMIC_PUBLICATIONS_COUNT_LOADED,
            actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADED
        ];

        await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsByYear('testuser'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 3 actions on error 403 while fetching academic stats by publication year data', async () => {
        mockApi
            .onAny()
            .reply(403);

        const expectedActions = [
            actions.ACADEMIC_PUBLICATIONS_BY_YEAR_LOADING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.ACADEMIC_PUBLICATIONS_BY_YEAR_FAILED
        ];

        await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsByYear('testuser'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on successful fetch of author\'s publication stats data and successful hindex api call', async () => {
        mockApi
            .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: 'testuser'}).apiUrl)
            .reply(200, publicationStats)
            .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: 'testuser'}).apiUrl)
            .reply(200, hindexResponse);

        const expectedActions = [
            actions.ACADEMIC_PUBLICATIONS_STATS_LOADING,
            actions.ACADEMIC_PUBLICATIONS_STATS_LOADED
        ];

        await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 3 actions on error 403 while fetching author\'s publication stats data', async () => {
        mockApi
            .onAny()
            .reply(403, {});

        const expectedActions = [
            actions.ACADEMIC_PUBLICATIONS_STATS_LOADING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.ACADEMIC_PUBLICATIONS_STATS_FAILED
        ];

        await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on error with stats while fetching author\'s publication stats data but error on hindex api call', async () => {
        mockApi
            .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: 'testuser'}).apiUrl)
            .reply(200, publicationStats)
            .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: 'testuser'}).apiUrl)
            .reply(500, {});

        const expectedActions = [
            actions.ACADEMIC_PUBLICATIONS_STATS_LOADING,
            actions.ACADEMIC_PUBLICATIONS_STATS_LOADED
        ];

        await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch 2 actions on success with empty response while fetching author\'s publication stats data but error on hindex api call', async () => {
        mockApi
            .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: 'testuser'}).apiUrl)
            .reply(200)
            .onAny()
            .reply(500, {});

        const expectedActions = [
            actions.ACADEMIC_PUBLICATIONS_STATS_LOADING,
            actions.ACADEMIC_PUBLICATIONS_STATS_FAILED
        ];

        await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
