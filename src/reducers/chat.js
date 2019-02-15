import { actionTypes } from '../actions';
import { generateJID } from "../utils";

const initialState = { 
	callInfo: {}, 
	type: null, 
	unread: {}, 
	isBusy: false, 
	isOutcoming: false,
	isIncoming: false,
	isBusy: false,
	isCalling: false,
	isSpeaking: false,
};

export const communicateModal = (state = {...initialState}, action) => {
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
				isCalling: false,
				isSpeaking: false,
				isPickUp: false,
			 };
		case actionTypes.OPEN_COMMUNICATE_MODAL:
			return { 
				...state,
				type: action.modalType,
				person: action.person,
				isOutcoming: action.isOutcoming,
				isIncoming: action.isIncoming,
				isBusy: false,
				isCalling: false,
				isSpeaking: false,
				isPickUp: false,
            };
        case actionTypes.CHANGE_COMMUNICATION_TYPE: 
            return {
                ...state,
                type: action.modalType,
                isOutcoming: false,
				isIncoming: false,
                isBusy: false,
				isCalling: false,
				isSpeaking: false,
				isPickUp: false,
                callInfo: {},
            }
        case actionTypes.PROCESSING_CALL:
            return {
                ...state,
				isCalling: true,
				isBusy: false,
			}
		case actionTypes.SPEAKING:
            return {
                ...state,
				isSpeaking: true,
				isCalling: false,
				isBusy: false,
			}
		case actionTypes.STOP_COMMUNICATION:
			return {
				...state,
				isSpeaking: false,
				isCalling: false,
				isOutcoming: false,
				isIncoming: false,
				isBusy: false,
				isPickUp: false,
			}
		case actionTypes.CREATE_CALL:
			return { 
				...state,
				callInfo: {
					avTime: action.avTime,
                    callId: action.callId,
					callerId: action.callerId,
					info: '',
					error: false,
				},
				isBusy: false,
				isPickUp: false,
			};
		case actionTypes.CREATE_CALL_ERROR:
			return { 
				...state,
				callInfo: {
					info: action.info,
					error: true,
				},
			};
		case actionTypes.GET_CALL_INFO:
			return {
				...state,
				callInfo: {
                    callId: action.callId,
					callerId: action.callerId,
					info: '',
					error: false,
				},
			}
		case actionTypes.CHOOSE_CHAT_PERSON:
			const { person } = action;
			const chats = { ...state.unread };
			delete chats[generateJID(person.id, true)];
			return { 
				...state,
				unread: chats,
				type: null,
				person: {},
			};
		case actionTypes.CHANGE_UNREAD_MSG:
			return {
				...state,
				unread: {
					...state.unread,
					[action.from]: true,
				},
			}
		case actionTypes.CLEAR_CHATS:
			return {
				...state,
				unread: { },
			}
        case actionTypes.CALEE_IS_BUSY:
            return {
                ...state,
				isBusy: true,
				callInfo: {},
				type: null,
				person: {},
				isOutcoming: false,
				isIncoming: false,
				isCalling: false,
				isSpeaking: false,
				isPickUp: false,
			}
		case actionTypes.PICK_UP_CALL:
			return {
				...state,
				isPickUp: true,
			}
		default:
			return state;
	}
};