// ACTION TYPES
export const actionTypes = {
	CHANGE_LOCALE: 'CHANGE_LOCALE',
	USER_DETAILS_FETCHED: 'USER_DETAILS_FETCHED',
	HIDE_SEARCH_BOX: 'HIDE_SEARCH_BOX',
	SHOW_SEARCH_BOX: 'SHOW_SEARCH_BOX',
	LOG_IN_SUCCESS: 'LOG_IN_SUCCESS',
	LOG_IN_FAILURE: 'LOG_IN_FAILURE',
	PRO_CALLS_RECEIVED: 'PRO_CALLS_RECEIVED',
	PERSONAL_CALLS_RECEIVED: 'PERSONAL_CALLS_RECEIVED',
	TRANSACTIONS_RECEIVED: 'TRANSACTIONS_RECEIVED',
	AUTH_FAILURE: 'AUTH_FAILURE',
	REGISTER_SUCCESS: 'REGISTER_SUCCESS',
	REGISTER_FAILURE: 'REGISTER_FAILURE',
	LOGGED_OFF: 'LOGGED_OFF',
	EDIT_SUCCESS: 'EDIT_SUCCESS',
	SHORTLIST_RECEIVED: 'SHORTLIST_RECEIVED',
	EDIT_FAILURE: 'EDIT_FAILURE',
	FETCHING_REGISTRATION: 'FETCHING_REGISTRATION',
	VERIFY_FAILURE: 'VERIFY_FAILURE',
	VERIFY_SUCCESS: 'VERIFY_SUCCESS',
	RESET_SUCCESS: 'RESET_SUCCESS',
	RESET_FAILURE: 'RESET_FAILURE',
	PHOTO_UPLOADED: 'PHOTO_UPLOADED',
	SEND_CODE_SUCCESS: 'SEND_CODE_SUCCESS',
	SEND_CODE_FAILURE: 'SEND_CODE_FAILURE',
	FETCHING_SEND_CODE: 'FETCHING_SEND_CODE',
	VERIFY_CODE_FAILURE: 'VERIFY_CODE_FAILURE',
	VERIFY_CODE_SUCCESS: 'VERIFY_CODE_SUCCESS',
	SET_CATEGORIES: 'SET_CATEGORIES',
	SEND_CONTACT_MESS: 'SEND_CONTACT_MESS',
	SEND_CONTACT_MESS_FAILURE: 'SEND_CONTACT_MESS_FAILURE',
	SEND_CONTACT_MESS_SUCCESS: 'SEND_CONTACT_MESS_SUCCESS',
};

//export { getCart, addToCart, updateItemQuantity, basketActionSeen } from './cart';
const hideSearch = (facet) => ({
	type: actionTypes.HIDE_SEARCH_BOX
});



export const hideSearchBox = () => (dispatch) => {
	dispatch(hideSearch());
};
