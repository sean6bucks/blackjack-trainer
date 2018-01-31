export const TYPES = {
	ADD_CARD: 'ADD_CARD',
	CHANGE_STATUS: 'CHANGE_STATUS'
}

export const DECK = {
	vals: [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ],
	suits: [ 'spades', 'hearts', 'clubs', 'diamonds' ]
}

export const HAND = {
	new: () => {
		return {
			dealer: {
				cards: [],
				value: 0
			},
			user: {
				cards: [],
				value: 0
			},
			result: {
				winner: '',
				message: ''
			}
		};
	}
}
