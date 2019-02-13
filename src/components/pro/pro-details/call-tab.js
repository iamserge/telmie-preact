import { h, Component } from 'preact';
import { secToMS } from '../../../utils/index'
import { chatBtns } from '../../../utils/consts'
import { apiRoot } from "../../../api";

import { Btn, ControlBtn } from "../../communication/call-btn";

import style from './style.scss';
import chatStyle from './chatStyles.scss';
import "react-tabs/style/react-tabs.css";

class CallTab extends Component {
    componentDidMount(){
        this.props.comModal.isIncoming && this.props.connection.setVideoElements(this.videoOutput, this.videoInput);
    }

    componentWillReceiveProps(nextProps){
        (!this.props.comModal.isIncoming && nextProps.comModal.isIncoming) 
            && nextProps.connection.setVideoElements(this.videoOutput, this.videoInput);
    }

    openCall = () => {
        this.props.openCall(this.videoOutput, this.videoInput);
    }

    render(){
        const { isPro, comModal, seconds, person } = this.props;
        const { isIncoming, isOutcoming, isBusy, isCalling, callInfo = {}, isSpeaking }  = comModal;
        const {error, info } = callInfo;
        const { costPerMinute : cpm = 0 } = person.pro || {};
        let cTime;

        const title = isSpeaking ? 'On call' 
            : isCalling ? 'Connecting'
                : isOutcoming ? 'Calling Pro' : isIncoming ? 'Telmie user is calling' : '';
        const _info = error ? info : 
            (isSpeaking && isOutcoming) ? (
                cTime = secToMS(seconds),
                `£${cpm}/min - ${!!cTime.m ? cTime.m + ':' : ''}${cTime.s} - £${cTime.s > 0 ? cpm * cTime.m + cpm : cpm * cTime.m}` 
            ) : (
                (isBusy && !isCalling) ? 
                    "Sorry, I'm busy now. Please text me & I will respond ASAP." 
                    : !isIncoming && `You will pay £${cpm} per minute for this call`
            );

    //const _changeType = (type) => () => changeType(type);

        const btns = (isBusy || error) ? [{
            txt: chatBtns.cancel,
            handler: () => {} //props.closeModal,
        },{
            txt: chatBtns.textMe,
            handler: () => {}//_changeType(consts.CHAT),
        }] 
            : isOutcoming ? [{
                txt: chatBtns.decline,
                handler: (e) => this.props.rejectCall(),
            }] : [];
        


        return (
            <div>
				<div>{title}</div>
                { isPro && <div class={chatStyle.info}>{_info}</div> }

                <div style={{position: 'relative'}}>

                    <video class={chatStyle.callerStream}
                        //style={{display: (isCalling || isSpeaking) ? 'block' : 'none' }}
                        ref={el => this.videoOutput = el}
                        autoPlay
                        muted
                        /*muted={videoOptions.muteSpeaker}*//>
                    <video class={chatStyle.calleeStream}
                        poster={person.avatar ? `${apiRoot}image/${person.avatar.id}` : "/assets/nouserimage.jpg"}
                        //style={{display: (isSpeaking) ? 'block' : 'none' }}
                        ref={el => this.videoInput = el}
                        autoPlay
                        />
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
                
                { isPro && this.props.isConnected && <button id={style.callPro} class={`uk-button ${style.userControlBtn}`} onClick={this.openCall}>Call Pro</button> }

                {/*<div class={style.controls}>
                    <ControlBtn type={chatBtns.control.video} clickHandler={callControls.video} isTurnOff={videoOptions.video}/>
                    <ControlBtn type={chatBtns.control.mute} clickHandler={callControls.mute} isTurnOff={videoOptions.mute}/>
                    <ControlBtn type={chatBtns.control.speaker} clickHandler={callControls.muteSpeaker} isTurnOff={videoOptions.muteSpeaker}/>
                </div> */}
            </div>
        )
    }
}

export default CallTab;