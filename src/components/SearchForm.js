import React, { Component } from 'react';
import Dropdown from './Dropdown';
import './searchForm.css';
import { handleAddBook } from './../actions/books';
import { connect } from 'react-redux';
import AddRating from './AddRating';
import DatePicker from './DatePicker';
import { withRouter } from 'react-router-dom';

/**
 * @description Save input field state and add book 
 */
class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: {},
            title: '',
            date: '',
            comment: '',
            rate: 0,
            isLibraryBook: false,
            showDropdown: false
        };

        // perserve the initial state in a new object
        this.baseState = this.state;
    }

    setDate = (date) => {
        this.setState({
            date
        });
    };

    /* close the dropdown when showDropdown is open and title is changed */
    componentDidUpdate(_, prevState) {
        if (
            this.state.title !== prevState.title && this.state.showDropdown
        ) {
            this.setState({ showDropdown: false });
        }
    }

    resetForm = () => {
        this.setState(this.baseState);
    };

    toggleLibraryBook = () => {
        this.setState({ isLibraryBook: !this.state.isLibraryBook });
    };

    /* set the title and book when user has clicked on a book from the dropdown */
    handleTitle = (book) => {
        const { title } = book.volumeInfo;
        this.setState({ title, book, showDropdown: false });
    };

    /* add book */
    handleAdd = () => {
        const { book, date, comment, isLibraryBook, rate } = this.state;
        this.props
            .handleAddBook({ ...book, date, comment, isLibraryBook, rate })
            .then(() => this.props.history.push('/'))
            .catch(() => {
                alert('Cannot add book. Book already in your list. Try adding a different book.');
                this.resetForm();
            });
    };

    /* set the rate of book when user clicks on star */
    setRate = (value) => {
        this.setState({ rate: value });
    };

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    };

    handleBookTitleSubmit = (e) => {
        e.preventDefault();
        this.setState({ showDropdown: true });
    };

    render() {
        const history = this.props.history
        const { title, comment, isLibraryBook, rate, showDropdown } = this.state;
        return (
            <div className="search-grid">
                <button className="btn" onClick={() => history.goBack()}>
                    Go Back
                </button>
                <div className="form">
                <form onSubmit={this.handleBookTitleSubmit}>
                    <div className="form-title">
                        <div className="form-group">
                            <label htmlFor="book-title">Book Title:</label>
                            <input
                                type="text"
                                id="book-title"
                                name="title"
                                value={title}
                                onChange={this.handleInputChange}
                            />
                        </div>
                            <small className="note">Press Enter to search for a book</small>
                        {/* show dropdown if title value is not empty and user has not chosen a book */}
                        {showDropdown &&
                            title.length > 0 && <Dropdown query={title} setTitle={this.handleTitle} />}
                    </div>
                </form>
                    <DatePicker handleDate={this.setDate} />
                    <div className="form-group">
                        <label htmlFor="isLibraryBook">Library Book</label>
                        <input
                            type="checkbox"
                            id="isLibraryBook"
                            name="isLibraryBook"
                            value={isLibraryBook}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">Comment</label>
                        <textarea
                            name="comment"
                            id="comment"
                            value={comment}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <AddRating setRate={this.setRate} rate={rate} />
                    </div>
                    </div>
                <a className="btn btn--form" type="button" onClick={this.handleAdd}>
                    ADD
                </a>
            </div>
        );
    }
}

export default withRouter(
    connect(
        ({ loadingBar }) => {
            return {
                loading: loadingBar
            };
        },
        { handleAddBook }
    )(SearchForm)
);
