import { h, Component } from 'preact';
import Strophe from 'npm-strophe'
import kUtils from "kurento-utils";
import style from './style.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';

import Chat from "../chat";
import Call from "../call";
import Notification from "../notification";
import { consts } from "../../../utils/consts";
import { getCookie } from "../../../utils/index";
import { generateJID } from "../../../utils";
import { getCallDetails } from "../../../api/pros";
import { setMessages, setUser, getUserInfo, prepareFromTo } from './helpers'
import { 
	closeComModal, setChatPerson, changeUnreadNum, getCallInfo, caleeIsBusy, changeComType, processCall, speaking, stopCommunication
} from '../../../actions/chat'

class Communication extends Component {
	constructor(props){
		super(props);
		this.state= {
			chats: {},
			users: {},
			showNotif: false,
			isConnected: false,
			isDelayingCall: false,
			callSec: 0,
		};
		this.webRtcPeer;
		this.connection = new Strophe.Strophe.Connection('ws://sr461.2dayhost.com:5280/websocket', {});
		
	}		

	initializeConnection = (props) => {
		const {user = {}} = props;
		if (Object.keys(user).length === 0) return;

		const { userAuth, id } = user;
		this._userAuth = userAuth || getCookie('USER_AUTH');
		this.connection.connect(generateJID(id),'', this.onConnect);
		this.connection.rawInput = (data) => {
			console.log('rawInput:', data);
		};
		this.connection.rawOutput = (data) => {
			console.log('rawOutput:', data);
		};
	}

	componentDidMount(){
		this.initializeConnection(this.props);
	}

	componentWillReceiveProps(nextProps){
		const {user : prevUser = {}} = this.props;
		(Object.keys(prevUser).length === 0) 
			&& this.initializeConnection(nextProps);

		!nextProps.comModal.type && this.props.comModal.type && document.body.classList.remove("communicate-active");

		(this.props.comModal.type === consts.CALL && this.props.comModal.isOutcoming 
			&& !this.props.comModal.isBusy && !nextProps.comModal.isBusy 
			&& !this.props.comModal.isCalling && !nextProps.comModal.isCalling
			&& nextProps.comModal.callInfo.callId)
				&& this.makeCall(nextProps.comModal.callInfo);
	}

	componentWillUnmount(){
		this.autoRejectTimeout && this.undoAutoReject();
		(this.autoFinishTimeout || this.hideNotifTimeout) && this.undoAutoFinish();
		this.callSecondsInterval && this.undoCallSecInterval();
	}

	onConnect = (status) => {		
		
		if (status == Strophe.Strophe.Status.CONNECTED) {
			console.log('Strophe is connected.');
			this.connection.addHandler(this.onMessage, null, 'message', null, null, null);

			this.state.isDelayingCall && this.callRequest(this.props.comModal.callInfo);
			this.setState({ isConnected: true, isDelayingCall: false });

		} else {
			this.setState({ isConnected: false });
			if (status == Strophe.Strophe.Status.CONNECTING) {
				console.log('Strophe is connecting.');
			} else if (status == Strophe.Strophe.Status.CONNFAIL) {
				console.log('Strophe failed to connect.');
			} else if (status == Strophe.Strophe.Status.DISCONNECTING) {
				console.log('Strophe is disconnecting.');
			} else if (status == Strophe.Strophe.Status.DISCONNECTED) {
				console.log('Strophe is disconnected.');
				//this.initializeConnection(props);
			}
		}
	}

	setMsg = (id, text, isMy = false) => this.setState(prev => setMessages(id, text, isMy, prev));

	setUsr = (user) => this.setState(prev => setUser(user, prev));

	

	setAutoReject = () => {
		this.autoRejectTimeout = setTimeout(() => {
			this.rejectCall(true);
		}, 20000);
	}
	undoAutoReject = () => {
		clearTimeout(this.autoRejectTimeout);
		this.autoRejectTimeout = null;
	}

	setAutoFinish = () => {
		this.autoFinishTimeout = setTimeout(this.finishCall, 60000);
		this.hideNotifTimeout = setTimeout(this.hideNotif, 5000);
		this.setState({ showNotif: true });
	}
	undoAutoFinish = () => {
		clearTimeout(this.autoFinishTimeout);
		clearTimeout(this.hideNotifTimeout);
		this.autoFinishTimeout = null;
		this.hideNotifTimeout = null;
	}

	undoCallSecInterval = () => {
		clearInterval(this.callSecondsInterval);
		this.callSecondsInterval = null;
	}

	hideNotif = () => {
		this.setState({ showNotif: false });
		clearTimeout(this.hideNotifTimeout);
		this.hideNotifTimeout = null;
	};

	onClose = () => {
		this.autoRejectTimeout && (
			this.undoAutoReject(),
			this.rejectCall()
		)
		this.props.closeComModal();
	}

	changeType = (type) => {
		this.undoAutoReject();
		this.props.changeComType(type);
	}

