import * as user from '../api/users';
import { actionTypes } from './index';
const setCookie = (name,value,days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

const eraseCookie = (name) => {
    document.cookie = name+'=; Max-Age=-99999999;';
}

const logInSuccess = (response, authData) => ({
	type: actionTypes.LOG_IN_SUCCESS,
	userData: response,
	userAuth: authData
});
const logInFailure = (response) => ({
	type: actionTypes.LOG_IN_FAILURE
});

const verifyFailure = (response, authData) => ({
	type: actionTypes.VERIFY_FAILURE,

});
const verifySuccess = (response) => ({
	type: actionTypes.VERIFY_SUCCESS
});

const loggedOff = (response) => ({
	type: actionTypes.LOGGED_OFF
});

const photoUploaded = (photo) => ({
	type: actionTypes.PHOTO_UPLOADED,
	photo
});

const editSuccess = (response, userAuth) => ({
	type: actionTypes.EDIT_SUCCESS,
  userData: response,
  userAuth: userAuth
});
const editFailure = () => ({
	type: actionTypes.EDIT_FAILURE,
});

const fetchingRegistration = () => ({
	type: actionTypes.FETCHING_REGISTRATION,
});
const registerSuccess = () => ({
	type: actionTypes.REGISTER_SUCCESS,
});
const registerFailure = () => ({
	type: actionTypes.REGISTER_FAILURE,
});

const resetSuccess = () => ({
	type: actionTypes.RESET_SUCCESS,
});
const resetFailure = () => ({
	type: actionTypes.RESET_FAILURE,
});

const authFailure = (response) => ({
	type: actionTypes.AUTH_FAILURE
});

const proCallsReceived = (response) => ({
	type: actionTypes.PRO_CALLS_RECEIVED,
	calls: response
});

const shortlistReceived = (response) => ({
	type: actionTypes.SHORTLIST_RECEIVED,
	shortlist: response
});


const personalCallsReceived = (response) => ({
	type: actionTypes.PERSONAL_CALLS_RECEIVED,
	calls: response
});

const transactionsReceived = (response) => ({
	type: actionTypes.TRANSACTIONS_RECEIVED,
	transactions: response
});

export const resetPassword = (email) => async (dispatch) => {
	const response = await user.resetPassword(email);
	if (Object.keys(response).length === 0) {
		dispatch(resetFailure());
	} else {
		dispatch(resetSuccess());
	}
};

export const logIn = (authData) => async (dispatch) => {
	const response = await user.logIn(authData);
	if (Object.keys(response).length === 0) {
		dispatch(logInFailure());
	} else {
		dispatch(logInSuccess(response, authData));
		setCookie('USER_AUTH', authData, 30);
	}
};

export const logOff = () => (dispatch) => {
	dispatch(loggedOff());
	eraseCookie('USER_AUTH');
};
export const register = (data) => async (dispatch) => {

	const response = await user.register(data);
	if (Object.keys(response).length === 0) {
		dispatch(registerFailure());
	} else {
		dispatch(registerSuccess(response));
		//dispatch(logIn(response.authData));
	}
};


export const verify = (token) => async (dispatch) => {

	const response = await user.verify(token);
	if (Object.keys(response).length === 0) {
		dispatch(verifyFailure());
	} else {
		dispatch(verifyFailure(response));
	}
};

export const editDetails = (data) => async (dispatch) => {
	const response = await user.editDetails(data);
	if (Object.keys(response).length === 0) {
		dispatch(editFailure());
	} else {

		dispatch(editSuccess(response, data.userAuth));

	}
};
export const fetchRegistration = () => (dispatch) => {
	dispatch(fetchingRegistration());
};
export const getShortlist = (authData) => async (dispatch) => {
	const response = await user.getCalls(authData, false);
	if (Object.keys(response).length === 0) {
		dispatch(authFailure());
	} else {
		dispatch(shortlistReceived(response));
	}
};

export const getProCalls = (authData) => async (dispatch) => {
	const response = await user.getCalls(authData, true);
	if (Object.keys(response).length === 0) {
		dispatch(authFailure());
	} else {
		dispatch(proCallsReceived(response));
	}
};

export const getPersonalCalls = (authData) => async (dispatch) => {
	const response = await user.getCalls(authData, false);
	if (Object.keys(response).length === 0) {
		dispatch(authFailure());
	} else {
		dispatch(personalCallsReceived(response));
	}
};


export const getTransactions = (authData) => async (dispatch) => {
	const response = await user.getTransactions(authData);

	dispatch(transactionsReceived(response));

};


export const uploadPhoto = (authData, photo) => async (dispatch) => {
	const photoUrl = await user.uploadPhoto(authData, photo);

	dispatch(photoUploaded(photoUrl));

};

