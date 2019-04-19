import { getUserDetails } from "../../../api/pros";
import { generateJID } from "../../../utils";
import kUtils from "kurento-utils";

/*export const setMessages = (id, text, isMy, prevState) => {
	const _id = id.split('/')[0];
	return ({
    chats: {
		...prevState.chats, 
		[_id]: prevState.chats[_id] ? [ 
			...prevState.chats[_id], 
			{ text, isMy } 
		] : [ { text, isMy } ],
	}
})};*/

export const setUser = (user, prevState) => ({
    users: {
		...prevState.users, 
		[user.id]: { ...user },
	}
});

export const getUserInfo = async (id, userAuth, props) => {
	const pro = props.user.pro || {};
	const _id = id.split('@')[0];
	const isPro = (Object.keys(pro).length === 0);

	return await getUserDetails(_id, userAuth, isPro);
}

export const prepareFromTo = (props) => {
	const { user, comModal } = props;
	const to = comModal.person && generateJID(comModal.person.id, true);
	const from = generateJID(user.id);

	return {from, to};
}

export const processServerMsg = (msg) => {
	const to = msg.getAttribute('to'),
		from = msg.getAttribute('from'),
		type = msg.getAttribute('type'),
		elems = msg.getElementsByTagName('body'),
		vcxepElems = msg.getElementsByTagName('vcxep');
	return {to, from, type, elems, vcxepElems};
}

export const processChatMsg = async (from, _userAuth, props) => {
	let userInfo;
	const { person={} } = props.comModal;
	from.indexOf(person.id) !== 0 && (
		props.changeUnreadNum(from.split('/')[0]),
		userInfo = await getUserInfo(from, _userAuth, props)
	)
	return userInfo;
}

export const processCallMsg = (body) => {
	const type = body.getAttribute('type'),
		callId = body.getAttribute('callid'),
		avtime = body.getAttribute('avtime'),
		bodyInner = body.innerHTML;
	return {type, callId, avtime, bodyInner};
}

export const reqForbidden = (callId, _from, msgGenSend = ()=>{}, props) => {
	const { user } = props;
	const address = {
		from: generateJID(user.id),
		to: _from,
	};
	msgGenSend(address, 'vcxep', 'vcxep', {type: 'forbidden', callid: callId});
}

export const reqGranted = (msgGenSend = ()=>{}, props) => {
	const address = prepareFromTo(props);
	const { callInfo = {} } = props.comModal;
	msgGenSend(address, 'vcxep', 'vcxep', {type: 'granted', callid: callInfo.callId});
}

export const sendOfferData = (msgGenSend = ()=>{}, options = {}, props) => {
	const address = prepareFromTo(props);
	const { callInfo = {} } = props.comModal;

	const webRtcPeer = kUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(err){
		err && console.log(err); // & setCallState(NO_CALL);

		this.generateOffer(function(err, offerSdp) {
			err && console.log(err); // & setCallState(NO_CALL);
			msgGenSend(address, 'vcxep', 'vcxep', {type: 'offerData', callid: callInfo.callId}, offerSdp);
		});
	});

	return webRtcPeer;
}

export const sendAnswerData = (sdpOffer, msgGenSend = ()=>{}, options = {}, props) => {
	const address = prepareFromTo(props);
	const { callInfo = {} } = props.comModal;

	const webRtcPeer = kUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(err){
		err && console.log(err); // & setCallState(NO_CALL);
	
		this.processOffer(sdpOffer,(err, sdpAnswer) => {
			err && console.log(err); // & setCallState(NO_CALL);
			msgGenSend(address, 'vcxep', 'vcxep', {type: 'answerData', callid: callInfo.callId}, sdpAnswer);
			msgGenSend(address, 'vcxep', 'vcxep', {type: 'accept', callid: callInfo.callId});
			msgGenSend(address, 'vcxep', 'vcxep', {type: 'speaking', callid: callInfo.callId});
		})
	});

	return webRtcPeer;
}

export const onIceCandidate = (msgGenSend = ()=>{}, props) => (candidate) => candidateData(candidate, msgGenSend = ()=>{}, props);
function candidateData(candidate, msgGenSend = ()=>{}, props){
	const address = prepareFromTo(props);
	const { callInfo = {} } = props.comModal;
	const data = {
		sdp: candidate.candidate,
		sdpMid: candidate.sdpMid,
		index: candidate.sdpMLineIndex,
	}
	msgGenSend(address, 'vcxep', 'vcxep', {type: 'candidateData', callid: callInfo.callId}, JSON.stringify(data));
}

export const videoCapture = (isDisabled, msgGenSend = ()=>{}, props) => {
	const { callInfo = {} } = props.comModal;
	const address = prepareFromTo(props);
	const type = isDisabled ? "dis_video" : "en_video";
	msgGenSend(address, 'vcxep', 'vcxep', {type, callid: callInfo.callId});
}