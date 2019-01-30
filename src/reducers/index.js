import { combineReducers } from 'redux';
import { actionTypes } from '../actions';

import * as user from './user';
import * as chat from './chat';

const hiddenSearchBoxReduxer = (state = {}, action) => {
	switch (action.type) {

		case actionTypes.HIDE_SEARCH_BOX:
			return true;

		default:
			return false;
	}
};



const rootReducer = combineReducers({
	hiddenSearchBox: hiddenSearchBoxReduxer,
	loggedInUser: user.loggedInUser,
	logInFailure: user.logInError,
	/*loggedInUserProCalls: user.proCalls,
	loggedInUserPersonalCalls: user.personalCalls,*/
	loggedInUserActivity: user.activity,
	loggedInUserTransactions: user.transactions,
	registerSuccess: user.registerSuccess,
	registerFailureMessage: user.registerFailureMessage,
	verifySuccess: user.verifySuccess,
	verifyFailure: user.verifyFailure,
	resetSuccess: user.resetSuccess,
	resetFailure: user.resetFailure,
	sendCodeSuccess: user.sendCodeSuccess,
	sendCodeFailureMessage: user.sendCodeFailureMessage,
	verifyCodeSuccess: user.verifyCodeSuccess,
	verifyCodeFailureMessage: user.verifyCodeFailureMessage,
	dataFromServer: user.dataFromServer,
	sendContactMessage: user.sendContactMessage,
	locale: user.locale,
	communicateModal: chat.communicateModal,
});

export default rootReducer;
