import 'date-fns';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import MomentUtils from '@date-io/moment';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { PropTypes } from 'prop-types';

/**
 * @description Responsible for allowing user to choose date they read book 
 */

export default function DatePicker({ handleDate }) {
	// The first commit of Material-UI
	const [
		selectedDate,
		setSelectedDate
	] = useState(moment());

	function handleDateChange(date) {
		setSelectedDate(date);
	}

	// set the date in the Search Form state and format it as ISOString
	useEffect(
		() => {
			if (selectedDate) {
				handleDate(selectedDate.format());
			}
		},
		[
			selectedDate
		]
	);

	return (
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<KeyboardDatePicker
				disableToolbar
				variant="inline"
				format="MM/DD/YYYY"
				margin="normal"
				id="date-pickr-inline"
				label="Date Read"
				value={selectedDate}
				onChange={handleDateChange}
				KeyboardButtonProps={{
					'aria-label': 'change date'
				}}
			/>
		</MuiPickersUtilsProvider>
	);
}

DatePicker.propTypes = {
	handleDate: PropTypes.func.isRequired
};
