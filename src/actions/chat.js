import * as chatAPI from '../api/chat';
import { actionTypes } from './index';

const createCallAction = (response) => ({
	type: actionTypes.CREATE_CALL,
	avTime: response.avTime,
    callId: response.id,
    callerId: response.callerId,
});

export const getCallInfo = (response) => dispatch => dispatch({
	type: actionTypes.GET_CALL_INFO,
    callId: response.id,
    callerId: response.callerId,
});

export const caleeIsBusy = () => dispatch => dispatch({
	type: actionTypes.CALEE_IS_BUSY,
});


export const closeComModal = () => (dispatch) => dispatch({
	type: actionTypes.CLOSE_COMMUNICATE_MODAL,
});

export const openComModal = (type, person, isOutcoming = false, isIncoming = false) => (dispatch) => dispatch({
	type: actionTypes.OPEN_COMMUNICATE_MODAL,
	modalType: type,
	person,
	isOutcoming,
	isIncoming,
});

export const changeComType = (type) => dispatch => dispatch({
    type: actionTypes.CHANGE_COMMUNICATION_TYPE,
    modalType: type,
});

export const createCall = (cid, isPro, auth) => async (dispatch) => {
	let response = await chatAPI.createCall(cid, isPro, auth);
	console.log(response);

	(response.error) ? 
		null
		: dispatch(createCallAction(response));

	
	/*dispatch(sendContactMessage());

	(response.error) ? 
		dispatch(sendContactMessageFailure(response.message)) 
		: dispatch(sendContactMessageSuccess());*/
};

export const setChatPerson = (person) => (dispatch) => dispatch({
	type: actionTypes.SET_CHAT_PERSON,
	person,
});

export const changeUnreadNum = (from, num = 1) => dispatch => dispatch({
	type: actionTypes.CHANGE_UNREAD_MSG,
	from,
	num,
})