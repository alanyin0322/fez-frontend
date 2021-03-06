import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {locale} from 'locale';
import Files from './Files';
import PublicationDetails from './PublicationDetails';
import AdditionalInformation from './AdditionalInformation';
import GrantInformation from './GrantInformation';
import RelatedPublications from './RelatedPublications';
import Links from './Links';
import {ShareThis} from 'modules/SharedComponents/ShareThis';
import AvailableVersions from './AvailableVersions';
import ReactHtmlParser from 'react-html-parser';

export default class ViewRecord extends PureComponent {
    static propTypes = {
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.string,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool
    };

    componentDidMount() {
        if (this.props.actions && !this.props.recordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.pid !== newProps.match.params.pid) {
            this.props.actions.loadRecordToView(newProps.match.params.pid);
        }
    }

    componentWillUnmount() {
        // clear previously selected record
        if (this.props.actions) {
            this.props.actions.clearRecordToView();
        }
    }

    render() {
        const txt = locale.pages.viewRecord;
        const {loadingRecordToView, recordToViewError, recordToView} = this.props;

        if(loadingRecordToView) {
            return (
                <div className="is-centered">
                    <InlineLoader message={txt.loadingMessage}/>
                </div>
            );
        } else if(recordToViewError) {
            return (
                <StandardPage>
                    <Alert message={recordToViewError} />
                </StandardPage>
            );
        } else if(!recordToView) {
            return <div className="empty"/>;
        }

        return (
            <StandardPage className="viewRecord" title={ReactHtmlParser(recordToView.rek_title)}>
                <PublicationCitation publication={recordToView} hideTitle />

                <ShareThis />

                <Files
                    publication={recordToView}
                    hideCulturalSensitivityStatement={this.props.hideCulturalSensitivityStatement}
                    setHideCulturalSensitivityStatement={this.props.actions.setHideCulturalSensitivityStatement} />

                <Links publication={recordToView}/>

                <RelatedPublications publication={recordToView} />

                <AdditionalInformation publication={recordToView} />

                <GrantInformation publication={recordToView} />

                <PublicationDetails publication={recordToView} />

                <AvailableVersions publication={recordToView} />
            </StandardPage>
        );
    }
}
