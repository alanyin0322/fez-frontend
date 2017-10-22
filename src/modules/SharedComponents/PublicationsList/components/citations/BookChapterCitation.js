import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import AuthorsCitationView from './AuthorsCitationView';
import EditorsCitationView from './EditorsCitationView';
import YearCitationView from './YearCitationView';
import PageRangeCitationView from './PageRangeCitationView';

export default class BookChapterCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const bookChapter = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            bookTitle: this.props.publication.fez_record_search_key_book_title ?
                this.props.publication.fez_record_search_key_book_title.rek_book_title : null,
            edition: this.props.publication.fez_record_search_key_edition ?
                this.props.publication.fez_record_search_key_edition.rek_edition : null,
            placeOfPublication: this.props.publication.fez_record_search_key_place_of_publication ?
                this.props.publication.fez_record_search_key_place_of_publication.rek_place_of_publication : null,
            publisher: this.props.publication.fez_record_search_key_publisher ?
                this.props.publication.fez_record_search_key_publisher.rek_publisher : null,
            doi: this.props.publication.fez_record_search_key_doi ?
                this.props.publication.fez_record_search_key_doi.rek_doi : null
        };

        // eSpace citation view for Book Chapter
        // {6230} ({6260}). {10623}. In {6238|| (Ed.),} <i>{10630}</i> {6261|| ed.} ({6265|pp. }{6266|-})  {6258}: {6259}.{16518| doi:|}
        // authors (year). title. In editors (Ed.), <i>book title</i> edition ed. (pp. start page-end page) place of publication: publisher. doi: DOI
        return (
            <div className="citationContent citationBookChapter">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* authors list */}
                <AuthorsCitationView publication={this.props.publication} />

                {/* publication year */}
                <YearCitationView publication={this.props.publication} />.

                {/* chapter title */}
                <span className="citationTitle"> {bookChapter.title}. </span>

                {/* editors list */}
                <EditorsCitationView publication={this.props.publication} prefix="In " suffix=" (Ed.)," />

                {/* book title */}
                {
                    bookChapter.bookTitle &&
                    <span className="citationBookTitle"> {bookChapter.bookTitle},</span>
                }
                {/* book edition */}
                {
                    bookChapter.edition &&
                    <span className="citationBookEdition"> {bookChapter.edition} ed.</span>
                }
                {/* pages (pp. start page-end page) */}
                <PageRangeCitationView publication={this.props.publication} prefix=" (pp. " suffix=") " />
                {/* place of publication */}
                {
                    bookChapter.placeOfPublication &&
                    <span className="citationPlaceOfPublication"> {bookChapter.placeOfPublication}:</span>
                }
                {/* publisher */}
                {
                    bookChapter.publisher &&
                    <span className="citationPublisher"> {bookChapter.publisher}</span>
                }
                .
                {/* doi */}
                {
                    bookChapter.doi &&
                    <span className="citationDOI">
                        <span className="citationLabel"> doi: </span>
                        <span className="citationValue"> {bookChapter.doi} </span>
                    </span>
                }
            </div>
        );
    }
}