import { actionTypes } from '../actions';
import { concat, orderBy, map, without, uniqBy } from 'lodash';
import { EN, RU, langs } from "../utils/consts";


export const loggedInUser = (state = {}, action) => {
	let user;
	switch (action.type) {
		case actionTypes.LOG_IN_SUCCESS:
			user = action.userData;
			user.userAuth = action.userAuth;
			return user;

		case actionTypes.EDIT_SUCCESS:
			user = action.userData;
			user.userAuth = action.userAuth;
			return user;

		case actionTypes.LOGGED_OFF:
			return {};

		default:
			return state;
	}
};

export const localeGet = () => {
	const _path = window.location.pathname.split('/')[1];
	let _lang = '';
	Object.keys(langs).some(el => langs[el].code === _path ? (_lang = el, true) : false)

	return _lang;
}
export const locale = (state = { locale: localeGet() || EN  }, action) => {
	switch (action.type) {
		case actionTypes.CHANGE_LOCALE:
			const { lang = EN } = action;
			return {
				...state,
				locale: lang,
			};
		case actionTypes.CHANGE_LOCALE_LANGS:
			return {
				...state,
				languages: action.langs,
			};
		default:
			return state;
	}
};

export const logInError = (state = {}, action) => {
	switch (action.type) {

		case actionTypes.LOG_IN_FAILURE:
			let date = new Date();
			return date.getTime();

		default:
			return false;
	}
};

export const registerSuccess = (state = {}, action) => {
	switch (action.type) {

		case actionTypes.REGISTER_SUCCESS:
			return true;

		case actionTypes.LOG_IN_SUCCESS:
			return true;

		default:
			return false;
	}
};
export const registerFailureMessage = (state = "", action) => {
	switch (action.type) {

		case actionTypes.REGISTER_FAILURE:
			return action.message != null ? action.message : "";

		default:
			return "";
	}
};



export const resetSuccess = (state = false, action) => {
	switch (action.type) {

		case actionTypes.RESET_SUCCESS:
			return true;


		default:
			return false;
	}
};
export const resetFailure = (state = "", action) => {
	switch (action.type) {

		case actionTypes.RESET_FAILURE:
			return action.message;

		default:
			return "";
	}
};

export const proCalls = (state = [], action) => {
	switch (action.type) {

		case actionTypes.PRO_CALLS_RECEIVED:
			return action.calls;

		default:
			return state;
	}
};
//
export const personalCalls = (state = [], action) => {
	switch (action.type) {

		case actionTypes.PERSONAL_CALLS_RECEIVED:
			return action.calls;

		default:
			return state;
	}
};

export const activity = (state = [], action) => {
	let activity;
	switch (action.type) {
		case actionTypes.PERSONAL_CALLS_RECEIVED:
			let personalCalls = action.calls.results.map((activity)=>{
				let newActivity = activity;
				newActivity.type = "PERSONAL"
				return newActivity;
			});

			activity = state.concat(personalCalls);
			activity = orderBy(activity, 'date', 'desc');
			activity = map(activity, (entry) => {
				if (entry.status != 'SHORTLIST') return entry;
			});
			activity = without(activity, undefined);
			return activity.slice(0, 10);


		case actionTypes.PRO_CALLS_RECEIVED:
			let proCalls = action.calls.results.map((activity)=>{
				let newActivity = activity;
				newActivity.type = "PRO"
				return newActivity;
			});

			activity = state.concat(proCalls);
			activity = orderBy(activity, 'date', 'desc');

			activity = map(activity, (entry) => {
				if (entry.status != 'SHORTLIST') return entry;
			});
			activity = without(activity, undefined);

			return activity.slice(0, 10);

		default:
			return state;
	}

};


export const transactions = (state = [], action) => {
	switch (action.type) {

		case actionTypes.TRANSACTIONS_RECEIVED:
			let transactions = orderBy(action.transactions, 'date', 'desc');
			return transactions;

		default:
			return state;
	}
};


export const shortlistPros = (state = [], action) => {
	switch (action.type) {

		case actionTypes.SHORTLIST_RECEIVED:
			let shortlist = map(action.shortlist, (entry) => {
				if (entry.status == 'SHORTLIST') return entry.contact;
			});
			shortlist = without(shortlist, undefined);
			shortlist = uniqBy(shortlist, (pro)=> {
				return pro.id;
			})
			return shortlist;

		default:
			return state;
	}
};




export const verifySuccess = (state = {}, action) => {
	switch (action.type) {

		case actionTypes.VERIFY_SUCCESS:
			return true;


		default:
			return false;
	}
};
export const verifyFailure = (state = {}, action) => {
	switch (action.type) {

		case actionTypes.VERIFY_FAILURE:
			return true;

		default:
			return false;
	}
};


export const sendCodeSuccess = (state = "", action) => {
	switch (action.type) {

		case actionTypes.SEND_CODE_SUCCESS:
			return action.expired;


		default:
			return "";
	}
};
export const sendCodeFailureMessage = (state = "", action) => {
	switch (action.type) {

		case actionTypes.SEND_CODE_FAILURE:
			return action.message;

		default:
			return "";
	}
};

export const verifyCodeSuccess = (state = false, action) => {
	switch (action.type) {

		case actionTypes.VERIFY_CODE_SUCCESS:
			return true;


		default:
			return false;
	}
};
export const verifyCodeFailureMessage = (state = "", action) => {
	switch (action.type) {

		case actionTypes.VERIFY_CODE_FAILURE:
			return action.message;

		default:
			return "";
	}
};

export const dataFromServer = (state = {}, action) => {
	switch (action.type){
		case actionTypes.SET_CATEGORIES:
			let categories = action.categories.reduce((prevCategories, category) => {
				let name = category.name;

				return {
					categories: [...prevCategories.categories, name],
					subCategories: {
						...prevCategories.subCategories, 
						[name]: category.childs.map(categoryChild => categoryChild.name)
					},
				}

			}, {categories: [], subCategories: {}});

			return {
				...state,
				...categories,
			}
		default:
			return state;
	}
}

export const sendContactMessage = (state = {errorMsg: '', isSent: false}, action) => {
	switch (action.type) {

		case actionTypes.SEND_CONTACT_MESS:
			return {
				...state,
				isSent: false,
				errorMsg: '',
			}
		case actionTypes.SEND_CONTACT_MESS_FAILURE:
			return {
				...state,
				errorMsg: action.message != null ? action.message : ""
			}
		case actionTypes.SEND_CONTACT_MESS_SUCCESS:
			return {
				...state,
				isSent: true,
				errorMsg: '',
			}

		default:
			return state;
	}
};