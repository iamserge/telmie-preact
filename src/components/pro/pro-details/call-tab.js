import { h, Component } from 'preact';
import { secToMS, getTotalPrice } from '../../../utils/index'
import { chatBtns } from '../../../utils/consts'
import { apiRoot } from "../../../api";

import { Btn, ControlBtn } from "../../communication/call-btn";

import style from './style.scss';
import chatStyle from './chatStyles.scss';
import "react-tabs/style/react-tabs.css";

class CallTab extends Component {
    constructor(props){
        super(props);
        this.state = {
            isCallerMuted: false,
            isAudioMuted: false,

            callSec: 0,
        };
    }
    componentDidMount(){
        const { comModal = {} } = this.props;
        comModal.isIncoming && comModal.isPickUp 
            && (
                this.props.connection.reqGranted(),
                this.props.connection.setVideoElements(this.videoOutput, this.videoInput)
            );
    }

    componentWillReceiveProps(nextProps){
        const { comModal : prevModal } = this.props;
        const { comModal : nextModal } = nextProps;

        (!prevModal.isSpeaking && nextModal.isSpeaking) && (
            this.setState({ callSec: 0, }),
            this.setCallSecInterval()
        );

        (prevModal.isSpeaking && !nextModal.isSpeaking) && (
            this.setState({
                isCallerMuted: false,
                isAudioMuted: false,
            }),
            this.undoCallSecInterval()
        );

        (!prevModal.isIncoming && nextModal.isIncoming) 
            && nextProps.connection.setVideoElements(this.videoOutput, this.videoInput);
    }

    openCall = () => {
        this.props.openCall(this.videoOutput, this.videoInput);
    }

    muteCaller = () => {
        this.setState(prev => ({ isCallerMuted: !prev.isCallerMuted }));
    }
    muteAudio = () => {
        this.setState(prev => {
            const isAudioMuted = !prev.isAudioMuted;
            this.props.connection.muteAudio(isAudioMuted);
            return { isAudioMuted };
        })
    }

    undoCallSecInterval = () => {
		clearInterval(this.callSecondsInterval);
		this.callSecondsInterval = null;
    }
    setCallSecInterval = () => {
        this.callSecondsInterval = setInterval(
            () => this.setState(prev => ({ callSec: prev.callSec + 1})),
            1000
        );
    }

    render(){
        const { isPro, comModal, person } = this.props;
        const { isIncoming, isOutcoming, isBusy, isCalling, callInfo = {}, isSpeaking }  = comModal;
        const {error, info } = callInfo;
        const { costPerMinute : cpm = 0 } = person.pro || {};
        let cTime;

        const title = isSpeaking ? 'On call' 
            : isCalling ? 'Connecting'
                : isOutcoming ? 'Calling Pro' : isIncoming ? 'Telmie user is calling' : '';

        const _info = error ? info : 
            this.state.callSec ? (
                cTime = secToMS(this.state.callSec),
                `Time: ${cTime.m}:${cTime.s} - Total: £${getTotalPrice(cTime, cpm)}` )
                : (isSpeaking && isOutcoming) ? (
                    cTime = secToMS(this.state.callSec),
                    `£${cpm}/min - ${cTime.m}:${cTime.s} - £${getTotalPrice(cTime, cpm)}` 
                ) : (
                    (isBusy && !isCalling) ? 
                        "Sorry, I'm busy now. Please text me & I will respond ASAP." 
                        : !isIncoming && `You will pay £${cpm} per minute for this call`
                );

    //const _changeType = (type) => () => changeType(type);

        const btns = (isBusy || error) ? 
            [] : isOutcoming ? [{
                txt: chatBtns.decline,
                handler: (e) => this.props.rejectCall(),
            }] : [];
        


        return (
            <div style={{textAlign: "center"}}>
				<div>{title}</div>

                <div style={{position: 'relative'}}>
                    <video class={chatStyle.callerStream}
                        ref={el => this.videoOutput = el}
                        autoPlay
                        muted/>
                    <video class={chatStyle.calleeStream}
                        poster={person.avatar ? `${apiRoot}image/${person.avatar.id}` : "/assets/nouserimage.jpg"}
                        ref={el => this.videoInput = el}
                        autoPlay
                        muted={this.state.isCallerMuted}
                        />
                </div>

                { isPro && <div class={chatStyle.info}>{_info}</div> }

                <div class={style.controls}>
                    {/*<ControlBtn type={chatBtns.control.video} clickHandler={callControls.video} isTurnOff={videoOptions.video}/>*/}
                    <ControlBtn type={chatBtns.control.mute} clickHandler={this.muteAudio} isTurnOff={this.state.isAudioMuted}/>
                    <ControlBtn type={chatBtns.control.speaker} clickHandler={this.muteCaller} isTurnOff={this.state.isCallerMuted}/>
                </div>

                {
                    isSpeaking ? [
                        <div style={{textAlign: 'center'}}></div>,
                        <div class={chatStyle.btnArea}>
                            <Btn text={chatBtns.finish} clickHandler={this.props.connection.finishCall}/>
                        </div>
                    ] 
                        :
                    <div class={chatStyle.btnArea}>
                        {this.props.isConnected ? 
                            btns.map(el => <Btn text={el.txt} key={el.txt} clickHandler={el.handler}/>) 
                            : 'Connecting to server'}
                    </div> 
                }

                { isPro && !isCalling && !isSpeaking && this.props.isConnected && <button id={style.callPro} class={`uk-button ${style.userControlBtn}`} onClick={this.openCall}>Call Pro</button> }
            </div>
        )
    }
}

export default CallTab;