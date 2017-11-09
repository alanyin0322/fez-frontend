import React from 'react';
import PropTypes from 'prop-types';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';

const CitationCountView = ({source, count, link, title}) => {
    return (
        <span className="citationCount">
            <ExternalLink
                className={`${source}CitationCount`}
                linkUrl={link}
                ariaLabel={title}
                linkTooltip={title}
                externalLinkIcon={false}
            >
                <div className={`fez-icon ${source} large`} />
                <span className="citationCountNumber">{count}</span>
            </ExternalLink>
        </span>
    );
};

CitationCountView.propTypes = {
    source: PropTypes.string,
    count: PropTypes.number,
    link: PropTypes.string,
    title: PropTypes.string
};

export default CitationCountView;
