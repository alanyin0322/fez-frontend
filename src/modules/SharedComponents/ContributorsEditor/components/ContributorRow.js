import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import ReactTooltip from 'react-tooltip';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox/build/ConfirmDialogBox';

export default class ContributorRow extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        contributor: PropTypes.object.isRequired,
        canMoveUp: PropTypes.bool,
        canMoveDown: PropTypes.bool,
        onMoveUp: PropTypes.func,
        onMoveDown: PropTypes.func,
        onDelete: PropTypes.func,
        showIdentifierLookup: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        disabledContributorAssignment: PropTypes.bool,
        onContributorAssigned: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            suffix: ' listed contributor',
            moveUpHint: 'Move record up the order',
            moveDownHint: 'Move record down the order',
            deleteHint: 'Remove this record',
            ordinalData: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
            deleteRecordConfirmation: {
                confirmationTitle: 'Delete record',
                confirmationMessage: 'Are you sure you want to delete this record?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            }
        }
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    _deleteRecord = () => {
        if (!this.props.disabled && this.props.onDelete) this.props.onDelete(this.props.contributor, this.props.index);
    };

    _onMoveUp = () => {
        if (!this.props.disabled && this.props.onMoveUp) this.props.onMoveUp(this.props.contributor, this.props.index);
    };

    _onMoveDown = () => {
        if (!this.props.disabled && this.props.onMoveDown) this.props.onMoveDown(this.props.contributor, this.props.index);
    };

    _onContributorAssignedKeyboard = (event) => {
        if (event.key === 'Enter') {
            if (!this.props.disabled && this.props.onContributorAssigned) this.props.onContributorAssigned(this.props.contributor, this.props.index);
        }
    };

    _onContributorAssigned = (event) => {
        if (!this.props.disabled && this.props.onContributorAssigned) this.props.onContributorAssigned(this.props.contributor, this.props.index);
        event && event.currentTarget.blur();
    };

    render() {
        const {ordinalData, deleteRecordConfirmation} = this.props.locale;
        const contributorOrder = (this.props.index < ordinalData.length ?
            ordinalData[this.props.index] : (this.props.index + 1)) + ' ' + this.props.locale.suffix;

        return (
            <div className={`contributorsRow datalist datalist-row ${this.props.contributor.selected ? 'selected' : ''}` }>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._deleteRecord}
                    locale={deleteRecordConfirmation} />
                <ReactTooltip className="reactTooltip" place="top" effect="float" />
                <div className="columns is-gapless is-mobile">
                    <div className="column">
                        <div className="columns is-gapless contributorDetails"
                            onClick={this._onContributorAssigned}
                            onKeyDown={this._onContributorAssignedKeyboard}
                            tabIndex="0"
                            data-tip={this.props.contributor.selected ? null : 'Click to assign this author as you'}
                            data-place="top"
                        >
                            <div className="column is-narrow is-hidden-mobile">
                                <IconButton
                                    className="selectedAuthorIcon"
                                    disabled={this.props.disabled}>
                                    <FontIcon className="material-icons">{this.props.contributor.selected ? 'person' : 'person_outline'}</FontIcon>
                                </IconButton>
                            </div>
                            <div className="column datalist-text">
                                <span className="contributorName">{this.props.contributor.nameAsPublished}</span>
                                <span className="contributorSubtitle datalist-text-subtitle">{contributorOrder}</span>
                            </div>
                            {
                                this.props.showIdentifierLookup &&
                                <div className="column is-3-desktop is-3-tablet is-5-mobile contributorIdentifier datalist-text">
                                    <strong>{this.props.contributor.aut_title} {this.props.contributor.aut_display_name}</strong>
                                    <br/>
                                    <small>{this.props.contributor.aut_org_username || this.props.contributor.aut_student_username}</small>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="column is-narrow">
                        <div className="columns is-gapless contributorActions">
                            <div className="column is-narrow is-hidden-mobile contributorReorder datalist-buttons">
                                {this.props.canMoveUp &&
                                <IconButton
                                    data-tip={this.props.locale.moveUpHint}
                                    onTouchTap={this._onMoveUp}
                                    className="reorderUp"
                                    disabled={this.props.disabled}>
                                    <FontIcon className="material-icons">keyboard_arrow_up</FontIcon>
                                </IconButton>
                                }
                                {this.props.canMoveDown &&
                                <IconButton
                                    data-tip={this.props.locale.moveDownHint}
                                    onTouchTap={this._onMoveDown}
                                    className="reorderDown"
                                    disabled={this.props.disabled}>
                                    <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                                </IconButton>
                                }
                            </div>
                            <div className="column is-narrow contributorDelete datalist-buttons">
                                <IconButton
                                    className="contributorDelete"
                                    data-tip={this.props.locale.deleteHint}
                                    onTouchTap={this._showConfirmation}
                                    disabled={this.props.disabled}>
                                    <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

