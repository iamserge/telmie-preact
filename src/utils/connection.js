import Strophe from 'npm-strophe'
import { getCookie, generateJID } from "./index";

import {
    processServerMsg, processChatMsg, processCallMsg,
    reqForbidden, sendOfferData, sendAnswerData, onIceCandidate,
} from './con-helpers'
import { getCallDetails } from "../api/pros";

import { consts } from "../utils/consts";
    

class Connection{
    constructor(props){
        this.connection = new Strophe.Strophe.Connection('wss://sr461.2dayhost.com:5281/websocket', {});

        this._userAuth = "";
        this._curUserId = 0;
        this._curUserJID = '';

        this._calleeId = '';
        this._calleeJID = '';

        this.props = props;
        console.log('Connection props:',props);

        this.webRtcPeer;
    };

    initializeConnection = (props) => {
        const {userData : user = {}} = props;
        if (Object.keys(user).length === 0) return;
    
        const { userAuth, id, pro } = user;
        this._isPro = !!pro;
        this._curUserId = id;
        this._curUserJID = generateJID(this._curUserId);
        this._userAuth = userAuth || getCookie('USER_AUTH');
        this.connection.connect(this._curUserJID, '', this.onConnect);
        this.connection.rawInput = (data) => {
            console.log('rawInput:', data);
        };
        this.connection.rawOutput = (data) => {
            console.log('rawOutput:', data);
        };
    }

    disconnect = () => {
        this._userAuth = "";
        this._curUserId = 0;
        this._curUserJID = '';
        this._isPro = false;
        this._calleeId = '';
        this._calleeJID = '';
        this.connection.disconnect();
    };

