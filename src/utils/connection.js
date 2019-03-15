import Strophe from 'npm-strophe'
import uuidv1 from 'uuid/v1'
import { getCookie, generateJID } from "./index";
import { host } from "../api";

import {
    processServerMsg, processChatMsg, processCallMsg,
    reqForbidden, sendOfferData, sendAnswerData, onIceCandidate,
    encodeXMPPmessage,
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

        this.offsetAutoGetHistory = 0;

        this.props = props;
        console.log('Connection props:',props);

        this.webRtcPeer;

        this.localStream = null;
    };

    initializeConnection = (props) => {
        const {userData : user = {}} = props;
        if (Object.keys(user).length === 0) return;
    
        const { userAuth, id } = user;
        this._curUserId = id;
        this._curUserJID = generateJID(this._curUserId);
        this._userAuth = userAuth || getCookie('USER_AUTH');
        this.connection.connect(this._curUserJID, '', this.onConnect);
        /*this.connection.rawInput = (data) => {
            console.log('rawInput:', data);
        };*/
        this.connection.rawOutput = (data) => {
            console.log('rawOutput:', data);
        };
    }

    disconnect = () => {
        this._userAuth = "";
        this._curUserId = 0;
        this._curUserJID = '';
        this._calleeId = '';
        this._calleeJID = '';
        this.connection.disconnect();
    };

    onConnect = (status) => {		
    
        console.log('[onConnect] connection', { ...this.connection });
    
        if (status == Strophe.Strophe.Status.CONNECTED) {
            console.log('Strophe is connected.');
            this.connection.addHandler(this.onMessage, null, 'message', null, null, null);
            this.connection.addHandler(this.onIq, null, 'iq', null, null, null);
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

    onIq = (msg) => {
        const type = msg.getAttribute('type'),
            elems = msg.getElementsByTagName('history');
        if (type == "result") {
            if (elems.length > 0) {
                let isDisplayed = false;
                try {
                    let thread = Strophe.Strophe.getText(elems[0].childNodes[0].getElementsByTagName('thread')[0]);

                    const participants = thread ? thread.split('-') : [];
                    const userThreadPosition = participants.indexOf(this._curUserId.toString());
    
                    const fromId = userThreadPosition === consts.THREAD.IS_CLIENT ? 
                        participants[consts.THREAD.IS_PRO] : participants[consts.THREAD.IS_CLIENT];
    
                    let arr = [];
                    let isDisplayMarked = false;
                    for (let i=0, len = elems[0].childNodes.length; i < len; i++){
                        isDisplayed = isDisplayed || (
                            elems[0].childNodes[i].getAttribute('to').split('@')[0] === this._curUserId.toString() ? (
                                elems[0].childNodes[i].getElementsByTagName('displayed')[0]) ? true : (
                                    !isDisplayMarked && (
                                        this.markChatMessage(this._curUserJID, generateJID(fromId, true), elems[0].childNodes[i].getAttribute('id'), thread, 'displayed'),
                                        isDisplayMarked = true
                                    ),
                                    false
                                ) : true
                        );

                        let text = Strophe.Strophe.getText(elems[0].childNodes[i].getElementsByTagName('body')[0]);
                        const message = encodeXMPPmessage(text);
                        arr.unshift(message);
                    }
    
                    this.props.setMsgHistory(generateJID(fromId), arr, arr.length);
                    isDisplayed ? ( 
                        this.offsetAutoGetHistory = 0 
                    ) : (
                        this.offsetAutoGetHistory = this.offsetAutoGetHistory + consts.MES_HISTORY_SIZE,
                        this.getChatMessages(...participants, this.offsetAutoGetHistory)
                    )
                }
                catch(err){
                    console.log(err);
                    return true;
                }
                
            }
        }
        return true;
    }

    onMessage = async (msg) => {
        const { 
            to, from, type, id : messId, elems, thread, vcxepElems 
        } = processServerMsg(msg);
    
        if (type == "chat" && elems.length > 0) {
            const _thread = Strophe.Strophe.getText(thread[0]);
            const userInfo = await processChatMsg(_thread, this._curUserId, this._userAuth, this.props.changeUnreadNum);
            let body_text = Strophe.Strophe.getText(elems[0]);
            const message = encodeXMPPmessage(body_text);
            
            this.props.setMsg(userInfo.id, userInfo.isUserPro, generateJID(userInfo.id), {...message, id: messId, thread: _thread});
            this.markChatMessage(this._curUserJID, generateJID(userInfo.id, true), messId, _thread, 'received');
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
                case 'dis_video':
                    console.log('dis_video');
                    break;
                case 'en_video':
                    console.log('en_video');
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
                    this.setPeerStateControl(this.webRtcPeer.peerConnection);
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
                            this.setPeerStateControl(this.webRtcPeer.peerConnection),
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
                case 'avtimeEnded':
                    this.props.setAutoFinishNotif();
                    this.setAutoFinish();
                    break;
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
                case 'connectionLost':
                    this.props.undoAutoFinishNotif();
                    this.undoAutoFinish();
                    this.stopCommunication();
                    break;
            }
        }
        return true;
    }

    setPeerStateControl = (pc) => {
        pc.oniceconnectionstatechange = () => this.connsectionIceStateCallback(pc);
    }
    connsectionIceStateCallback = (pc) => {
        (pc) && (
            pc.iceConnectionState === 'disconnected' && this.rtcConnectionLost()
        );
    }

    // -- Timeouts start ---
    setAutoReject = (userID) => 
        this.autoRejectTimeout = setTimeout(() => this.rejectCall(userID, true), 40000);
	undoAutoReject = () => {
		clearTimeout(this.autoRejectTimeout);
		this.autoRejectTimeout = null;
    }

    setAutoFinish = () => {
        this.autoFinishTimeout = setTimeout(this.finishCall, 60000);
    }
    undoAutoFinish = () => {
		clearTimeout(this.autoFinishTimeout);
		this.autoFinishTimeout = null;
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
    
    sendMessage = (text, userID, isPro, senderName, thread) => {
        console.log(' - [sendMessage] - ');
        const id = uuidv1();
        const timestamp = new Date().getTime() / 1000;
        const msg = {
            text,
            senderName,
            timestamp,
        }
        const to = generateJID(userID, true);
		this.props.setMsg(userID, isPro, to, { ...msg, id }, true);        

        let m = Strophe
            .$msg({ to, type: 'chat', id })
            .c('body')
            .t(JSON.stringify(msg));
        m.up().c("thread").t(thread);
        m.up().c("markable", {xmlns: "urn:xmpp:chat-markers:0"});
        this.connection.send(m);
    }

    getChatMessages = (clientId, proId, offset = 0, order = 'DESC') => {  

        const m = Strophe
            .$iq({ id: '#id', to: host, type: 'get' })
            .c('history', {count: consts.MES_HISTORY_SIZE, offset, order})
            .t(`${clientId}-${proId}`);

        this.connection.send(m);
    }

    markChatMessage = (from, to, id, thread, markType) => {
        let m = Strophe.$msg({ from, to, type: 'chat_status', id }).c("thread").t(thread);
        m.up().c(markType, {xmlns: "urn:xmpp:chat-markers:0", id});
        this.connection.send(m);
    }

    setVideoElements = (videoOutput, videoInput, localStream) => {
        console.log("[setVideoElements]", videoOutput, videoInput);
        this.videoOutput = videoOutput;
        this.videoInput = videoInput;
        
        localStream && (this.localStream = localStream);
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
        this.stopLocalStream();
    }
    
    reqGranted = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then((stream) => {
                this.localStream = stream;
                const cInfo = this.props.getCInfo() || {};
                this.msgGenSend(this._curUserJID, this._calleeJID, 'vcxep', 'vcxep', {type: 'granted', callid: cInfo.callId});
            })
            .catch(function(err) {
                console.log(err.name + ": " + err.message);
            });
    }

    stopCommunication = () => {
        this.props.closeComModal();
        this.stopLocalStream();
		this.webRtcPeer && (
			this.webRtcPeer.dispose(),
			this.webRtcPeer = null
		);
    }

    stopLocalStream = () => {
        this.localStream && (
            this.localStream.getTracks().forEach(track => track.stop()),
            this.localStream = null
        );
    }
    
    rtcConnectionLost = () => {
        this.props.undoAutoFinishNotif();
        this.undoAutoFinish();

        const cInfo = this.props.getCInfo() || {};
		this.msgGenSend(this._curUserJID, this._calleeJID, 'vcxep', 'vcxep', {type: 'rtcConnectionLost', callid: cInfo.callId});
		this.stopCommunication();
    }

    finishCall = () => {
        this.props.undoAutoFinishNotif();
        this.undoAutoFinish();

        const cInfo = this.props.getCInfo() || {};
		this.msgGenSend(this._curUserJID, this._calleeJID, 'vcxep', 'vcxep', {type: 'finished', callid: cInfo.callId});
		this.stopCommunication();
    }
    
    muteAudio = (isMuted) => {
        this.webRtcPeer.peerConnection.getSenders().forEach(element => {
            element.track && element.track.kind === 'audio' && (
                element.track.enabled = !isMuted
            );
        });
    }

    muteVideo = (isMuted) => {
        const cInfo = this.props.getCInfo() || {};
        const type = isMuted ? 'dis_video' : 'en_video';
		this.msgGenSend(this._curUserJID, this._calleeJID, 'vcxep', 'vcxep', {type, callid: cInfo.callId});
        this.webRtcPeer.peerConnection.getSenders().forEach(element => {
            element.track && element.track.kind === 'video' && (
                element.track.enabled = !isMuted
            );
        });
    }
    
}

export default Connection;

