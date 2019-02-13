import { getUserDetails } from "../api/pros";
import { generateJID } from "./index";
import kUtils from "kurento-utils";

export const setMessages = (id, text, isMy, prevState) => {
	const _id = id.split('/')[0];
	return ({
    chats: {
		...prevState.chats, 
		[_id]: prevState.chats[_id] ? [ 
			...prevState.chats[_id], 
			{ text, isMy } 
		] : [ { text, isMy } ],
	}
})};

export const setUser = (user, prevState) => ({
    users: {
		...prevState.users, 
		[user.id]: { ...user },
	}
});

export const getUserInfo = async (id, userAuth, isPro = false) => {
	const _id = id.split('@')[0];
	return await getUserDetails(_id, userAuth, !isPro);
}

export const processServerMsg = (msg) => {
	const to = msg.getAttribute('to'),
		from = msg.getAttribute('from'),
		type = msg.getAttribute('type'),
		elems = msg.getElementsByTagName('body'),
		vcxepElems = msg.getElementsByTagName('vcxep');
	return {to, from, type, elems, vcxepElems};
}

export const processChatMsg = async (from, _userAuth, isPro, changeUnreadNum) => {
    changeUnreadNum(from.split('/')[0]);
    return await getUserInfo(from, _userAuth, isPro);
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