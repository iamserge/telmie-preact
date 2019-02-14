import { getUserDetails } from "../api/pros";
import { generateJID } from "./index";
import { consts } from "../utils/consts";
import kUtils from "kurento-utils";

export const setMessages = (id, msg, isMy, prevState) => {
	const _id = id.split('/')[0];
	return ({
    chats: {
		...prevState.chats, 
		[_id]: prevState.chats[_id] ? [ 
			...prevState.chats[_id], 
			{ ...msg, isMy } 
		] : [ { ...msg, isMy } ],
	}
})};
export const setMessageHistory = (id, msgArr, count, prevState) => {
	const _id = id.split('/')[0];
	return ({
    chats: {
		...prevState.chats, 
		[_id]: prevState.chats[_id] ? [
			...msgArr,
			...prevState.chats[_id]
		] : [ ...msgArr ],
	},
	received: count,
})};
export const setUser = (user, prevState) => ({
    users: {
		...prevState.users, 
		[user.id]: { ...user },
	}
});

export const processServerMsg = (msg) => {
	const to = msg.getAttribute('to'),
		from = msg.getAttribute('from'),
		type = msg.getAttribute('type'),
		id = msg.getAttribute('id'),
		elems = msg.getElementsByTagName('body'),
		thread = msg.getElementsByTagName('thread'),
		vcxepElems = msg.getElementsByTagName('vcxep');
	return {to, from, type, id, elems, thread, vcxepElems};
}

export const processChatMsg = async (thread, _userId, _userAuth, changeUnreadNum) => {
	let fromId, isPro;
	
	const participants = thread ? thread.split('-') : [];
	const userThreadPosition = participants.indexOf(_userId.toString());

	userThreadPosition === consts.THREAD.IS_CLIENT ? (
		fromId = participants[consts.THREAD.IS_PRO],
		isPro = true
	) : (
		fromId = participants[consts.THREAD.IS_CLIENT],
		isPro = false
	);
	
	changeUnreadNum(generateJID(fromId, true)); 
	const _usr = await getUserDetails(fromId, _userAuth, isPro) || {};
	return { ..._usr, isUserPro: isPro };
}

export const processCallMsg = (body) => {
	const type = body.getAttribute('type'),
		callId = body.getAttribute('callid'),
		avtime = body.getAttribute('avtime'),
		bodyInner = body.innerHTML;
	return {type, callId, avtime, bodyInner};
}

export const reqForbidden = (callId, from, to, msgGenSend = ()=>{}) => {
	msgGenSend(from, to, 'vcxep', 'vcxep', {type: 'forbidden', callid: callId});
}

/*export const reqGranted = (msgGenSend = ()=>{}, props) => {
	const address = prepareFromTo(props);
	const { callInfo = {} } = props.comModal;
	msgGenSend(address, 'vcxep', 'vcxep', {type: 'granted', callid: callInfo.callId});
}*/

export const sendOfferData = (from, to, msgGenSend = ()=>{}, options = {}, cInfo) => {

	const webRtcPeer = kUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(err){
		err && console.log(err); // & setCallState(NO_CALL);

		this.generateOffer(function(err, offerSdp) {
			err && console.log(err); // & setCallState(NO_CALL);
			msgGenSend(from, to, 'vcxep', 'vcxep', {type: 'offerData', callid: cInfo.callId}, offerSdp);
		});
	});

	return webRtcPeer;
}

export const sendAnswerData = (from, to, sdpOffer, msgGenSend = ()=>{}, options = {}, cInfo) => {
	const webRtcPeer = kUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(err){
		err && console.log(err); // & setCallState(NO_CALL);
	
		this.processOffer(sdpOffer,(err, sdpAnswer) => {
			err && console.log(err); // & setCallState(NO_CALL);
			msgGenSend(from, to, 'vcxep', 'vcxep', {type: 'answerData', callid: cInfo.callId}, sdpAnswer);
			msgGenSend(from, to, 'vcxep', 'vcxep', {type: 'accept', callid: cInfo.callId});
			msgGenSend(from, to, 'vcxep', 'vcxep', {type: 'speaking', callid: cInfo.callId});
		})
	});

	return webRtcPeer;
}

export const onIceCandidate = (from, to, cInfo, msgGenSend = ()=>{}) => (candidate) => candidateData(from, to, cInfo, candidate, msgGenSend);
function candidateData(from, to, cInfo, candidate, msgGenSend){
	const data = {
		sdp: candidate.candidate,
		sdpMid: candidate.sdpMid,
		index: candidate.sdpMLineIndex,
	}
	msgGenSend(from, to, 'vcxep', 'vcxep', {type: 'candidateData', callid: cInfo.callId}, JSON.stringify(data));
}

export const videoCapture = (isDisabled, msgGenSend = ()=>{}, props) => {
	const { callInfo = {} } = props.comModal;
	const address = prepareFromTo(props);
	const type = isDisabled ? "dis_video" : "en_video";
	msgGenSend(address, 'vcxep', 'vcxep', {type, callid: callInfo.callId});
}