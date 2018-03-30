import React from 'react';
import PropTypes from 'prop-types';

import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardRighthandCard} from 'uqlibrary-react-toolbox/build/StandardRighthandCard';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';

import {PublicationsList, PublicationsListPaging, PublicationsListSorting, FacetsFilter} from 'modules/SharedComponents/PublicationsList';
import {locale} from 'locale';
import {routes} from 'config';
export default class MyRecords extends React.PureComponent {
    static propTypes = {
        publicationsList: PropTypes.array,
        publicationsListFacets: PropTypes.object,
        loadingPublicationsList: PropTypes.bool,
        publicationsListPagingData: PropTypes.object,

        accountLoading: PropTypes.bool,

        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.initState = {
            page: 1,
            pageSize: 20,
            sortBy: locale.components.sorting.sortBy[0].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            activeFacets: {
                filters: {},
                ranges: {}
            }
        };

        this.state = {
            // check if user has publications, once true always true
            // facets filtering might return no results, but facets should still be visible
            hasPublications: !props.loadingPublicationsList && props.publicationsList.length > 0,
            ...(!!props.location.state ? props.location.state : this.initState)
        };
    }

    componentDidMount() {
        if (!this.props.accountLoading) {
            this.props.actions.searchAuthorPublications({...this.state});
        }
    }

    componentWillReceiveProps(newProps) {
        // handle browser back button - set state from location/dispatch action for this state
        if (this.props.location !== newProps.location
            && newProps.history.action === 'POP'
            && newProps.location.pathname === routes.pathConfig.records.mine) {
            this.setState({...(!!newProps.location.state ? newProps.location.state : this.initState)}, () => {
                // only will be called when user clicks back on my records page
                this.props.actions.searchAuthorPublications({...this.state});
            });
        }
        // set forever-true flag if user has publications
        if (!this.state.hasPublications && !newProps.loadingPublicationsList
            && !!newProps.publicationsList && newProps.publicationsList.length > 0) {
            this.setState({ hasPublications: true });
        }
    }

    pageSizeChanged = (pageSize) => {
        this.setState(
            {
                pageSize: pageSize,
                page: 1
            }, this.pushPageHistory
        );
    }

    pageChanged = (page) => {
        this.setState(
            {
                page: page
            }, this.pushPageHistory
        );
    }

    sortByChanged = (sortBy, sortDirection) => {
        this.setState(
            {
                sortBy: sortBy,
                sortDirection: sortDirection
            }, this.pushPageHistory
        );
    }

    facetsChanged = (activeFacets) => {
        this.setState(
            {
                activeFacets: activeFacets,
                page: 1
            }, this.pushPageHistory
        );
    }

    pushPageHistory = () => {
        this.props.history.push({
            pathname: `${routes.pathConfig.records.mine}`,
            search: `?ts=${Date.now()}`,
            state: {...this.state}
        });
        this.props.actions.searchAuthorPublications({...this.state});
    };

    fixRecord = (item) => {
        this.props.history.push(routes.pathConfig.records.fix(item.rek_pid));
        this.props.actions.setFixRecord(item);
    }
    render() {
        if (this.props.accountLoading) return null;

        const txt = locale.pages.myResearch;
        const pagingData = this.props.publicationsListPagingData;
        return (
            <StandardPage title={txt.pageTitle}>
                {
                    // first time loading my publications - account hasn't been loaded or any my publications haven't been loaded
                    !this.state.hasPublications && this.props.loadingPublicationsList &&
                    <div className="is-centered"><InlineLoader message={txt.loadingMessage}/></div>
                }
                <div className="columns">
                    {
                        // no results to display
                        !this.props.loadingPublicationsList && this.props.publicationsList.length === 0 &&
                        <div className="column">
                            <StandardCard {...txt.noResultsFound}>
                                {txt.noResultsFound.text}
                            </StandardCard>
                        </div>
                    }
                    {
                        // results to display or loading if user is filtering/paging
                        this.state.hasPublications && (this.props.loadingPublicationsList || this.props.publicationsList.length > 0) &&
                        <div className="column">
                            <StandardCard>
                                {
                                    pagingData && pagingData.to && pagingData.from && pagingData.total &&
                                        <span>
                                            {txt.recordCount
                                                .replace('[recordsTotal]', pagingData.total)
                                                .replace('[recordsFrom]', pagingData.from)
                                                .replace('[recordsTo]', pagingData.to)}
                                        </span>
                                }
                                {txt.text}
                                <PublicationsListSorting
                                    sortBy={this.state.sortBy}
                                    sortDirection={this.state.sortDirection}
                                    pageSize={this.state.pageSize}
                                    pagingData={pagingData}
                                    onSortByChanged={this.sortByChanged}
                                    onPageSizeChanged={this.pageSizeChanged}
                                    disabled={this.props.loadingPublicationsList} />
                                <PublicationsListPaging
                                    loading={this.props.loadingPublicationsList}
                                    pagingData={pagingData}
                                    onPageChanged={this.pageChanged}
                                    disabled={this.props.loadingPublicationsList} />
                                {
                                    this.props.loadingPublicationsList &&
                                    <div className="is-centered"><InlineLoader message={txt.loadingPagingMessage}/></div>
                                }
                                {
                                    !this.props.loadingPublicationsList && this.props.publicationsList && this.props.publicationsList.length > 0 &&
                                    <PublicationsList
                                        publicationsList={this.props.publicationsList}
                                        showDefaultActions />
                                }
                                <PublicationsListPaging
                                    loading={this.props.loadingPublicationsList}
                                    pagingData={pagingData}
                                    onPageChanged={this.pageChanged}
                                    disabled={this.props.loadingPublicationsList} />
                            </StandardCard>
                        </div>
                    }
                    {
                        // show available filters or selected filters (even if there are no results)
                        ((this.props.publicationsListFacets && Object.keys(this.props.publicationsListFacets).length > 0)
                        || (this.state.activeFacets && this.state.activeFacets.filters && Object.keys(this.state.activeFacets.filters).length > 0)
                        || (this.state.activeFacets && this.state.activeFacets.ranges && Object.keys(this.state.activeFacets.ranges).length > 0)) &&
                        <div className="column is-3 is-hidden-mobile">
                            <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                <FacetsFilter
                                    facetsData={this.props.publicationsListFacets}
                                    onFacetsChanged={this.facetsChanged}
                                    activeFacets={this.state.activeFacets}
                                    disabled={this.props.loadingPublicationsList}
                                    excludeFacetsList={txt.facetsFilter.excludeFacetsList}
                                    renameFacetsList={txt.facetsFilter.renameFacetsList} />
                            </StandardRighthandCard>
                        </div>
                    }
                </div>
            </StandardPage>
        );
    }
}
