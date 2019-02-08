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
import { setMessages, setUser, prepareFromTo, 
	processServerMsg, processChatMsg, processCallMsg,
	reqGranted, reqForbidden, sendOfferData, sendAnswerData, onIceCandidate, videoCapture
} from './helpers'
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
			options:{
				mute: false,
				video: false,
				muteSpeaker: false,
			}
		};
		this.webRtcPeer;
		this.connection = new Strophe.Strophe.Connection('ws://sr461.2dayhost.com:5280/websocket', {});
		
	}		

	initializeConnection = (props) => {
		console.log('---=== initializeConnection ===---');
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
			this.sendPresence();

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
				this.connection.reset();
			}
		}
	}

	setMsg = (id, text, isMy = false) => this.setState(prev => setMessages(id, text, isMy, prev));

	setUsr = (user) => this.setState(prev => setUser(user, prev));

	getCallControls = () => ({
		mute: () => {
			console.log('mute');
			this.webRtcPeer.peerConnection.getLocalStreams()[0].getAudioTracks()[0].enabled = !this.state.options.mute;
			this.setState(prev => ({ options: {...prev.options, mute: !prev.options.mute}}));
		},
		muteSpeaker: () => this.setState(prev => ({ options: {...prev.options, muteSpeaker: !prev.options.muteSpeaker}})),
		video: () => {
			console.log('video mute');
			videoCapture(!this.state.options.video, this.msgGenSend, this.props);
			this.webRtcPeer.peerConnection.getLocalStreams()[0].getVideoTracks()[0].enabled = this.state.options.video;
			this.setState(prev => ({ options: {...prev.options, video: !prev.options.video}}));
		},
	})

	setAutoReject = () => this.autoRejectTimeout = setTimeout(() => this.rejectCall(true), 20000);
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
		const { to, from, type, elems, vcxepElems } = processServerMsg(msg);

		if (type == "chat" && elems.length > 0) {
			const userInfo = await processChatMsg(from, this._userAuth, this.props);
			this.setMsg(from, Strophe.Strophe.getText(elems[0]));
			userInfo && this.setUsr(userInfo);
		}

		if (type === 'vcxep' && vcxepElems.length > 0){
			const body = vcxepElems[0];
			const {type, callId, avtime, bodyInner} = processCallMsg(body);
			
			const { callInfo : cInfo = {} } = this.props.comModal;

			switch (type){
				case 'request':					
					if(cInfo.callId && cInfo.callId != callId){
						reqForbidden(callId, from, this.msgGenSend, this.props);
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
					this.undoAutoReject();
					(cInfo.callerId === this.props.user.id) ? 
						this.props.caleeIsBusy() : this.props.closeComModal();
					
					break;
				case 'forbidden':
					this.undoAutoReject();
					this.props.caleeIsBusy();
					break;
				case 'granted':
					this.undoAutoReject();
					this.props.processCall();
					//timer ???
					this.webRtcPeer = sendOfferData(this.msgGenSend, this.getOptions(), this.props);
					break;
				case 'offerData':
					this.props.processCall();
					this.webRtcPeer = sendAnswerData(bodyInner, this.msgGenSend, this.getOptions(), this.props);
					break;
				case 'answerData':
					this.webRtcPeer && this.webRtcPeer.processAnswer(bodyInner, (err) =>{
						err && console.log(err);
					});
					break;
				case 'accept':
					const address = prepareFromTo(this.props);
					this.msgGenSend(address, 'vcxep', 'vcxep', {type: 'speaking', callid: cInfo.callId});
					this.callSecondsInterval = setInterval(
						() => this.setState(prev => ({ callSec: prev.callSec + 1})),
						1000
					);
					break;
				case 'speaking':
					this.props.speaking();
					break;
				case 'avtimeEnded':
					this.setAutoFinish();
					break;
				case 'finished':
					this.stopCommunication();
					break;
				case 'candidateData':
					let obj = JSON.parse(bodyInner);
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

	sendPresence = () => {
		const from = generateJID(this.props.user.id);
		const m = Strophe.$pres({ from }).c("status", {}).t("Available");
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
		this.setState({ options: {
			mute: false,
			video: false,
			muteSpeaker: false,
		}})
	}

	requestGranted = () => reqGranted(this.msgGenSend, this.props);

	getVideoInput = (el) => this.videoInput = el;
	getVideoOutput = (el) => this.videoOutput = el;

	getOptions = () => ({
		localVideo : this.videoInput,
		remoteVideo : this.videoOutput,
		onicecandidate : onIceCandidate(this.msgGenSend, this.props)
	})

  	render(){
		const { type: modalType, person = {} } = this.props.comModal;

		modalType && document.body.classList.add("communicate-active");
		
		return modalType && (<div class={style.callAreaBackground}>
			{(modalType === consts.CHAT) && (
				<div class={style.callArea}>
					<Chat messages={this.state.chats[generateJID(person.id, true)]} 
						users = {this.state.users}
						communicateModal={this.props.comModal} 
						setChatPerson={this.props.setChatPerson}
						isConnected={this.state.isConnected}
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
						videoOptions = {this.state.options}
						callControls={this.getCallControls()}
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