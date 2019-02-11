import Strophe from 'npm-strophe'
import { getCookie, generateJID } from "./index";

import {
    processServerMsg, processChatMsg
} from './con-helpers'
    

class Connection{
    constructor(props){
        this.connection = new Strophe.Strophe.Connection('wss://sr461.2dayhost.com:5281/websocket', {});

        this._userAuth = "";
        this._curUserId = 0;
        this._curUserJID = '';
        this.props = props;
        console.log('Connection props:',props);
    };

    initializeConnection = (props) => {
        const {userData : user = {}} = props;
        if (Object.keys(user).length === 0) return;
    
        const { userAuth, id } = user;
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
            const userInfo = await processChatMsg(from, this._userAuth, this.props.changeUnreadNum);
            console.log('new msg from: ', userInfo);
            this.props.setMsg(from, Strophe.Strophe.getText(elems[0]));
            userInfo && this.props.setUsr(userInfo);
        }
    
        /*if (type === 'vcxep' && vcxepElems.length > 0){
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
        }*/
        return true;
    }

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
        const to = generateJID(userID, true);
		this.props.setMsg(to, msg, true);
		this.msgGenSend(this._curUserJID, to, 'chat', 'body', {}, msg);
	}

    


    
}

export default Connection;