	onMessage = async (msg) => {
		console.log('---=== [onMessage] ===---');
		const to = msg.getAttribute('to'),
			from = msg.getAttribute('from'),
			type = msg.getAttribute('type'),
			elems = msg.getElementsByTagName('body'),
			vcxepElems = msg.getElementsByTagName('vcxep');


		if (type == "chat" && elems.length > 0) {
			let body = elems[0];
			let userInfo = null;

			const { person={} } = this.props.comModal;

			from.indexOf(person.id) !== 0 && (
				this.props.changeUnreadNum(from),
				userInfo = await getUserInfo(from, this._userAuth, this.props)
			)

			this.setMsg(from, Strophe.Strophe.getText(body));
			userInfo && this.setUsr(userInfo);
		}

		if (type === 'vcxep' && vcxepElems.length > 0){
			let body = vcxepElems[0];

			const type = body.getAttribute('type'),
				callId = body.getAttribute('callid'),
				avtime = body.getAttribute('avtime');
			
			const { callInfo : cInfo = {} } = this.props.comModal;

			switch (type){
				case 'request':					
					if(cInfo.callId && cInfo.callId != callId){
						this.requestForbidden(callId, from);
						break;
					}
					const callInfo = await getCallDetails(callId, this._userAuth);
					if (callInfo.status && callInfo.status.toLowerCase() === 'active') {
						this.props.getCallInfo(callInfo);
			
						const { consultant = {}, consulted ={}, callerId } = callInfo;
						const person = consultant.id === callerId ? {...consultant} : {...consulted};
			
						this.props.openComModal(consts.CALL, person, false, true);
					}
					break;
				case 'reject':
					console.log('REJECTED');
					this.undoAutoReject();
					(cInfo.callerId === this.props.user.id) ? 
						this.props.caleeIsBusy() : this.props.closeComModal();
					
					break;
				case 'forbidden':
					console.log('forbidden');
					this.undoAutoReject();
					this.props.caleeIsBusy();
					break;
				case 'granted':
					console.log('granted');
					this.undoAutoReject();
					this.props.processCall();
					//timer ???
					this.sendOfferData();
					break;
				case 'offerData':
					console.log('offerData');
					this.props.processCall();
					let sdpOffer = body.innerHTML;
					//this.webRtcPeer && this.webRtcPeer.processAnswer(sdpOffer);
					this.sendAnswerData(sdpOffer);
					break;
				case 'answerData':
					console.log('answerData');
					let sdpAnswer = body.innerHTML;
					this.webRtcPeer && this.webRtcPeer.processAnswer(sdpAnswer,(err) =>{
						err && console.log(err);
					});
					//this.callAccepted();
					break;
				case 'accept':
					console.log('accept');
					const address = prepareFromTo(this.props);
					this.msgGenSend(address, 'vcxep', 'vcxep', {type: 'speaking', callid: cInfo.callId});
					this.callSecondsInterval = setInterval(
						() => this.setState(prev => ({ callSec: prev.callSec + 1})),
						1000
					);
					break;
				case 'speaking':
					console.log('speaking');
					this.props.speaking();

					// check callerId and send 1 more speaking-type msg
					break;
				case 'avtimeEnded':
					this.setAutoFinish();
					break;
				case 'finished':
					this.stopCommunication();
					break;
				case 'candidateData':
					let txt = body.innerHTML;
					let obj = JSON.parse(txt);
					// check for the Object instance
					let candidate = {
						candidate: obj.sdp,
						sdpMid: obj.sdpMid,
						sdpMLineIndex: obj.index,
					}
					this.webRtcPeer && this.webRtcPeer.addIceCandidate(candidate);
					break;
			}
		}
		return true;
	}

	makeCall = (callInfo) => this.state.isConnected ? 
		this.callRequest(callInfo) : this.setState({ isDelayingCall: true });

	msgGenSend = (address, type, elemType, elemOptions = {}, body) => {
		const { from, to } = address;
		const m = body ? 
			Strophe.$msg({ from, to, type }).c(elemType, elemOptions).t(body) 
			: Strophe.$msg({ from, to, type }).c(elemType, elemOptions);

		this.connection.send(m);
	}

	sendMessage = (msg) => {
		const address = prepareFromTo(this.props);
		this.setMsg(address.to, msg, true);
		this.msgGenSend(address, 'chat', 'body', {}, msg);
	}

	callRequest = (callInfo) => {
		const address = prepareFromTo(this.props);
		this.setAutoReject();
		this.msgGenSend(address, 'vcxep', 'vcxep', {type: 'request', callid: callInfo.callId, avtime: callInfo.avTime});
	}

	rejectCall = (isBusy = false) => {
		this.undoAutoReject();

		const address = prepareFromTo(this.props);
		const { callInfo = {} } = this.props.comModal;
		this.msgGenSend(address, 'vcxep', 'vcxep', {type: 'reject', callid: callInfo.callId});
		isBusy === true ? this.props.caleeIsBusy() : this.props.closeComModal();
	}

