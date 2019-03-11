import { actionTypes } from '../actions';

export const creditCards = (state = {cards: [], error: false, loading: false}, action) => {
	switch (action.type) {

		case actionTypes.MODIFYING_CARDS:
			return {
				...state,
				cards: [],
				loading: true,
				error: false,
				errorMsg: '',
			}
		case actionTypes.GETING_CARDS_SUCCESS:
			return {
				...state,
				cards: action.cards,
				loading: false,
			}
		case actionTypes.GETING_CARDS_FAILURE:
			return {
				...state,
				error: true,
				errorMsg: action.message,
				loading: false,
			}

		default:
			return state;
	}
};

export const bankAccount = (state = {banks: [], error: false, loading: false}, action) => {
	switch (action.type) {

		case actionTypes.MODIFYING_BANKS:
			return {
				...state,
				banks: [],
				loading: true,
				error: false,
				errorMsg: '',
			}
		case actionTypes.GETING_BANKS_SUCCESS:
			return {
				...state,
				banks: action.banks,
				loading: false,
			}
		case actionTypes.GETING_BANKS_FAILURE:
			return {
				...state,
				error: true,
				errorMsg: action.message,
				loading: false,
			}

		default:
			return state;
	}
};