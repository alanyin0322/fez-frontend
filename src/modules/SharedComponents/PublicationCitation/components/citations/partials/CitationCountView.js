import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';

export default class CitationCountView extends PureComponent {
    static propTypes = {
        source: PropTypes.string,
        count: PropTypes.any,
        link: PropTypes.string,
        title: PropTypes.string
    }

    constructor(props) {
        super(props);
    }

    render() {
        const {source, count, link, title} = this.props;
        return (
            <div className="citationCount">
                <ExternalLink
                    className={`${source}CitationCount`}
                    href={link}
                    aria-label={title}
                    title={title}
                    openInNewIcon={false}>
                    <div className={`fez-icon ${source} large`}/>
                    <span className="citationCountNumber">{count}</span>
                </ExternalLink>
            </div>
        );
    }
}
