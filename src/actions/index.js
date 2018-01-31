import { TYPES } from '../constants'

export const startSession = () => {
	return {
		type: TYPES.CHANGE_STATUS,
		text: 'deal'
	}
}

export const addCard = hand => {
	return {
		type: TYPES.ADD_CARD,
		payload: hand
	}
}
