import 'date-fns';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import MomentUtils from '@date-io/moment';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export default function DatePicker({ handleDate }) {
	// The first commit of Material-UI
	const [
		selectedDate,
		setSelectedDate
	] = useState(moment());

	function handleDateChange(date) {
		setSelectedDate(date);
	}

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
