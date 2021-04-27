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
	worksheet.columns = addColumns(Object.keys(formatExportBook(...books)), worksheet);
	// force the colums to be at least as long as their header row
	worksheet.columns.forEach((column) => {
		column.width = 20;
	});

	// make the header bold
	// in Excel the rows are 1 based instead of 0 based
	worksheet.getRow(1).font = { bold: true };

	worksheet.addRows(addRows(Object.values(books), worksheet));
	console.log(worksheet);

	let rowIndex = 1;
	for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
		worksheet.getRow(rowIndex).alignment = {
			vertical: 'middle',
			horizontal: 'left',
			wrapText: true
		};
	}

	// worksheet.addConditionalFormatting({
	// 	ref: 'E1:E36',
	// 	rules: [
	// 		{
	// 			type: 'iconSet',
	// 			showValue: false,
	// 			reverse: false,
	// 			custom: false,
	// 			cfvo: [
	// 				{
	// 					range: 'E1:E36'
	// 				}
	// 			],
	// 			style: {
	// 				fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FF00FF00' } }
	// 			}
	// 		}
	// 	]
	// });

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

	saveFile(books, workbook).then(alert('File saved')).catch((err) => alert(err.message));
};

export const create = () => {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.getWorksheet('my-books');
	const sheet = worksheet ? worksheet : workbook.addWorksheet('my-books');
	return [
		workbook,
		sheet
	];
};

const addColumns = (names) => {
	console.log(names);
	return names.map((name) => {
		// name = name.charAt(0).toUpperCase() + name.slice(1);
		return {
			header: `${name.toString().charAt(0).toUpperCase()}${name.slice(1)}`,
			key: `${name.toString()}`
		};
	});
};

const addRows = (data) => {
	return data.map((val, index) => {
		// row 1 is the header
		const rowIndex = index + 2;
		console.log(val);

		return formatExportBook(val);
	});

	// Add an array of rows
	// const rows = [
	// 	{ id: 6, name: 'Barbara', dob: new Date() }
	// ];
	// // add new rows and return them as array of row objects
	// return worksheet.addRows(rows);
};

const saveFile = async (cvsData, workbook) => {
	console.log(workbook);
	// await workbook.xlsx.writeFile('my-books.xlsx');
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
	// const ws = XLSX.utils.json_to_sheet(cvsData);
	// const wb = {
	// 	Sheets: { data: ws },
	// 	SheetNames: [
	// 		'data'
	// 	]
	// };
	// const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
	// const data = new Blob(
	// 	[
	// 		excelBuffer
	// 	],
	// 	{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }
	// );
	// saveAs(data, 'my-books.xlsx');
};
