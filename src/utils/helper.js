import saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs/dist/es5/exceljs.browser';
import { FlareSharp } from '@material-ui/icons';

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

export function formatExportBook(book) {
	const { title, authors, date, isLibraryBook, rate, comment } = book;
	return {
		title,
		authors: authors.join(','),
		date: formatDate(date),
		libaryBook: isLibraryBook ? 'Yes' : 'No',
		rate: `${rate}/5`,
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
	if (index >= 0) {
		copyAppliedFilters.splice(index, 1);
	}

	return copyAppliedFilters;
};

export const exportBooks = (books) => {
	console.log(books);
	const excel = create();
	const [
		workbook,
		worksheet
	] = excel;

	// add columns
	worksheet.columns = addColumns(Object.keys(formatExportBook(...books)), worksheet);

	// make the header bold
	// in Excel the rows are 1 based instead of 0 based
	worksheet.getRow(1).font = { bold: true };

	// add rows
	worksheet.addRows(addRows(Object.values(books), worksheet));

	// format rows
	let rowIndex = 1;
	for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
		worksheet.getRow(rowIndex).alignment = {
			vertical: 'middle',
			horizontal: 'left',
			wrapText: true
		};
		worksheet.getRow(rowIndex).border = {
			right: { style: 'thin' }
		};

		// // fill even rows
		// if (rowIndex % 2 === 0) {
		// 	worksheet.getRow(rowIndex).fill = {
		// 		type: 'pattern',
		// 		pattern: 'solid',
		// 		fgColor: { argb: 'E0E0E0E0' }
		// 	};
		// }
	}

	// add filters to columns
	worksheet.autoFilter = {
		from: {
			row: 1,
			column: 1
		},
		to: {
			row: 1,
			column: worksheet.columns.length
		}
	};

	// save excel worksheet
	saveFile(workbook).then(alert('File saved')).catch((err) => alert(err.message));
};

export const create = () => {
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet('my-books', {
		properties: { defaultColWidth: 20 },
		pageSetup: { orientation: 'landscape' }
	});

	return [
		workbook,
		sheet
	];
};

const addColumns = (names) => {
	return names.map((name) => {
		return {
			header: `${name.toString().charAt(0).toUpperCase()}${name.slice(1)}`,
			key: `${name.toString()}`
		};
	});
};

const addRows = (data) => {
	return data.map((val) => {
		return formatExportBook(val);
	});
};

const saveFile = async (workbook) => {
	workbook.xlsx.writeBuffer().then(function(buffer) {
		saveAs(
			new Blob(
				[
					buffer
				],
				{
					type:
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
				}
			),
			`my-books.xlsx`
		);
	});
};