	finishCall = () => {
		this.undoAutoFinish();

		const { callInfo = {} } = this.props.comModal;
		const address = prepareFromTo(this.props);
		this.msgGenSend(address, 'vcxep', 'vcxep', {type: 'finished', callid: callInfo.callId});
		this.stopCommunication();
	}

	stopCommunication = () => {
		//this.props.stopCommunication();
		this.undoCallSecInterval();
		this.props.closeComModal();
		this.webRtcPeer && (
			this.webRtcPeer.dispose(),
			this.webRtcPeer = null
		);
	}

	requestForbidden = (callId, _from) => {
		console.log('requestForbidden');
		const { user } = this.props;
		const address = {
			from: generateJID(user.id),
			to: _from,
		};
		this.msgGenSend(address, 'vcxep', 'vcxep', {type: 'forbidden', callid: callId});
	}

	requestGranted = () => {
		console.log('requestGranted');
		const address = prepareFromTo(this.props);
		const { callInfo = {} } = this.props.comModal;
		this.msgGenSend(address, 'vcxep', 'vcxep', {type: 'granted', callid: callInfo.callId});
	}

	getVideoInput = (el) => this.videoInput = el;
	getVideoOutput = (el) => this.videoOutput = el;

	getOptions = () => ({
		localVideo : this.videoInput,
		remoteVideo : this.videoOutput,
		onicecandidate : this.onIceCandidate
	})

	sendOfferData = () => {
		console.log('sendOfferData');
		const address = prepareFromTo(this.props);
		const { callInfo = {} } = this.props.comModal;
		let that = this;

		this.webRtcPeer = kUtils.WebRtcPeer.WebRtcPeerSendrecv(this.getOptions(), function(err){
			err && console.log(err); // & setCallState(NO_CALL);
		
			this.generateOffer(function(err, offerSdp) {
				err && console.log(err); // & setCallState(NO_CALL);
		
				that.msgGenSend(address, 'vcxep', 'vcxep', {type: 'offerData', callid: callInfo.callId}, offerSdp);
				
			});
		});
	}

	sendAnswerData = (sdpOffer) => {
		console.log('sendAnswerData');
		const address = prepareFromTo(this.props);
		const { callInfo = {} } = this.props.comModal;
		let that = this;

		this.webRtcPeer = kUtils.WebRtcPeer.WebRtcPeerSendrecv(this.getOptions(), function(err){
			err && console.log(err); // & setCallState(NO_CALL);
		
			this.processOffer(sdpOffer,(err, sdpAnswer) => {
				err && console.log(err); // & setCallState(NO_CALL);

				that.msgGenSend(address, 'vcxep', 'vcxep', {type: 'answerData', callid: callInfo.callId}, sdpAnswer);
				that.msgGenSend(address, 'vcxep', 'vcxep', {type: 'accept', callid: callInfo.callId});
				that.msgGenSend(address, 'vcxep', 'vcxep', {type: 'speaking', callid: callInfo.callId});
			})
		});
	}


	onIceCandidate = (candidate) => {
		console.log('[onIceCandidate]', candidate);
		this.candidateData(candidate);
	}

	candidateData = (candidate) => {
		console.log('candidateData');
		const address = prepareFromTo(this.props);
		const { callInfo = {} } = this.props.comModal;
		const data = {
			sdp: candidate.candidate,
			sdpMid: candidate.sdpMid,
			index: candidate.sdpMLineIndex,
		}
		this.msgGenSend(address, 'vcxep', 'vcxep', {type: 'candidateData', callid: callInfo.callId}, JSON.stringify(data));
	}


  	render(){
		const { type: modalType, person = {} } = this.props.comModal;

		modalType && document.body.classList.add("communicate-active");
		
		return modalType && (<div class={style.callAreaBackground}>
			{(modalType === consts.CHAT) && (
				<div class={style.callArea}>
					<Chat messages={this.state.chats[generateJID(person.id)]} 
						users = {this.state.users}
						communicateModal={this.props.comModal} 
						setChatPerson={this.props.setChatPerson}
						onSend={this.sendMessage}/>
				</div>
			)}
			{(modalType === consts.CALL) && (
				<div class={style.callArea}>
					<Call communicateModal={this.props.comModal}
						seconds={this.state.callSec}
						changeType={this.changeType}
						closeModal={this.onClose}
						pickUp = {this.requestGranted}
						rejectCall={this.rejectCall} 
						finishCall={this.finishCall}
						getVideoOutput={this.getVideoOutput}
						isConnected = {this.state.isConnected}
						getVideoInput={this.getVideoInput}/>
				</div>
			)}
			<div class={style.closeBtn} onClick={this.onClose}/>
			<Notification isShown={this.state.showNotif} onClick={this.hideNotif}/>
		</div>)
  	}
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
	closeComModal,
	changeUnreadNum,
	setChatPerson,
	getCallInfo,
	caleeIsBusy,
	changeComType,
	processCall,
	speaking,
	stopCommunication,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Communication);