import React from 'react';
import PropTypes from 'prop-types';

export default function StandardPage({title, className, children}) {
    return (
        <div className={`${className}`}>
            {title &&
                <h1 className="pageTitle">{title}</h1>
            }
            <div className="layout-card">
                {children}
            </div>
        </div>
    );
}

StandardPage.propTypes = {
    title: PropTypes.any,
    className: PropTypes.string,
    children: PropTypes.any
};

StandardPage.defaultProps = {
    className: ''
};
