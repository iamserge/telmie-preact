import { actionTypes } from '../actions';
import { generateJID } from "../utils";

export const communicateModal = (state = { type: null, unread: {}, isBusy: false, }, action) => {
	switch (action.type) {

		case actionTypes.CLOSE_COMMUNICATE_MODAL:
			return { 
				...state,
				callInfo: {},
				type: null,
				person: {},
				isOutcoming: false,
				isIncoming: false,
				isBusy: false,
			 };
		case actionTypes.OPEN_COMMUNICATE_MODAL:
			return { 
				...state,
				type: action.modalType,
				person: action.person,
				isOutcoming: action.isOutcoming,
				isIncoming: action.isIncoming,
            };
        case actionTypes.CHANGE_COMMUNICATION_TYPE: 
            return {
                ...state,
                type: action.modalType,
                isOutcoming: false,
				isIncoming: false,
                isBusy: false,
                callInfo: {},
            }
		case actionTypes.CREATE_CALL:
			return { 
				...state,
				callInfo: {
					avTime: action.avTime,
					callId: action.callId,
				},
			};
		case actionTypes.GET_CALL_INFO:
			return {
				...state,
				callInfo: {
					callId: action.callId,
				},
			}
		case actionTypes.SET_CHAT_PERSON:
			const { person } = action;
			const chats = { ...state.unread };
			delete chats[generateJID(person.id)];
			return { 
				...state,
				person,
				unread: chats,
			};
		case actionTypes.CHANGE_UNREAD_MSG:
			const {from, num} = action;
			return {
				...state,
				unread: {
					...state.unread,
					[from]: state.unread[from] ? state.unread[from] + num : num,
				},
            }
        case actionTypes.CALEE_IS_BUSY:
            return {
                ...state,
                isBusy: true,
            }
		default:
			return state;
	}
};