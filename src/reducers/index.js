import { combineReducers } from 'redux';

const statusReducer = ( prevState='start', action ) => {
	switch( action.type ) {
		case 'CHANGE_STATUS':
			return action.text;
		default:
			return prevState;
	}
};

const shoeReducer = ( prevState=[], action ) => {
	switch( action.type ) {
		case 'NEW_SHOE':
			return action.payload;
		default:
			return prevState;
	}
};

const userReducer = ( prevState={
		cards: [],
		value: 0
	}, action ) => {
	switch(action.type) {
		case 'ADD_CARD':
			return {};
		default:
			return prevState;
	}
};

const dealerReducer = ( prevState={
		cards: [],
		value: 0
	}, action ) => {
	switch(action.type) {
		case 'ADD_CARD':
			return {};
		default:
			return prevState;
	}
};

const resultReducer = ( prevState={
		winner: '',
		message: ''
	}, action ) => {
	switch(action.type) {
		case 'UPDATE_RESULT':
			return {};
		default:
			return prevState;
	}
};

const discardedReducer = ( prevState=0, action ) => {
	switch(action.type) {
		case 'ADD_TO_DISCARDED':
			return prevState + action.value;
		default:
			return prevState;
	}
};

const rootReducer = combineReducers({
	status: statusReducer,
	shoe: shoeReducer,
	user: userReducer,
	dealer: dealerReducer,
	result: resultReducer,
	discarded: discardedReducer
});

export default rootReducer;
