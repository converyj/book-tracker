import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadNewPage, loadExactPage } from './../actions/books';
import { withRouter } from 'react-router-dom';
import './pagination.css';

/**
 * @description Responsible for handling the different pages
 */

class Pagination extends Component {
    // go to next page
    nextPage = () => {
        this.props.loadNewPage({ page: 1 });
    };

    // go to previous page
    previousPage = () => {
        this.props.loadNewPage({ page: -1 });
    };

    // go to exact page
    goToPage = (page) => {
        this.props.loadExactPage({ page });
    };

    render() {
        const { filteredPages, currentPage, totalPages } = this.props;
        return (
            <section className="pagination">
                <nav className="pagination-nav">
                    <div className="pagination-nav-buttons">
                        <button
                            className="btn pagination-previous"
                            onClick={this.previousPage}
                            disabled={currentPage <= 1 ? true : false}>
                            Previous Page
                        </button>
                        <button
                            className="btn pagination-next"
                            onClick={this.nextPage}
                            disabled={
                                filteredPages == currentPage || currentPage == totalPages ? true : false
                            }>
                            Next Page
                        </button>
                    </div>
                    <ul className="pagination-list">
                        {/* creates a new array with a length defined by filteredPages */}
                        {[
                            ...Array(filteredPages)
                        ].map((_, index) => (
                            <button
                                key={index}
                                className={`btn ${currentPage || filteredPages === index + 1 && 'is-current'}`}
                                onClick={() => this.goToPage(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                    </ul>
                </nav>
            </section>
        );
    }
}

export default withRouter(
    connect(
        ({ books }) => {
            return {
                filteredPages: books.filteredPages,
                totalPages: books.totalPages,
                currentPage: books.currentPage,
                filteredBooks: books.filteredBooks
            };
        },
        { loadExactPage, loadNewPage }
    )(Pagination)
);
