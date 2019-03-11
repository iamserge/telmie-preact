import { combineReducers } from 'redux';
import { actionTypes } from '../actions';

import * as user from './user';
import * as chat from './chat';
import * as wallet from './wallet'


const rootReducer = combineReducers({
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
	creditCards: wallet.creditCards,
	bankAccounts: wallet.bankAccount,
});

export default rootReducer;
