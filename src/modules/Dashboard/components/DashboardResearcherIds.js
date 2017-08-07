import React from 'react';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import {locale} from 'config';

const DashboardResearcherIds = ({values}) => {
    const badgeOk = (<FontIcon className="material-icons">done</FontIcon>);
    const badgeError = (<FontIcon className="material-icons">close</FontIcon>);
    const badgeStyle = {right: -5};

    const txt = locale.components.dashboardResearcherIds;
    return (
        <div className="columns researcherIds is-gapless">
            {values && Object.keys(values).map((item, index) => (
                    <div key={index} className={`${item} column is-narrow`}>
                        <a href="https://app.library.uq.edu.au/#/id" target="_blank">
                            <Badge
                                badgeStyle={badgeStyle}
                                className={values[item] ? (`${item.toLowerCase()} researchIdBadge ok`) : (`${item.toLowerCase()} researchIdBadge error`)}
                                badgeContent={values[item] ? badgeOk : badgeError}
                                title={values[item] ? txt.researcherIsLinked.replace('[resource]', item).replace('[id]', values[item]) : txt.researcherIsNotLinked.replace('[resource]', item)}
                                aria-label={values[item] ? txt.researcherIsLinked.replace('[resource]', item).replace('[id]', values[item]) : txt.researcherIsNotLinked.replace('[resource]', item)} >
                                <Avatar
                                    className="researchIdAvatar"
                                    src={require(`../../../../src/images/${item.toLowerCase()}_icon.svg`)}
                                    title={`${item} Id`}
                                    alt={`${item} Id`}/>
                            </Badge>
                        </a>
                    </div>
                )
            )}

            {values.orcid &&
            <div className="column is-narrow">
                <a className="orcidLink"
                   href={txt.orcidUrlPrefix + values.orcid}
                   target="_blank"
                   aria-label={txt.orcidlinkLabel}
                   title={txt.orcidlinkLabel}>
                    {txt.orcidLinkPrefix}{values.orcid}</a>
            </div>
            }
        </div>
    );
};

DashboardResearcherIds.propTypes = {
    values: PropTypes.shape({
        publons: PropTypes.string,
        researcher: PropTypes.string,
        scopus: PropTypes.string,
        google_scholar: PropTypes.string,
        orcid: PropTypes.string
    })
};

export default DashboardResearcherIds;