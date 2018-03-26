import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {openAccessIdLookup} from 'config/general';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import * as Partials from './partials';

export default class CitationCounts extends React.PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps;
    }

    getTitle = (title) => (locale.global.linkWillOpenInNewWindow.replace('[destination]', `${this.props.publication.rek_title} (${title})`));

    render() {
        const txt = locale.components.publicationCitation.citationCounts;
        const {sources} = locale.global;
        const {publication} = this.props;
        const counts = {
            wos: publication.rek_thomson_citation_count ? publication.rek_thomson_citation_count : null,
            scopus: publication.rek_scopus_citation_count ? publication.rek_scopus_citation_count : null,
            google: publication.rek_gs_citation_count ? publication.rek_gs_citation_count : null,
            altmetric: publication.rek_altmetric_score ? publication.rek_altmetric_score : null
        };

        return (
            <div className="citationCounts columns is-multiline is-gapless is-marginless">
                {
                    !!counts.wos && counts.wos > 0 && !!publication.fez_record_search_key_isi_loc
                    && !!publication.fez_record_search_key_isi_loc.rek_isi_loc &&
                    <Partials.CitationCountView
                        source="wos"
                        count={counts.wos}
                        link={sources.wos.externalUrl.replace('[id]', publication.fez_record_search_key_isi_loc.rek_isi_loc)}
                        title={this.getTitle(sources.wos.title)}
                    />
                }
                {
                    !!counts.scopus && counts.scopus > 0
                    && !!publication.fez_record_search_key_scopus_id && !!publication.fez_record_search_key_scopus_id.rek_scopus_id &&
                    <Partials.CitationCountView
                        source="scopus"
                        count={counts.scopus}
                        link={sources.scopus.externalUrl.replace('[id]', publication.fez_record_search_key_scopus_id.rek_scopus_id)}
                        title={this.getTitle(sources.scopus.title)}
                    />
                }
                {
                    !!counts.altmetric && counts.altmetric > 0 && !!publication.rek_altmetric_id &&
                    <Partials.CitationCountView
                        source="altmetric"
                        count={counts.altmetric}
                        link={txt.altmetric.externalUrl.replace('[id]', publication.rek_altmetric_id)}
                        title={this.getTitle(txt.altmetric.title)}
                    />
                }
                {
                    !!publication.rek_pid &&
                    <Partials.CitationCountView
                        source="google"
                        count={counts.google}
                        link={txt.google.externalUrl + encodeURI(publication.rek_title)}
                        title={this.getTitle(txt.google.title)}
                    />
                }
                {
                    !!publication.rek_pid && !!publication.fez_record_search_key_oa_status &&
                    !!openAccessIdLookup[publication.fez_record_search_key_oa_status.rek_oa_status] &&
                    <span className="citationCount">
                        <div title={txt.openAccessLabel.replace('[oa_status]', openAccessIdLookup[publication.fez_record_search_key_oa_status.rek_oa_status])}
                            className="fez-icon openAccess large"/>
                    </span>
                }
                {
                    !!publication.rek_pid && (counts.wos || counts.scopus) &&
                    <div className="citationCount column">
                        <div className="columns is-mobile is-gapless">
                            <div className="column is-narrow citationCountNumber">
                                <ExternalLink href={`https://app.library.uq.edu.au/#/authors/view/${publication.rek_pid}`}>{txt.statsLabel}</ExternalLink>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