    onConnect = (status) => {		
    
        console.log('[onConnect] connection', { ...this.connection });
    
        if (status == Strophe.Strophe.Status.CONNECTED) {
            console.log('Strophe is connected.');
            this.connection.addHandler(this.onMessage, null, 'message', null, null, null);
            this.sendPresence();
    
            /*this.state.isDelayingCall && this.callRequest(this.props.comModal.callInfo);
            this.setState({ isDelayingCall: false });*/
            this.props.changeConnectedState(true);
    
        } else {
            this.props.changeConnectedState(false);
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

    onMessage = async (msg) => {
        const { to, from, type, elems, vcxepElems } = processServerMsg(msg);
    
        if (type == "chat" && elems.length > 0) {
            const userInfo = await processChatMsg(from, this._userAuth, this._isPro, this.props.changeUnreadNum);
            console.log('new msg from: ', userInfo);
            this.props.setMsg(from, Strophe.Strophe.getText(elems[0]));
            userInfo && this.props.setUsr(userInfo);
        }
    
        if (type === 'vcxep' && vcxepElems.length > 0){
            const body = vcxepElems[0];
            const {type, callId, avtime, bodyInner} = processCallMsg(body);
            
            const cInfo = this.props.getCInfo() || {};
            const options = {
                localVideo : this.videoOutput,
                remoteVideo : this.videoInput,
                onicecandidate : onIceCandidate(this._curUserJID, this._calleeJID, cInfo, this.msgGenSend)
            };
    
            switch (type){
                case 'request':	
                    console.log('type - request');
                    if(cInfo.callId && cInfo.callId != callId){
                        reqForbidden(callId, this._curUserJID, from, this.msgGenSend);
                        break;
                    }
                    const callInfo = await getCallDetails(callId, this._userAuth);
                    if (callInfo.status && callInfo.status.toLowerCase() === 'active') {
                        this.props.getCallInfo(callInfo);
            
                        const { consultant = {}, consulted ={}, callerId } = callInfo;
                        const person = consultant.id === callerId ? {...consultant} : {...consulted};
                        
                        this._calleeId = person.id;
                        this._calleeJID = generateJID(person.id, true);

                        this.props.openComModal(consts.CALL, person, false, true);
                    }
                    break;
                case 'reject':
                    console.log('type - reject');
                    this.undoAutoReject();
                    (cInfo.callerId === this._curUserId) ? 
                        this.props.caleeIsBusy() : this.props.closeComModal();
                    
                    break;
                case 'forbidden':
                    console.log('type - forbidden');
                    this.undoAutoReject();
                    this.props.caleeIsBusy();
                    break;
                case 'granted':
                    console.log('type - granted');
                    this.undoAutoReject();
                    this.props.processCall();
                    //timer ???
                    this.webRtcPeer = sendOfferData(this._curUserJID, this._calleeJID, this.msgGenSend, options, cInfo);
                    break;
                case 'offerData':
                    console.log('type - offerData');
                    console.log('this._curUserJID', this._curUserJID);
                    console.log('this._calleeJID', this._calleeJID);
                    console.log('this.videoOutput', this.videoOutput);
                    console.log('this.videoInput', this.videoInput);

                    this.waitVideoElemsInterval = setInterval(() => {
                        console.log('wait interval', this.videoInput, this.videoOutput);
                        (this.videoInput && this.videoOutput) && (
                            this.props.processCall(),
                            this.webRtcPeer = sendAnswerData(this._curUserJID, this._calleeJID, bodyInner, this.msgGenSend, options, cInfo),
                            clearInterval(this.waitVideoElemsInterval),
                            this.waitVideoElemsInterval = null
                        )
                    }, 100);
                    
                    
                    break;
                case 'answerData':
                    console.log('type - answerData');
                    this.webRtcPeer && this.webRtcPeer.processAnswer(bodyInner, (err) =>{
                        err && console.log(err);
                    });
                    break;
                case 'accept':
                    console.log('type - accept');
                    this.msgGenSend(this._curUserJID, this._calleeJID, 'vcxep', 'vcxep', {type: 'speaking', callid: cInfo.callId});
                    /*this.callSecondsInterval = setInterval(
                        () => this.setState(prev => ({ callSec: prev.callSec + 1})),
                        1000
                    );*/
                    break;
                case 'speaking':
                    console.log('type - speaking');
                    this.props.speaking();
                    break;
                /*case 'avtimeEnded':
                    this.setAutoFinish();
                    break;*/
                case 'finished':
                    console.log('type - finished');
                    this.stopCommunication();
                    break;
                case 'candidateData':
                    console.log('type - candidateData');
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

    // -- Timeouts start ---
    setAutoReject = (userID) => 
        this.autoRejectTimeout = setTimeout(() => this.rejectCall(userID, true), 40000);
	undoAutoReject = () => {
		clearTimeout(this.autoRejectTimeout);
		this.autoRejectTimeout = null;
    }
    // -- Timeouts end ---

    sendPresence = () => {
        const m = Strophe.$pres({ from: this._curUserJID }).c("status", {}).t("Available");
        this.connection.send(m);
    }

    msgGenSend = (from, to, type, elemType, elemOptions = {}, body) => {
		const m = body ? 
			Strophe.$msg({ from, to, type }).c(elemType, elemOptions).t(body) 
			: Strophe.$msg({ from, to, type }).c(elemType, elemOptions);
		this.connection.send(m);
    }
    
    sendMessage = (msg, userID) => {
        console.log(' - [sendMessage] - ');
        const to = generateJID(userID, true);
		this.props.setMsg(to, msg, true);
		this.msgGenSend(this._curUserJID, to, 'chat', 'body', {}, msg);
	}

    setVideoElements = (videoOutput, videoInput) => {
        console.log("[setVideoElements]", videoOutput, videoInput);
        this.videoOutput = videoOutput;
		this.videoInput = videoInput;
    }

    callRequest = (userID, callInfo) => {
        this._calleeId = userID;
        this._calleeJID = generateJID(userID, true);
		this.setAutoReject(userID);
		this.msgGenSend(this._curUserJID, this._calleeJID, 'vcxep', 'vcxep', {type: 'request', callid: callInfo.callId, avtime: callInfo.avTime});
	}

    rejectCall = (isBusy = false) => {
        console.log(' - [rejectCall] - \nisBusy', isBusy);
		this.undoAutoReject();
        const cInfo = this.props.getCInfo() || {};
		this.msgGenSend(this._curUserJID, this._calleeJID, 'vcxep', 'vcxep', {type: 'reject', callid: cInfo.callId});
        this._calleeId = '';
        this._calleeJID = '';
        isBusy === true ? 
            this.props.caleeIsBusy() : this.props.closeComModal();
    }
    
    reqGranted = () => {
        const cInfo = this.props.getCInfo() || {};
        this.msgGenSend(this._curUserJID, this._calleeJID, 'vcxep', 'vcxep', {type: 'granted', callid: cInfo.callId});
    }

    stopCommunication = () => {
		//this.undoCallSecInterval();
		this.props.closeComModal();
		this.webRtcPeer && (
			this.webRtcPeer.dispose(),
			this.webRtcPeer = null
		);
		/*this.setState({ options: {
			mute: false,
			video: false,
			muteSpeaker: false,
		}})*/
    }
    
    finishCall = () => {
		//this.undoAutoFinish();

        const cInfo = this.props.getCInfo() || {};
		this.msgGenSend(this._curUserJID, this._calleeJID, 'vcxep', 'vcxep', {type: 'finished', callid: cInfo.callId});
		this.stopCommunication();
	}
    
}

export default Connection;

