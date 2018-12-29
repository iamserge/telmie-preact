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
const fetchingSendCode = () => ({
	type: actionTypes.FETCHING_SEND_CODE,
});
const registerSuccess = () => ({
	type: actionTypes.REGISTER_SUCCESS,
});
const registerFailure = (message) => ({
	type: actionTypes.REGISTER_FAILURE,
	message
});

const resetSuccess = () => ({
	type: actionTypes.RESET_SUCCESS,
});
const resetFailure = (message) => ({
	type: actionTypes.RESET_FAILURE,
	message
});


const sendCodeSuccess = (expired) => ({
	type: actionTypes.SEND_CODE_SUCCESS,
	expired
});
const sendCodeFailure = (message) => ({
	type: actionTypes.SEND_CODE_FAILURE,
	message
});


const verifyCodeSuccess = () => ({
	type: actionTypes.VERIFY_CODE_SUCCESS,
});
const verifyCodeFailure = (message) => ({
	type: actionTypes.VERIFY_CODE_FAILURE,
	message
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

const setCategories = (response) => ({
	type: actionTypes.SET_CATEGORIES,
	categories: response
});

const sendContactMessageFailure = (message) => ({
	type: actionTypes.SEND_CONTACT_MESS_FAILURE,
	message
});
const sendContactMessageSuccess = () => ({
	type: actionTypes.SEND_CONTACT_MESS_SUCCESS
});
const sendContactMessage = () => ({
	type: actionTypes.SEND_CONTACT_MESS
});

export const changeLocale = (lang) => dispatch => {
	dispatch({
		type: actionTypes.CHANGE_LOCALE,
		lang,
	})
}

export const changeLocaleLangs = (langs = []) => dispatch => {
	dispatch({
		type: actionTypes.CHANGE_LOCALE_LANGS,
		langs: langs.map(el => el.lang || el),
	})
}

export const resetPassword = (email, password, code) => async (dispatch) => {
	const response = await user.resetPassword({email, password, code});
	if (response.error) {
		dispatch(resetFailure(response.message));
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
	
	if (response.error) {
		dispatch(registerFailure(response.message));
	} else {
		dispatch(logIn(response.authData));
	}
};

export const registerPro = (data, authData, isForUpdate = false) => async (dispatch) => {
	let response = isForUpdate ? 
		await user.updatePro(data, authData)
		: await user.registerPro(data, authData);

	if (response.error) {
		dispatch(registerFailure(response.message));
	} else {
		dispatch(logInSuccess(response, authData));
	}
}

export const getCategories = (authData) => async (dispatch) => {
	let response = await user.getCategories(authData);

	!response.error && dispatch(setCategories(response));
}


export const verify = (token) => async (dispatch) => {

	const response = await user.verify(token);
	if (Object.keys(response).length === 0) {
		dispatch(verifyFailure());
	} else {
		dispatch(verifyFailure(response));
	}
};

export const editDetails = (data, userAuth) => async (dispatch) => {
	const response = await user.editDetails(data, userAuth);
	(Object.keys(response).length === 0 || response.error) ?
		dispatch(editFailure())
		: dispatch(editSuccess(response, data.userAuth));
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

export const getProCalls = (authData, num) => async (dispatch) => {
	dispatch(proCallsReceived([]));
	const response = await user.getCalls(authData, num, true);
	if (Object.keys(response).length === 0) {
		dispatch(authFailure());
	} else {
		dispatch(proCallsReceived(response.results));
	}
};

export const getPersonalCalls = (authData, num) => async (dispatch) => {
	dispatch(personalCallsReceived([]));
	const response = await user.getCalls(authData, num, false);
	if (Object.keys(response).length === 0) {
		dispatch(authFailure());
	} else {
		dispatch(personalCallsReceived(response.results));
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


export const sendCode = (email, reason) => async (dispatch) => {

	const response = await user.sendCode(email, reason);
	if (response.error) {
		dispatch(sendCodeFailure(response.message));
		if (response.status == 36) {
			dispatch(sendCodeSuccess(response.expired));
		}
	} else {
		dispatch(sendCodeSuccess(response.expired));
	
		//dispatch(logIn(response.authData));
	}
};


export const verifyCode = (email, code) => async (dispatch) => {

	const response = await user.verifyCode(email, code);
	if (response.error) {
		dispatch(verifyCodeFailure(response.message));
	} else {
		dispatch(verifyCodeSuccess(response));
	}
};

export const fetchSendCode = () => (dispatch) => {
	dispatch(fetchingSendCode());
};

export const sendContactData = (data) => async (dispatch) => {
	dispatch(sendContactMessage());

	let response = await user.sendContactData(data);

	(response.error) ? 
		dispatch(sendContactMessageFailure(response.message)) 
		: dispatch(sendContactMessageSuccess());
}

export const clearContactData = () => (dispatch) => dispatch(sendContactMessage());