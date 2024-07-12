import React, { Component, Fragment } from 'react';
import { sortByDate, sortByAuthor, filterByValue, recieveBooks } from './../actions/books';
import { connect } from 'react-redux';
import Book from './../components/Book';
import './bookList.css';
import Pagination from './Pagination';
import { exportBooks, formatImportBook } from '../utils/helper';
import * as XLSX from 'xlsx';
import { getBookByVolume } from '../utils/api';
/**
 * @description Display list of books user has read 
 */
export class BookList extends Component {
    state = {
        data: []
    }

    componentDidUpdate(prevProps, _) {
        // if filter by value was applied but is now not applied and there are still filters, refresh the book list to apply the filter
        if (
            prevProps.books.appliedFilters.includes('FILTER_BY_VALUE') &&
            !this.props.books.appliedFilters.includes('FILTER_BY_VALUE') &&
            this.props.books.appliedFilters.length > 0
        ) {
            const filter = this.props.books.appliedFilters[0];
            switch (filter) {
                case 'SORT_BY_DATE':
                    this.props.sortByDate();
                    break;

                case 'SORT_BY_AUTHOR':
                    this.props.sortByAuthor();
                    break;
                default:
                    break;
            }
        }
    }

    handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet);

            console.log(sheetData);


            const getFormattedBooks = () => {
                return new Promise((res, rej) => {
                    let books = [];
                    const promises = sheetData.map(book => {
                        console.log(book.Id);
                        return getBookByVolume(book.Id, book.Title).then(res => {
                            console.log(res);
                            const googleBook = res
                            console.log(googleBook);
                            const { smallThumbnail: image } = googleBook.volumeInfo.imageLinks;
                            const { previewLink: link } = googleBook.volumeInfo;
                            const formattedBook = formatImportBook({
                                ...book,
                                link,
                                image,
                                id: googleBook.id
                            })
                            console.log(formattedBook);
                            books.push(formattedBook)
                            console.log(books);
                        })
                    })
                    Promise.all(promises)
                        .then(() => res(books))
                        .catch(err => rej(err));
                })
            }

            getFormattedBooks().then(books => this.props.recieveBooks(books))
        };

        reader.readAsBinaryString(file);
    };

    render() {
        const { books, filteredBooks, filteredPages } = this.props.books;
        return (
            <Fragment>
                <button
                    style={{ margin: '0px' }}
                    className="btn btn"
                    onClick={() => exportBooks(books)}>
                    Export Books
                </button>
                <input type="file" onChange={this.handleFileUpload} />
                {filteredPages > 0 && <Pagination />}
                <div className="books-grid">
                    {filteredBooks && filteredBooks !== null && filteredBooks.length > 0 ? (
                        filteredBooks.map((book, index) => (
                            <Book key={index} book={book} id={book.id} />
                        ))
                    ) : (
                        <h1>No Books</h1>
                    )}
                </div>
                {filteredPages > 0 && <Pagination />}
            </Fragment>
        );
    }
}

export default connect(
    ({ books, loadingBar }) => {
        return {
            books,
            loading: loadingBar
        };
    },
    { sortByAuthor, sortByDate, filterByValue, recieveBooks }
)(BookList);
