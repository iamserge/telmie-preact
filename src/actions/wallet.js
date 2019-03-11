import * as wallet from '../api/wallet';
import { apiUrls } from "../api";
import { actionTypes } from './index';


const modifyingCards = () => ({
	type: actionTypes.MODIFYING_CARDS
});
const getCardsSuccess = (cards) => ({
	type: actionTypes.GETING_CARDS_SUCCESS,
	cards,
});
const getCardsFailure = (message) => ({
	type: actionTypes.GETING_CARDS_FAILURE,
	message,
});

const modifyingBankAcc = () => ({
	type: actionTypes.MODIFYING_BANKS
});
const getBanksSuccess = (banks) => ({
	type: actionTypes.GETING_BANKS_SUCCESS,
	banks,
});
const getBanksFailure = (message) => ({
	type: actionTypes.GETING_BANKS_FAILURE,
	message,
});


export const getCreditCards = (authData) => async (dispatch) => {
	dispatch(modifyingCards());

	let response = await wallet.getCards(authData);

	(response.error) ? 
		dispatch(getCardsFailure(response.message || 'Error in getting cards.')) 
		: dispatch(getCardsSuccess(response));
}
export const deleteCreditCard = (token, authData) => async (dispatch) => {
	dispatch(modifyingCards());

	let response = await wallet.deleteCard(token, authData);

	(response.error) ? 
		dispatch(getCardsFailure(response.message || 'Error in deleting a card.')) 
		: dispatch(getCardsSuccess(response));
}

export const addCreditCard = (token, authData) => async (dispatch) => {
	dispatch(modifyingCards());

	let response = await wallet.addCard(token, authData);

	(response.error) ? 
		dispatch(getCardsFailure(response.message || 'Error in adding a card.')) 
		: dispatch(getCardsSuccess(response));
}

export const getBankAcc = (authData) => async (dispatch) => {
	dispatch(modifyingBankAcc());

    let response = await wallet.getBankAcc(authData);
    console.log('getBankAcc', response);

	(response.error) ? 
		dispatch(getBanksFailure(response.message || 'Error in getting bank accounts.')) 
		: dispatch(getBanksSuccess(response));
}
export const deleteBankAcc = (token, authData) => async (dispatch) => {
	dispatch(modifyingBankAcc());

	let response = await wallet.deleteBankAcc(token, authData);

	(response.error) ? 
		dispatch(getBanksFailure(response.message || 'Error in deleting an account.')) 
		: dispatch(getBanksSuccess(response));
}

export const addBankAcc = (token, authData) => async (dispatch) => {
	dispatch(modifyingCards());

	let response = await wallet.addBankAcc(token, authData);

	(response.error) ? 
		dispatch(getBanksFailure(response.message || 'Error in adding a card.')) 
		: dispatch(getBanksSuccess(response));
}