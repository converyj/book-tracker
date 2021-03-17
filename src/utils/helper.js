export const formatDate = (date) => {
	const newDate = new Date(date);
	return newDate.toLocaleDateString();
};

export const trancateTitle = (title, limit = 17) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(' ').reduce((acc, cur) => {
			// first word
			if (acc === 0 && cur.length > limit) {
				newTitle.push(cur.substring(0, limit - 1));
			}
			else if (acc + cur.length <= limit) {
				// next words
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);

		return `${newTitle.join(' ')}...`;
	}
	return title;
};

export function formatBook(book) {
	const { id, rate, comment, date, isLibraryBook } = book;
	const { infoLink: link, title, authors } = book.volumeInfo;
	const { smallThumbnail: image } = book.volumeInfo.imageLinks;
	return {
		id,
		title,
		authors,
		image,
		link,
		date,
		isLibraryBook,
		rate,
		comment
	};
}

export const addFilterIfNotExist = (filter, appliedFilters) => {
	let copyAppliedFilters = [
		...appliedFilters
	];

	let index = copyAppliedFilters.indexOf(filter);
	if (index === -1) {
		copyAppliedFilters.push(filter);
	}

	return copyAppliedFilters;
};

export const removeFilterIfExist = (filter, appliedFilters) => {
	let copyAppliedFilters = [
		...appliedFilters
	];
	let index = copyAppliedFilters.indexOf(filter);
	console.log(index);
	if (index >= 0) {
		copyAppliedFilters.splice(index, 1);
	}

	return copyAppliedFilters;
};
