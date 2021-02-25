export const getBooksLS = () => {
	return JSON.parse(localStorage.getItem('books'));
	// return [
	// 	{
	// 		id: '1',
	// 		title: 'Great Alone',
	// 		author: 'Susan Greene',
	// 		comment: '',
	// 		date: '',
	// 		image:
	// 			'http://books.google.com/books/content?id=5N4PwQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'
	// 	},
	// 	{
	// 		id: '2',
	// 		title: 'The Unexpected',
	// 		author: 'John Olsen',
	// 		comment: '',
	// 		date: ''
	// 	},
	// 	{
	// 		id: '3',
	// 		title: 'Great Alone',
	// 		author: 'Susan Greene',
	// 		comment: '',
	// 		date: '',
	// 		image:
	// 			'http://books.google.com/books/content?id=5N4PwQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'
	// 	},
	// 	{
	// 		id: '4',
	// 		title: 'The Unexpected',
	// 		author: 'John Olsen',
	// 		comment: '',
	// 		date: ''
	// 	},
	// 	{
	// 		id: '5',
	// 		title: 'Great Alone',
	// 		author: 'Susan Greene',
	// 		comment: '',
	// 		date: '',
	// 		image:
	// 			'http://books.google.com/books/content?id=5N4PwQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'
	// 	},
	// 	{
	// 		id: '6',
	// 		title: 'The Unexpected',
	// 		author: 'John Olsen',
	// 		comment: '',
	// 		date: ''
	// 	}
	// ];
};

export const searchBook = (query) => {
	return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`).then((res) => {
		return res.json().then((data) => {
			return data.items;
		});
	});
};

export const saveBooksLS = (book) => {
	const books = [];
	books.push(book);
	let bookList = JSON.parse(localStorage.getItem('books'));
	// if bookList already exist
	if (bookList) {
		console.log('exist');
		bookList.push(book);
		localStorage.setItem('books', JSON.stringify(bookList));
	}
	else {
		// if bookList does not exist
		localStorage.setItem('books', JSON.stringify(books));
	}
};
