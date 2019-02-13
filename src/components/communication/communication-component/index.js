import { h, Component } from 'preact';
import Strophe from 'npm-strophe'
import kUtils from "kurento-utils";
import { route } from 'preact-router';
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
	closeComModal, setChatPerson, changeUnreadNum, getCallInfo, caleeIsBusy, changeComType, processCall, speaking, stopCommunication,
	pickUp, 
} from '../../../actions/chat'

import { routes } from "../../app";

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
	
		this.connection = new Strophe.Strophe.Connection('wss://sr461.2dayhost.com:5281/websocket', {});
		
	}		


	componentWillUnmount(){
		this.autoRejectTimeout && this.undoAutoReject();
		(this.autoFinishTimeout || this.hideNotifTimeout) && this.undoAutoFinish();
		this.callSecondsInterval && this.undoCallSecInterval();
	}

	

	

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

	makeCall = (callInfo) => this.state.isConnected ? 
		this.callRequest(callInfo) : this.setState({ isDelayingCall: true });

	msgGenSend = (address, type, elemType, elemOptions = {}, body) => {
		
	}

	sendMessage = (msg) => {
		
	}

	callRequest = (callInfo) => {
		const address = prepareFromTo(this.props);
		this.setAutoReject();
		this.msgGenSend(address, 'vcxep', 'vcxep', {type: 'request', callid: callInfo.callId, avtime: callInfo.avTime});
	}

	// new func
	rejectCall = (isBusy = false) => {
		this.props.connection.rejectCall(isBusy);
		this.props.closeComModal();
	}

	// new func
	requestGranted = () => {
		route(routes.CLIENT_FOR_COMP + this.props.comModal.person.id + '#call');
		this.props.connection.reqGranted();
		this.props.pickUp();
	};

	getVideoInput = (el) => {
		this.videoInput = el
	}
	getVideoOutput = (el) => {
			this.videoOutput = el
	}

	getOptions = () => {
		console.log('[getOptions]', this.videoOutput, this.videoInput);
		return ({
			localVideo : this.videoOutput,
			remoteVideo : this.videoInput,
			onicecandidate : onIceCandidate(this.msgGenSend, this.props)
		})
	}

  	render(){
		const { type: modalType, person = {}, isOutcoming, isPickUp } = this.props.comModal;
		
		return modalType && !isOutcoming && !isPickUp && (<div class={style.callAreaBackground}>
			{(modalType === consts.CHAT) && (
				<div class={style.callArea}>
					<Chat 
						users = {this.props.users}
						communicateModal={this.props.comModal} 
						chooseChatPerson={this.props.chooseChatPerson}
						isConnected={this.props.isConnected}/>
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
						isConnected = {this.props.isConnected}
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
const mapStateToProps = (state) => ({
	user: state.loggedInUser
});

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
	pickUp,
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Communication);