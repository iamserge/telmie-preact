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
            isVideoMuted: true,

            callSec: 0,

            isFullScreen: false,
            isFullScreenClass: false,
        };
    }
    componentDidMount(){
        const { comModal = {} } = this.props;
        comModal.isIncoming && comModal.isPickUp 
            && (
                this.props.connection.reqGranted(),
                this.props.connection.setVideoElements(this.videoOutput, this.videoInput)
            );
        document.fullscreenEnabled 
            ? document.addEventListener('fullscreenchange', this.changeFullScreenMode) 
            : document.addEventListener('keydown', this.escHandler);
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
                isVideoMuted: true,
            }),
            this.undoCallSecInterval(),
            document.fullscreenEnabled ?
                this.state.isFullScreen && this.setState({ isFullScreen: false })
                : this.state.isFullScreenClass && this.setState({ isFullScreenClass: false, })
        );

        (!prevModal.isIncoming && nextModal.isIncoming) 
            && nextProps.connection.setVideoElements(this.videoOutput, this.videoInput);
    }

    componentWillUnmount(){
        document.fullscreenEnabled 
            ? document.removeEventListener('fullscreenchange', this.changeFullScreenMode)
            : document.removeEventListener('keydown', this.escHandler);
    }

    changeFullScreenMode = () => this.setState(prev => ({ isFullScreen: !prev.isFullScreen }));
    escHandler = (e) => this.state.isFullScreenClass && e.keyCode == 27 
        && this.setState({ isFullScreenClass: false, });

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
    muteVideo = () => {
        this.setState(prev => {
            const isVideoMuted = !prev.isVideoMuted;
            this.props.connection.muteVideo(isVideoMuted);
            return { isVideoMuted };
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

    fullScreen = () => {
        document.fullscreenEnabled ? (
            this.state.isFullScreen ? 
                document.exitFullscreen() : this.videosContainer.requestFullscreen()
        ) : (
            this.setState(prev => ({ isFullScreenClass: !prev.isFullScreenClass }))
        );
    }

    render(){
        const { callSec, isFullScreenClass, isCallerMuted, isAudioMuted, isVideoMuted, isFullScreen, } = this.state;
        const { isPro, comModal, person } = this.props;
        const { isIncoming, isOutcoming, isBusy, isCalling, callInfo = {}, isSpeaking }  = comModal;
        const {error, info } = callInfo;
        const { costPerMinute : cpm = 0 } = person.pro || {};
        let cTime;

        const title = isSpeaking ? 'On call' 
            : isCalling ? 'Connecting'
                : isOutcoming ? 'Calling Pro' : isIncoming ? 'Telmie user is calling' : '';

        const _info = error ? info : 
            callSec ? (
                cTime = secToMS(callSec),
                `Time: ${cTime.m}:${cTime.s} - Total: £${getTotalPrice(cTime, cpm)}` )
                : (isSpeaking && isOutcoming) ? (
                    cTime = secToMS(callSec),
                    `£${cpm}/min - ${cTime.m}:${cTime.s} - £${getTotalPrice(cTime, cpm)}` 
                ) : (
                    (isBusy && !isCalling) ? 
                        "Sorry, I'm busy now. Please text me & I will respond ASAP." 
                        : !isIncoming && `You will pay £${cpm} per minute for this call`
                );

    //const _changeType = (type) => () => changeType(type);        

        const avatarLink = person.avatar ? `${apiRoot}image/${person.avatar.id}` : "/assets/nouserimage.jpg";

        return (
            <div style={{textAlign: "center", position: 'relative'}}>
				<div>{title}</div>

                <div class={`${chatStyle.videosContainer} ${isFullScreenClass && chatStyle.fullScreen}`} ref={el => this.videosContainer = el}>
                    <video class={chatStyle.callerStream}
                        ref={el => this.videoOutput = el}
                        autoPlay
                        playsInline
                        muted
                        style={{ visibility: isVideoMuted ? "hidden" : "visible"}}/>
                    <div class={chatStyle.calleeStreamWrapper}>
                        <video class={chatStyle.calleeStream}
                            poster={avatarLink}
                            ref={el => this.videoInput = el}
                            autoPlay
                            playsInline
                            muted={isCallerMuted}
                            //style={{ visibility: this.props.userVideoStream ? "visible" : "hidden"}}
                            />
                        <div class={chatStyle.posterDiv} 
                            style={{
                                background: `url(${avatarLink}) center no-repeat`,
                                visibility: this.props.userVideoStream ? "hidden" : "visible",
                            }}/>
                    </div>
                    
                    { isPro && <div class={chatStyle.info}>{_info}</div> }
                    <div class={chatStyle.btnArea}>
                        {
                            isSpeaking ? 
                                <Btn text={chatBtns.finish} clickHandler={this.props.connection.finishCall}/>
                                : this.props.isConnected ? 
                                    (!(isBusy || error)) && isOutcoming && <Btn text={chatBtns.decline} clickHandler={this.props.rejectCall}/>
                                    : 'Connecting to server'
                        }
                        { isSpeaking && <div class={chatStyle.controls}>
                            <ControlBtn type={chatBtns.control.video} clickHandler={this.muteVideo} isTurnOff={isVideoMuted}/>
                            <ControlBtn type={chatBtns.control.mute} clickHandler={this.muteAudio} isTurnOff={isAudioMuted}/>
                            <ControlBtn type={chatBtns.control.speaker} clickHandler={this.muteCaller} isTurnOff={isCallerMuted}/>
                            <ControlBtn type={chatBtns.control.fullScreen} clickHandler={this.fullScreen} isFullScreen={isFullScreen || isFullScreenClass}/>
                        </div> } 
                    </div>
                    
                    
                </div>

                { isPro && !isCalling && !isSpeaking && this.props.isConnected && <button id={style.callPro} class={`uk-button ${style.userControlBtn}`} onClick={this.openCall}>Call Pro</button> }
            </div>
        )
    }
}

export default CallTab;