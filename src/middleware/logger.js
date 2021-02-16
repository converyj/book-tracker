/* 
 - What the actions are when dispatched
 - What the new state is after
*/

const logger = (store) => (next) => (action) => {
	console.group(action.type);
	console.log('The action: ', action);
	const newState = next(action);
	console.log('The new state: ', store.getState());
	console.groupEnd();
	return newState;
};

export default logger;
